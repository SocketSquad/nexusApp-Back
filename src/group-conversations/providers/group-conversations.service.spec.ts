import { Test, TestingModule } from '@nestjs/testing';
import { GroupConversationsService } from './group-conversations.service';
import { GroupConversationsRepository } from '../repositories/group-conversations.repository';
import { CreateGroupConversationDto } from '../dtos/create-group-conversations.dto';
import { UpdateGroupConversationDto } from '../dtos/update-group-conversations.dto';
import { 
  NotFoundException, 
  ForbiddenException, 
  BadRequestException 
} from '@nestjs/common';
import { Types } from 'mongoose';

describe('GroupConversationsService', () => {
  let service: GroupConversationsService;
  let mockRepository: Partial<GroupConversationsRepository>;

  const mockUserId1 = new Types.ObjectId().toString();
  const mockUserId2 = new Types.ObjectId().toString();
  const mockConversationId = new Types.ObjectId().toString();

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addParticipant: jest.fn(),
      removeParticipant: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupConversationsService,
        {
          provide: GroupConversationsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GroupConversationsService>(GroupConversationsService);
  });

  describe('create', () => {
    it('should create a group conversation with creator as admin', async () => {
      const createDto: CreateGroupConversationDto = {
        name: 'Test Conversation',
        participants: [
          { userId: mockUserId2, role: 'member' }
        ]
      };

      const mockCreatedConversation = {
        ...createDto,
        participants: [
          { userId: mockUserId2, role: 'member' },
          { userId: mockUserId1, role: 'admin' }
        ]
      };

      (mockRepository.create as jest.Mock).mockResolvedValue(mockCreatedConversation);

      const result = await service.create(createDto, mockUserId1);

      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        participants: expect.arrayContaining([
          expect.objectContaining({ 
            userId: mockUserId1, 
            role: 'admin' 
          }),
          expect.objectContaining({ 
            userId: mockUserId2, 
            role: 'member' 
          })
        ])
      }));
      expect(result).toEqual(mockCreatedConversation);
    });

    it('should throw BadRequestException for duplicate participants', async () => {
      const createDto: CreateGroupConversationDto = {
        name: 'Test Conversation',
        participants: [
          { userId: mockUserId1, role: 'member' },
          { userId: mockUserId1, role: 'admin' }
        ]
      };

      await expect(service.create(createDto, mockUserId1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should find a conversation when user is a participant', async () => {
      const mockConversation = {
        _id: mockConversationId,
        name: 'Test Conversation',
        participants: [
          { userId: { toString: () => mockUserId1 }, role: 'admin' }
        ]
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockConversation);

      const result = await service.findById(mockConversationId, mockUserId1);

      expect(result).toEqual(mockConversation);
    });

    it('should throw ForbiddenException when user is not a participant', async () => {
      const mockConversation = {
        _id: mockConversationId,
        name: 'Test Conversation',
        participants: [
          { userId: { toString: () => mockUserId2 }, role: 'admin' }
        ]
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockConversation);

      await expect(service.findById(mockConversationId, mockUserId1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when conversation does not exist', async () => {
      (mockRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.findById(mockConversationId, mockUserId1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update conversation when user is an admin', async () => {
      const updateDto: UpdateGroupConversationDto = {
        name: 'Updated Conversation'
      };

      const mockConversation = {
        _id: mockConversationId,
        name: 'Original Conversation',
        participants: [
          { userId: { toString: () => mockUserId1 }, role: 'admin' }
        ]
      };

      const mockUpdatedConversation = {
        ...mockConversation,
        name: 'Updated Conversation'
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockConversation);
      (mockRepository.update as jest.Mock).mockResolvedValue(mockUpdatedConversation);

      const result = await service.update(mockConversationId, updateDto, mockUserId1);

      expect(result).toEqual(mockUpdatedConversation);
    });

    it('should throw ForbiddenException when user is not an admin', async () => {
      const updateDto: UpdateGroupConversationDto = {
        name: 'Updated Conversation'
      };

      const mockConversation = {
        _id: mockConversationId,
        name: 'Original Conversation',
        participants: [
          { userId: { toString: () => mockUserId1 }, role: 'member' }
        ]
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockConversation);

      await expect(
        service.update(mockConversationId, updateDto, mockUserId1)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete conversation when user is an admin', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participants: [
          { userId: { toString: () => mockUserId1 }, role: 'admin' }
        ]
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockConversation);
      (mockRepository.delete as jest.Mock).mockResolvedValue(true);

      await service.delete(mockConversationId, mockUserId1);

      expect(mockRepository.delete).toHaveBeenCalledWith(mockConversationId);
    });

    it('should throw NotFoundException when delete fails', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participants: [
          { userId: { toString: () => mockUserId1 }, role: 'admin' }
        ]
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockConversation);
      (mockRepository.delete as jest.Mock).mockResolvedValue(false);

      await expect(
        service.delete(mockConversationId, mockUserId1)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addParticipant', () => {
    it('should add participant when user is an admin', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participants: [
          { userId: { toString: () => mockUserId1 }, role: 'admin' }
        ]
      };

      const mockUpdatedConversation = {
        ...mockConversation,
        participants: [
          ...mockConversation.participants,
          { userId: { toString: () => mockUserId2 }, role: 'member' }
        ]
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockConversation);
      (mockRepository.addParticipant as jest.Mock).mockResolvedValue(mockUpdatedConversation);

      const result = await service.addParticipant(
        mockConversationId, 
        mockUserId2, 
        mockUserId1
      );

      expect(result).toEqual(mockUpdatedConversation);
    });

    it('should throw ForbiddenException when user is not an admin', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participants: [
          { userId: { toString: () => mockUserId1 }, role: 'member' }
        ]
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockConversation);

      await expect(
        service.addParticipant(
          mockConversationId, 
          mockUserId2, 
          mockUserId1
        )
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('removeParticipant', () => {
    it('should remove participant when user is an admin', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participants: [
          { userId: { toString: () => mockUserId1 }, role: 'admin' },
          { userId: { toString: () => mockUserId2 }, role: 'member' }
        ]
      };

      const mockUpdatedConversation = {
        ...mockConversation,
        participants: [
          { userId: { toString: () => mockUserId1 }, role: 'admin' }
        ]
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockConversation);
      (mockRepository.removeParticipant as jest.Mock).mockResolvedValue(mockUpdatedConversation);

      const result = await service.removeParticipant(
        mockConversationId, 
        mockUserId2, 
        mockUserId1
      );

      expect(result).toEqual(mockUpdatedConversation);
    });

    it('should throw ForbiddenException when trying to remove last admin', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participants: [
          { userId: { toString: () => mockUserId1 }, role: 'admin' }
        ]
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockConversation);

      await expect(
        service.removeParticipant(
          mockConversationId, 
          mockUserId1, 
          mockUserId1
        )
      ).rejects.toThrow(ForbiddenException);
    });
  });
});