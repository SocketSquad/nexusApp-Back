import { Test, TestingModule } from '@nestjs/testing';
import { DirectMessageService } from './direct-message.service';
import { DirectMessageRepository } from '../repositories/direct-message.repository';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { MessageType } from '../../utils/types';

describe('DirectMessageService', () => {
  let service: DirectMessageService;

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

  const mockRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByConversation: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    countMessages: jest.fn(),
    findLatestMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DirectMessageService,
        {
          provide: DirectMessageRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DirectMessageService>(DirectMessageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new message', async () => {
      const createMessageDto = {
        conversationId: new Types.ObjectId(),
        senderId: new Types.ObjectId(),
        content: 'Test message',
        type: MessageType.TEXT,
      };

      mockRepository.create.mockResolvedValue(mockMessage);

      const result = await service.create(createMessageDto);

      expect(result).toEqual(mockMessage);
      expect(mockRepository.create).toHaveBeenCalledWith(createMessageDto);
    });
  });

  describe('findById', () => {
    it('should find a message by id', async () => {
      mockRepository.findById.mockResolvedValue(mockMessage);

      const result = await service.findById(mockMessage._id);

      expect(result).toEqual(mockMessage);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockMessage._id);
    });

    it('should throw NotFoundException when message not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(mockMessage._id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByConversation', () => {
    it('should find messages by conversation id', async () => {
      const messages = [mockMessage];
      mockRepository.findByConversation.mockResolvedValue(messages);

      const result = await service.findByConversation(mockMessage.conversationId, 50);

      expect(result).toEqual(messages);
      expect(mockRepository.findByConversation).toHaveBeenCalledWith(mockMessage.conversationId, 50, undefined);
    });

    it('should find messages before a specific date', async () => {
      const messages = [mockMessage];
      const beforeDate = new Date();
      mockRepository.findByConversation.mockResolvedValue(messages);

      const result = await service.findByConversation(mockMessage.conversationId, 50, beforeDate);

      expect(result).toEqual(messages);
      expect(mockRepository.findByConversation).toHaveBeenCalledWith(mockMessage.conversationId, 50, beforeDate);
    });
  });

  describe('update', () => {
    it('should update a message', async () => {
      const updateData = {
        content: 'Updated content',
      };
      const updatedMessage = { ...mockMessage, ...updateData };
      mockRepository.update.mockResolvedValue(updatedMessage);

      const result = await service.update(mockMessage._id, updateData);

      expect(result).toEqual(updatedMessage);
      expect(mockRepository.update).toHaveBeenCalledWith(mockMessage._id, updateData);
    });

    it('should throw NotFoundException when message not found during update', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update(mockMessage._id, { content: 'Updated content' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a message', async () => {
      mockRepository.delete.mockResolvedValue(mockMessage);

      const result = await service.delete(mockMessage._id);

      expect(result).toEqual(mockMessage);
      expect(mockRepository.delete).toHaveBeenCalledWith(mockMessage._id);
    });

    it('should throw NotFoundException when message not found during deletion', async () => {
      mockRepository.delete.mockResolvedValue(null);

      await expect(service.delete(mockMessage._id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMessageCount', () => {
    it('should get message count for a conversation', async () => {
      const count = 5;
      mockRepository.countMessages.mockResolvedValue(count);

      const result = await service.getMessageCount(mockMessage.conversationId);

      expect(result).toBe(count);
      expect(mockRepository.countMessages).toHaveBeenCalledWith(mockMessage.conversationId);
    });
  });

  describe('getLatestMessage', () => {
    it('should get latest message from a conversation', async () => {
      mockRepository.findLatestMessage.mockResolvedValue(mockMessage);

      const result = await service.getLatestMessage(mockMessage.conversationId);

      expect(result).toEqual(mockMessage);
      expect(mockRepository.findLatestMessage).toHaveBeenCalledWith(mockMessage.conversationId);
    });

    it('should throw NotFoundException when no messages found', async () => {
      mockRepository.findLatestMessage.mockResolvedValue(null);

      await expect(service.getLatestMessage(mockMessage.conversationId)).rejects.toThrow(NotFoundException);
    });
  });
});
