import { Test, TestingModule } from '@nestjs/testing';
import { GroupMessagesService } from './group-messages.service';
import { GroupMessagesRepository } from '../repositories/group-messages.repository';
import { GroupService } from '@/groups/providers/groups.service';
import { Types } from 'mongoose';
import { CreateGroupMessageDto } from '../dtos/create-group-message.dto';
import { UpdateGroupMessageDto } from '../dtos/update-group-message.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { MessageType } from '@/utils/types';

describe('GroupMessagesService', () => {
  let service: GroupMessagesService;
  let repository: GroupMessagesRepository;
  let groupService: GroupService;

  const mockGroupMessagesRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByGroupId: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    setHasAttachments: jest.fn(),
  };

  const mockGroupService = {
    checkMessageAccess: jest.fn(),
    updateLastMessage: jest.fn(),
  };

  const mockUserId = new Types.ObjectId();
  const mockGroupId = new Types.ObjectId();
  const mockMessageId = new Types.ObjectId();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupMessagesService,
        {
          provide: GroupMessagesRepository,
          useValue: mockGroupMessagesRepository,
        },
        {
          provide: GroupService,
          useValue: mockGroupService,
        },
      ],
    }).compile();

    service = module.get<GroupMessagesService>(GroupMessagesService);
    repository = module.get<GroupMessagesRepository>(GroupMessagesRepository);
    groupService = module.get<GroupService>(GroupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createMessageDto: CreateGroupMessageDto = {
      content: 'Test message',
      type: MessageType.TEXT,
    };

    it('should create a message and update group last message', async () => {
      const createdMessage = {
        _id: mockMessageId,
        groupId: mockGroupId,
        senderId: mockUserId,
        ...createMessageDto,
        createdAt: new Date(),
      };

      mockGroupService.checkMessageAccess.mockResolvedValue(true);
      mockGroupMessagesRepository.create.mockResolvedValue(createdMessage);
      mockGroupService.updateLastMessage.mockResolvedValue({});

      const result = await service.create(
        mockGroupId.toString(),
        mockUserId,
        createMessageDto
      );

      expect(groupService.checkMessageAccess).toHaveBeenCalledWith(
        mockGroupId.toString(),
        mockUserId
      );
      expect(repository.create).toHaveBeenCalledWith(
        mockGroupId,
        mockUserId,
        createMessageDto
      );
      expect(groupService.updateLastMessage).toHaveBeenCalledWith(
        mockGroupId.toString(),
        mockMessageId,
        createMessageDto.content,
        mockUserId,
        createMessageDto.type
      );
      expect(result).toEqual(createdMessage);
    });

    it('should throw ForbiddenException if user has no access', async () => {
      mockGroupService.checkMessageAccess.mockRejectedValue(
        new ForbiddenException()
      );

      await expect(
        service.create(mockGroupId.toString(), mockUserId, createMessageDto)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findById', () => {
    it('should return a message if it exists', async () => {
      const message = {
        _id: mockMessageId,
        content: 'Test message',
      };

      mockGroupMessagesRepository.findById.mockResolvedValue(message);

      const result = await service.findById(mockMessageId.toString());

      expect(repository.findById).toHaveBeenCalledWith(mockMessageId);
      expect(result).toEqual(message);
    });

    it('should throw NotFoundException if message not found', async () => {
      mockGroupMessagesRepository.findById.mockResolvedValue(null);

      await expect(
        service.findById(mockMessageId.toString())
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByGroupId', () => {
    it('should return messages for group', async () => {
      const messages = [
        { _id: mockMessageId, content: 'Test message' }
      ];

      mockGroupService.checkMessageAccess.mockResolvedValue(true);
      mockGroupMessagesRepository.findByGroupId.mockResolvedValue(messages);

      const result = await service.findByGroupId(
        mockGroupId.toString(),
        mockUserId
      );

      expect(groupService.checkMessageAccess).toHaveBeenCalledWith(
        mockGroupId.toString(),
        mockUserId
      );
      expect(repository.findByGroupId).toHaveBeenCalledWith(
        mockGroupId,
        undefined,
        undefined
      );
      expect(result).toEqual(messages);
    });

    it('should handle pagination parameters', async () => {
      const limit = 10;
      const before = '2023-01-01';
      const beforeDate = new Date(before);

      mockGroupService.checkMessageAccess.mockResolvedValue(true);
      mockGroupMessagesRepository.findByGroupId.mockResolvedValue([]);

      await service.findByGroupId(
        mockGroupId.toString(),
        mockUserId,
        limit,
        before
      );

      expect(repository.findByGroupId).toHaveBeenCalledWith(
        mockGroupId,
        limit,
        beforeDate
      );
    });
  });

  describe('update', () => {
    const updateMessageDto: UpdateGroupMessageDto = {
      content: 'Updated message'
    };

    const mockMessage = {
      _id: mockMessageId,
      senderId: { _id: mockUserId },
      content: 'Original message',
      createdAt: new Date(),
    };

    it('should update message if user is sender and within time limit', async () => {
      mockMessage.createdAt = new Date(); // Recent message
      mockGroupMessagesRepository.findById.mockResolvedValue(mockMessage);
      mockGroupMessagesRepository.update.mockResolvedValue({
        ...mockMessage,
        ...updateMessageDto
      });

      const result = await service.update(
        mockMessageId.toString(),
        mockUserId,
        updateMessageDto
      );

      expect(repository.update).toHaveBeenCalledWith(
        mockMessageId,
        updateMessageDto
      );
      expect(result.content).toBe(updateMessageDto.content);
    });

    it('should throw ForbiddenException if user is not sender', async () => {
      const differentUserId = new Types.ObjectId();
      mockGroupMessagesRepository.findById.mockResolvedValue(mockMessage);

      await expect(
        service.update(mockMessageId.toString(), differentUserId, updateMessageDto)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if message is too old', async () => {
      mockMessage.createdAt = new Date(Date.now() - 16 * 60 * 1000); // 16 minutes old
      mockGroupMessagesRepository.findById.mockResolvedValue(mockMessage);

      await expect(
        service.update(mockMessageId.toString(), mockUserId, updateMessageDto)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    const mockMessage = {
      _id: mockMessageId,
      senderId: { _id: mockUserId },
      content: 'Test message',
    };

    it('should soft delete message if user is sender', async () => {
      mockGroupMessagesRepository.findById.mockResolvedValue(mockMessage);
      mockGroupMessagesRepository.softDelete.mockResolvedValue({
        ...mockMessage,
        deletedAt: new Date()
      });

      const result = await service.delete(
        mockMessageId.toString(),
        mockUserId
      );

      expect(repository.softDelete).toHaveBeenCalledWith(mockMessageId);
      expect(result.deletedAt).toBeDefined();
    });

    it('should throw ForbiddenException if user is not sender', async () => {
      const differentUserId = new Types.ObjectId();
      mockGroupMessagesRepository.findById.mockResolvedValue(mockMessage);

      await expect(
        service.delete(mockMessageId.toString(), differentUserId)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('setHasAttachments', () => {
    it('should update message attachments status', async () => {
      const hasAttachments = true;
      const updatedMessage = {
        _id: mockMessageId,
        hasAttachments
      };

      mockGroupMessagesRepository.setHasAttachments.mockResolvedValue(updatedMessage);

      const result = await service.setHasAttachments(
        mockMessageId.toString(),
        hasAttachments
      );

      expect(repository.setHasAttachments).toHaveBeenCalledWith(
        mockMessageId,
        hasAttachments
      );
      expect(result.hasAttachments).toBe(hasAttachments);
    });
  });
});