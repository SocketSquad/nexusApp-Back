import { Test, TestingModule } from '@nestjs/testing';
import { DirectMessageController } from './direct-message.controller';
import { DirectMessageService } from './providers/direct-message.service';
import { Types } from 'mongoose';
import { MessageType } from '../utils/types';
import { CreateDirectMessageDto } from './dtos/create-direct-message.dto';
import { UpdateDirectMessageDto } from './dtos/update-direct-message.dto';
import { MessageQueryDto } from './dtos/message-query.dto';

describe('DirectMessageController', () => {
  let controller: DirectMessageController;

  const mockMessage = {
    _id: new Types.ObjectId(),
    conversationId: new Types.ObjectId(),
    senderId: new Types.ObjectId(),
    content: 'Test message',
    type: MessageType.TEXT,
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn(),
    findById: jest.fn(),
    findByConversation: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getMessageCount: jest.fn(),
    getLatestMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectMessageController],
      providers: [
        {
          provide: DirectMessageService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DirectMessageController>(DirectMessageController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      const createMessageDto: CreateDirectMessageDto = {
        conversationId: mockMessage.conversationId.toString(),
        senderId: mockMessage.senderId.toString(),
        content: 'Test message',
        type: MessageType.TEXT,
        attachments: [],
      };

      mockService.create.mockResolvedValue(mockMessage);

      const result = await controller.createMessage(createMessageDto);

      expect(result).toEqual(mockMessage);
      expect(mockService.create).toHaveBeenCalledWith({
        ...createMessageDto,
        conversationId: new Types.ObjectId(createMessageDto.conversationId),
        senderId: new Types.ObjectId(createMessageDto.senderId),
        attachments: [],
      });
    });
  });

  describe('getConversationMessages', () => {
    it('should get messages for a conversation', async () => {
      const query: MessageQueryDto = { limit: 50 };
      const messages = [mockMessage];

      mockService.findByConversation.mockResolvedValue(messages);

      const result = await controller.getConversationMessages(mockMessage.conversationId.toString(), query);

      expect(result).toEqual(messages);
      expect(mockService.findByConversation).toHaveBeenCalledWith(expect.any(Types.ObjectId), 50, undefined);
    });

    it('should handle before date in query', async () => {
      const beforeDate = new Date();
      const query: MessageQueryDto = {
        limit: 50,
        before: beforeDate.toISOString(),
      };
      const messages = [mockMessage];

      mockService.findByConversation.mockResolvedValue(messages);

      const result = await controller.getConversationMessages(mockMessage.conversationId.toString(), query);

      expect(result).toEqual(messages);
      expect(mockService.findByConversation).toHaveBeenCalledWith(expect.any(Types.ObjectId), 50, beforeDate);
    });
  });

  describe('getMessage', () => {
    it('should get a specific message', async () => {
      mockService.findById.mockResolvedValue(mockMessage);

      const result = await controller.getMessage(mockMessage._id.toString());

      expect(result).toEqual(mockMessage);
      expect(mockService.findById).toHaveBeenCalledWith(expect.any(Types.ObjectId));
    });
  });

  describe('updateMessage', () => {
    it('should update a message', async () => {
      const updateMessageDto: UpdateDirectMessageDto = {
        content: 'Updated content',
        type: MessageType.TEXT,
        attachments: [],
      };

      const updatedMessage = { ...mockMessage, ...updateMessageDto };
      mockService.update.mockResolvedValue(updatedMessage);

      const result = await controller.updateMessage(mockMessage._id.toString(), updateMessageDto);

      expect(result).toEqual(updatedMessage);
      expect(mockService.update).toHaveBeenCalledWith(expect.any(Types.ObjectId), {
        ...updateMessageDto,
        attachments: [],
      });
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message', async () => {
      mockService.delete.mockResolvedValue(mockMessage);

      const result = await controller.deleteMessage(mockMessage._id.toString());

      expect(result).toEqual(mockMessage);
      expect(mockService.delete).toHaveBeenCalledWith(expect.any(Types.ObjectId));
    });
  });

  describe('getMessageCount', () => {
    it('should get message count for a conversation', async () => {
      const count = 5;
      mockService.getMessageCount.mockResolvedValue(count);

      const result = await controller.getMessageCount(mockMessage.conversationId.toString());

      expect(result).toBe(count);
      expect(mockService.getMessageCount).toHaveBeenCalledWith(expect.any(Types.ObjectId));
    });
  });

  describe('getLatestMessage', () => {
    it('should get latest message from a conversation', async () => {
      mockService.getLatestMessage.mockResolvedValue(mockMessage);

      const result = await controller.getLatestMessage(mockMessage.conversationId.toString());

      expect(result).toEqual(mockMessage);
      expect(mockService.getLatestMessage).toHaveBeenCalledWith(expect.any(Types.ObjectId));
    });
  });
});
