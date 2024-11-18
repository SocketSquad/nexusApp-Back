import { Test, TestingModule } from '@nestjs/testing';
import { GroupMessagesService } from '../providers/group-messages.service';
import { GroupMessagesRepository } from '../repositories/group-messages.repository';
import { CreateGroupMessageDto } from '../dtos/create-group-message.dto';
import { UpdateGroupMessageDto } from '../dtos/update-group-message.dto';
import { MessageType } from '../../utils/types';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

describe('GroupMessagesService', () => {
  let service: GroupMessagesService;
  let mockRepository: {
    create: jest.Mock;
    findByConversation: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findByConversation: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupMessagesService,
        {
          provide: GroupMessagesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GroupMessagesService>(GroupMessagesService);
  });

  // Create Method Tests
  describe('create', () => {
    const validCreateDto: CreateGroupMessageDto = {
      conversationId: '60d5ecb54b093a001f3e6f2a',
      senderId: '60d5ecb54b093a001f3e6f2b',
      content: 'Hello world',
      type: MessageType.TEXT,
    };

    it('should create a message successfully', async () => {
      const mockMessage = { ...validCreateDto, _id: 'messageid' };
      mockRepository.create.mockResolvedValue(mockMessage);

      const result = await service.create(validCreateDto);
      expect(result).toEqual(mockMessage);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(validCreateDto));
    });

    it('should extract mentions from content', async () => {
      const dtoWithMentions: CreateGroupMessageDto = {
        ...validCreateDto,
        content: 'Hello @john and @jane',
      };
      
      mockRepository.create.mockResolvedValue(dtoWithMentions);

      const result = await service.create(dtoWithMentions);
      expect(result.mentions).toEqual(['john', 'jane']);
    });

    it('should throw BadRequestException for empty text message', async () => {
      const emptyTextDto: CreateGroupMessageDto = {
        ...validCreateDto,
        content: '   ',
      };

      await expect(service.create(emptyTextDto)).rejects.toThrow(BadRequestException);
    });
  });

  // Find By Conversation Tests
  describe('findByConversation', () => {
    it('should retrieve messages for a conversation', async () => {
      const mockResult = {
        messages: [{ _id: 'msg1' }, { _id: 'msg2' }],
        total: 2,
      };
      mockRepository.findByConversation.mockResolvedValue(mockResult);

      const result = await service.findByConversation('conversationId');
      expect(result).toEqual(mockResult);
    });
  });

  // Find By ID Tests
  describe('findById', () => {
    it('should retrieve a message by ID', async () => {
      const mockMessage = { _id: 'messageid', content: 'Test message' };
      mockRepository.findById.mockResolvedValue(mockMessage);

      const result = await service.findById('messageid');
      expect(result).toEqual(mockMessage);
    });

    it('should throw NotFoundException for non-existent message', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('invalidid')).rejects.toThrow(NotFoundException);
    });
  });

  // Update Method Tests
  describe('update', () => {
    const mockMessage = {
      _id: 'messageid',
      senderId: { toString: () => 'user1' },
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    };

    const updateDto: UpdateGroupMessageDto = {
      content: 'Updated message',
    };

    beforeEach(() => {
      mockRepository.findById.mockResolvedValue(mockMessage);
    });

    it('should update a message successfully', async () => {
      const updatedMessage = { ...mockMessage, ...updateDto };
      mockRepository.update.mockResolvedValue(updatedMessage);

      const result = await service.update('messageid', updateDto, 'user1');
      expect(result).toEqual(updatedMessage);
    });

    it('should throw ForbiddenException for updating others message', async () => {
      await expect(service.update('messageid', updateDto, 'differentuser')).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException for updating message older than 15 minutes', async () => {
      const oldMessage = {
        ...mockMessage,
        createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      };
      mockRepository.findById.mockResolvedValue(oldMessage);

      await expect(service.update('messageid', updateDto, 'user1')).rejects.toThrow(ForbiddenException);
    });
  });

  // Delete Method Tests
  describe('delete', () => {
    const mockMessage = {
      _id: 'messageid',
      senderId: { toString: () => 'user1' },
    };

    beforeEach(() => {
      mockRepository.findById.mockResolvedValue(mockMessage);
    });

    it('should delete a message successfully', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await expect(service.delete('messageid', 'user1')).resolves.not.toThrow();
    });

    it('should throw ForbiddenException for deleting others message', async () => {
      await expect(service.delete('messageid', 'differentuser')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if delete fails', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.delete('messageid', 'user1')).rejects.toThrow(NotFoundException);
    });
  });
});