import { Test, TestingModule } from '@nestjs/testing';
import { DirectConversationController } from './direct-conversation.controller';
import { DirectConversationService } from './providers/direct-conversation.service';
import { CreateDirectConversationDto } from './dtos/create-direct-conversation.dto';
import { UpdateLastMessageDto } from './dtos/update-last-message.dto';
import { Types } from 'mongoose';
import { DirectConversation } from './schemas/direct-conversations.schema';

describe('DirectConversationController', () => {
  let controller: DirectConversationController;
  let service: DirectConversationService;

  // Constants pour les IDs valides
  const MOCK_ID = '000000000000000000000001';
  const USER_ID = '000000000000000000000002';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectConversationController],
      providers: [
        {
          provide: DirectConversationService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByParticipant: jest.fn(),
            updateLastMessage: jest.fn(),
            updateLastRead: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DirectConversationController>(DirectConversationController);
    service = module.get<DirectConversationService>(DirectConversationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new conversation', async () => {
      const createDto: CreateDirectConversationDto = {
        participants: [{ userId: USER_ID }],
      };
      const result = {
        _id: new Types.ObjectId(MOCK_ID),
        participants: createDto.participants,
        toJSON: () => ({ _id: MOCK_ID, participants: createDto.participants }),
        toObject: () => ({ _id: MOCK_ID, participants: createDto.participants })
      } as unknown as DirectConversation;
      
      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect(await controller.create(createDto)).toEqual(result);
    });
  });

  describe('findById', () => {
    it('should return a conversation by ID', async () => {
      const result = {
        _id: new Types.ObjectId(MOCK_ID),
        participants: [],
        toJSON: () => ({ _id: MOCK_ID, participants: [] }),
        toObject: () => ({ _id: MOCK_ID, participants: [] })
      } as unknown as DirectConversation;
      
      jest.spyOn(service, 'findById').mockResolvedValue(result);
      expect(await controller.findById(MOCK_ID)).toEqual(result);
    });
  });

  describe('findByParticipant', () => {
    it('should return conversations for a user', async () => {
      const result = [{
        _id: new Types.ObjectId(MOCK_ID),
        participants: [],
        toJSON: () => ({ _id: MOCK_ID, participants: [] }),
        toObject: () => ({ _id: MOCK_ID, participants: [] })
      }] as unknown as DirectConversation[];
      
      jest.spyOn(service, 'findByParticipant').mockResolvedValue(result);
      expect(await controller.findByParticipant(USER_ID)).toEqual(result);
    });
  });

  describe('updateLastMessage', () => {
    it('should update the last message in a conversation', async () => {
      const updateDto: UpdateLastMessageDto = {
        _id: MOCK_ID,
        content: 'New message content',
        senderId: USER_ID,
        sentAt: new Date(),
      };
      const result = {
        _id: new Types.ObjectId(MOCK_ID),
        lastMessage: updateDto,
        toJSON: () => ({ _id: MOCK_ID, lastMessage: updateDto }),
        toObject: () => ({ _id: MOCK_ID, lastMessage: updateDto })
      } as unknown as DirectConversation;
      
      jest.spyOn(service, 'updateLastMessage').mockResolvedValue(result);
      expect(await controller.updateLastMessage(MOCK_ID, updateDto)).toEqual(result);
    });
  });

  describe('updateLastRead', () => {
    it('should mark a conversation as read for a user', async () => {
      const lastRead = new Date();
      const result = {
        _id: new Types.ObjectId(MOCK_ID),
        lastRead,
        toJSON: () => ({ _id: MOCK_ID, lastRead }),
        toObject: () => ({ _id: MOCK_ID, lastRead })
      } as unknown as DirectConversation;
      
      jest.spyOn(service, 'updateLastRead').mockResolvedValue(result);
      expect(await controller.updateLastRead(MOCK_ID, USER_ID)).toEqual(result);
    });
  });

  describe('delete', () => {
    it('should delete a conversation', async () => {
      const result = {
        _id: new Types.ObjectId(MOCK_ID),
        toJSON: () => ({ _id: MOCK_ID }),
        toObject: () => ({ _id: MOCK_ID })
      } as unknown as DirectConversation;
      
      jest.spyOn(service, 'delete').mockResolvedValue(result);
      expect(await controller.delete(MOCK_ID)).toEqual(result);
    });
  });
});