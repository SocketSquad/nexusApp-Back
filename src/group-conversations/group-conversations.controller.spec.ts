import { Test, TestingModule } from '@nestjs/testing';
import { GroupConversationsController } from './group-conversations.controller';
import { GroupConversationsService } from './providers/group-conversations.service';
import { Types } from 'mongoose';
import { CreateGroupConversationDto } from './dtos/create-group-conversations.dto';
import { UpdateGroupConversationDto } from './dtos/update-group-conversations.dto';



describe('GroupConversationsController', () => {
  let controller: GroupConversationsController;
  let mockService: jest.Mocked<GroupConversationsService>;

  const mockConversation = {
    _id: new Types.ObjectId(),
    name: 'Test Group',
    participants: [
      { 
        userId: new Types.ObjectId(), 
        role: 'admin' 
      },
      { 
        userId: new Types.ObjectId(), 
        role: 'member' 
      }
    ]
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupConversationsController],
      providers: [
        {
          provide: GroupConversationsService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByUser: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addParticipant: jest.fn(),
            removeParticipant: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<GroupConversationsController>(GroupConversationsController);
    mockService = module.get(GroupConversationsService);
  });

  describe('createConversation', () => {
    it('should create a new conversation', async () => {
      const createDto: CreateGroupConversationDto = {
        name: 'New Group',
        participants: [
          { userId: new Types.ObjectId().toString(), role: 'admin' }
        ]
      };
      const creatorId = createDto.participants[0].userId.toString();

      mockService.create.mockResolvedValue(mockConversation as any);
      
      const result = await controller.createConversation(createDto, creatorId);

      expect(mockService.create).toHaveBeenCalledWith(createDto, creatorId);
      expect(result).toBe(mockConversation);
    });
  });

  describe('getConversationById', () => {
    it('should retrieve a conversation by id', async () => {
      const conversationId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();

      mockService.findById.mockResolvedValue(mockConversation as any);

      const result = await controller.getConversationById(conversationId, userId);

      expect(mockService.findById).toHaveBeenCalledWith(conversationId, userId);
      expect(result).toBe(mockConversation);
    });
  });

  describe('getUserConversations', () => {
    it('should retrieve conversations for a user', async () => {
      const userId = new Types.ObjectId().toString();
      const conversations = [mockConversation];

      mockService.findByUser.mockResolvedValue(conversations as any);

      const result = await controller.getUserConversations(userId);

      expect(mockService.findByUser).toHaveBeenCalledWith(userId);
      expect(result).toBe(conversations);
    });
  });

  describe('updateConversation', () => {
    it('should update a conversation', async () => {
      const conversationId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();
      const updateDto: UpdateGroupConversationDto = {
        name: 'Updated Group Name'
      };

      mockService.update.mockResolvedValue({...mockConversation, ...updateDto} as any);

      const result = await controller.updateConversation(conversationId, updateDto, userId);

      expect(mockService.update).toHaveBeenCalledWith(conversationId, updateDto, userId);
      expect(result.name).toBe('Updated Group Name');
    });
  });

  describe('deleteConversation', () => {
    it('should delete a conversation', async () => {
      const conversationId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();

      mockService.delete.mockResolvedValue(undefined);

      const result = await controller.deleteConversation(conversationId, userId);

      expect(mockService.delete).toHaveBeenCalledWith(conversationId, userId);
      expect(result).toBeUndefined();
    });
  });

  describe('addParticipant', () => {
    it('should add a participant to a conversation', async () => {
      const conversationId = new Types.ObjectId().toString();
      const participantId = new Types.ObjectId().toString();
      const addedById = new Types.ObjectId().toString();

      mockService.addParticipant.mockResolvedValue({
        ...mockConversation,
        participants: [
          ...mockConversation.participants,
          { userId: new Types.ObjectId(participantId), role: 'member' }
        ]
      } as any);

      const result = await controller.addParticipant(
        conversationId, 
        participantId, 
        addedById
      );

      expect(mockService.addParticipant).toHaveBeenCalledWith(
        conversationId, 
        participantId, 
        addedById
      );
      expect(result.participants).toHaveLength(3);
    });
  });

  describe('removeParticipant', () => {
    it('should remove a participant from a conversation', async () => {
      const conversationId = new Types.ObjectId().toString();
      const participantId = new Types.ObjectId().toString();
      const removedById = new Types.ObjectId().toString();

      mockService.removeParticipant.mockResolvedValue({
        ...mockConversation,
        participants: [mockConversation.participants[0]]
      } as any);

      const result = await controller.removeParticipant(
        conversationId, 
        participantId, 
        removedById
      );

      expect(mockService.removeParticipant).toHaveBeenCalledWith(
        conversationId, 
        participantId, 
        removedById
      );
      expect(result.participants).toHaveLength(1);
    });
  });
});