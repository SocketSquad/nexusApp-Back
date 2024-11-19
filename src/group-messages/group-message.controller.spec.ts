import { Test, TestingModule } from '@nestjs/testing';
import { GroupMessagesController } from './group-messages.controller';
import { GroupMessagesService } from './providers/group-messages.service';
import { CreateGroupMessageDto } from './dtos/create-group-message.dto';
import { MessageType } from '../../src/utils/types';
import { UpdateGroupMessageDto } from './dtos/update-group-message.dto';

describe('GroupMessagesController', () => {
  let controller: GroupMessagesController;
  let mockService: {
    create: jest.Mock;
    findByConversation: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findByConversation: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupMessagesController],
      providers: [
        {
          provide: GroupMessagesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<GroupMessagesController>(GroupMessagesController);
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
      mockService.create.mockResolvedValue(mockMessage);

      const result = await controller.create(validCreateDto);
      expect(result).toEqual(mockMessage);
      expect(mockService.create).toHaveBeenCalledWith(validCreateDto);
    });
  });

  // Find By Conversation Tests
  describe('findByConversation', () => {
    it('should retrieve messages for a conversation', async () => {
      const mockResult = {
        messages: [{ _id: 'msg1' }, { _id: 'msg2' }],
        total: 2,
      };
      mockService.findByConversation.mockResolvedValue(mockResult);

      const result = await controller.findByConversation('conversationId');
      expect(result).toEqual(mockResult);
      expect(mockService.findByConversation).toHaveBeenCalledWith('conversationId', 1, 50);
    });

    it('should use custom pagination', async () => {
      const mockResult = {
        messages: [{ _id: 'msg1' }],
        total: 1,
      };
      mockService.findByConversation.mockResolvedValue(mockResult);

      const result = await controller.findByConversation('conversationId', 2, 10);
      expect(result).toEqual(mockResult);
      expect(mockService.findByConversation).toHaveBeenCalledWith('conversationId', 2, 10);
    });
  });

  // Find By ID Tests
  describe('findOne', () => {
    it('should retrieve a message by ID', async () => {
      const mockMessage = { _id: 'messageid', content: 'Test message' };
      mockService.findById.mockResolvedValue(mockMessage);

      const result = await controller.findOne('messageid');
      expect(result).toEqual(mockMessage);
      expect(mockService.findById).toHaveBeenCalledWith('messageid');
    });
  });

  // Update Method Tests
  describe('update', () => {
    const updateDto: UpdateGroupMessageDto = {
      content: 'Updated message',
    };

    it('should update a message successfully', async () => {
      const mockUpdatedMessage = {
        _id: 'messageid',
        ...updateDto,
      };
      mockService.update.mockResolvedValue(mockUpdatedMessage);

      const result = await controller.update('messageid', updateDto, 'userId');
      expect(result).toEqual(mockUpdatedMessage);
      expect(mockService.update).toHaveBeenCalledWith('messageid', updateDto, 'userId');
    });
  });

  // Delete Method Tests
  describe('remove', () => {
    it('should delete a message successfully', async () => {
      mockService.delete.mockResolvedValue(undefined);

      await expect(controller.remove('messageid', 'userId')).resolves.not.toThrow();
      expect(mockService.delete).toHaveBeenCalledWith('messageid', 'userId');
    });
  });
});
