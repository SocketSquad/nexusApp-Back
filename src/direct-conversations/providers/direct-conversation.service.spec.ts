import { Test, TestingModule } from '@nestjs/testing';
import { DirectConversationService } from './direct-conversation.service';
import { DirectConversationRepository } from '../repositories/direct-conversation.repository';
import { Types } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DirectConversation } from '../schemas/direct-conversations.schema';

describe('DirectConversationService', () => {
  let service: DirectConversationService;

  const mockRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByParticipant: jest.fn(),
    updateLastMessage: jest.fn(),
    updateLastRead: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DirectConversationService,
        {
          provide: DirectConversationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DirectConversationService>(DirectConversationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockConversation = {
      _id: new Types.ObjectId('000000000000000000000001'),
      participants: [{ userId: new Types.ObjectId('000000000000000000000002') }, { userId: new Types.ObjectId('000000000000000000000003') }],
      toJSON: () => ({
        _id: '000000000000000000000001',
        participants: [{ userId: '000000000000000000000002' }, { userId: '000000000000000000000003' }],
      }),
      toObject: () => ({
        _id: '000000000000000000000001',
        participants: [{ userId: '000000000000000000000002' }, { userId: '000000000000000000000003' }],
      }),
    } as unknown as DirectConversation;

    it('should create a conversation with 2 participants', async () => {
      mockRepository.create.mockResolvedValue(mockConversation);

      const result = await service.create({
        participants: [{ userId: new Types.ObjectId('000000000000000000000002') }, { userId: new Types.ObjectId('000000000000000000000003') }],
      });

      expect(result).toEqual(mockConversation);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if not exactly 2 participants', async () => {
      await expect(
        service.create({
          participants: [{ userId: new Types.ObjectId('000000000000000000000002') }],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    const mockConversation = {
      _id: new Types.ObjectId('000000000000000000000001'),
      participants: [],
      toJSON: () => ({ _id: '000000000000000000000001', participants: [] }),
      toObject: () => ({ _id: '000000000000000000000001', participants: [] }),
    } as unknown as DirectConversation;

    it('should find a conversation by id', async () => {
      mockRepository.findById.mockResolvedValue(mockConversation);

      const result = await service.findById('000000000000000000000001');

      expect(result).toEqual(mockConversation);
      expect(mockRepository.findById).toHaveBeenCalledWith(new Types.ObjectId('000000000000000000000001'));
    });

    it('should throw NotFoundException if conversation not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('000000000000000000000001')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByParticipant', () => {
    const mockConversations = [
      {
        _id: new Types.ObjectId('000000000000000000000001'),
        participants: [],
        toJSON: () => ({ _id: '000000000000000000000001', participants: [] }),
        toObject: () => ({ _id: '000000000000000000000001', participants: [] }),
      },
    ] as unknown as DirectConversation[];

    it('should find conversations by participant', async () => {
      mockRepository.findByParticipant.mockResolvedValue(mockConversations);

      const result = await service.findByParticipant('000000000000000000000002');

      expect(result).toEqual(mockConversations);
      expect(mockRepository.findByParticipant).toHaveBeenCalledWith(new Types.ObjectId('000000000000000000000002'));
    });
  });

  describe('updateLastMessage', () => {
    const mockConversation = {
      _id: new Types.ObjectId('000000000000000000000001'),
      lastMessage: {
        _id: new Types.ObjectId('000000000000000000000004'),
        content: 'test',
        senderId: new Types.ObjectId('000000000000000000000002'),
        sentAt: new Date(),
      },
      toJSON: () => ({ _id: '000000000000000000000001' }),
      toObject: () => ({ _id: '000000000000000000000001' }),
    } as unknown as DirectConversation;

    it('should update last message', async () => {
      mockRepository.updateLastMessage.mockResolvedValue(mockConversation);

      const result = await service.updateLastMessage('000000000000000000000001', {
        _id: new Types.ObjectId('000000000000000000000004'),
        content: 'test',
        senderId: new Types.ObjectId('000000000000000000000002'),
        sentAt: new Date(),
      });

      expect(result).toEqual(mockConversation);
    });

    it('should throw NotFoundException if conversation not found', async () => {
      mockRepository.updateLastMessage.mockResolvedValue(null);

      await expect(
        service.updateLastMessage('000000000000000000000001', {
          _id: new Types.ObjectId('000000000000000000000004'),
          content: 'test',
          senderId: new Types.ObjectId('000000000000000000000002'),
          sentAt: new Date(),
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateLastRead', () => {
    const mockConversation = {
      _id: new Types.ObjectId('000000000000000000000001'),
      lastRead: new Date(),
      toJSON: () => ({ _id: '000000000000000000000001' }),
      toObject: () => ({ _id: '000000000000000000000001' }),
    } as unknown as DirectConversation;

    it('should update last read timestamp', async () => {
      mockRepository.updateLastRead.mockResolvedValue(mockConversation);

      const result = await service.updateLastRead('000000000000000000000001', '000000000000000000000002');

      expect(result).toEqual(mockConversation);
      expect(mockRepository.updateLastRead.mock.calls[0][0]).toEqual(new Types.ObjectId('000000000000000000000001'));
      expect(mockRepository.updateLastRead.mock.calls[0][1]).toEqual(new Types.ObjectId('000000000000000000000002'));
      expect(mockRepository.updateLastRead.mock.calls[0][2]).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException if conversation not found', async () => {
      mockRepository.updateLastRead.mockResolvedValue(null);

      await expect(service.updateLastRead('000000000000000000000001', '000000000000000000000002')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    const mockConversation = {
      _id: new Types.ObjectId('000000000000000000000001'),
      toJSON: () => ({ _id: '000000000000000000000001' }),
      toObject: () => ({ _id: '000000000000000000000001' }),
    } as unknown as DirectConversation;

    it('should delete a conversation', async () => {
      mockRepository.delete.mockResolvedValue(mockConversation);

      const result = await service.delete('000000000000000000000001');

      expect(result).toEqual(mockConversation);
      expect(mockRepository.delete).toHaveBeenCalledWith(new Types.ObjectId('000000000000000000000001'));
    });

    it('should throw NotFoundException if conversation not found', async () => {
      mockRepository.delete.mockResolvedValue(null);

      await expect(service.delete('000000000000000000000001')).rejects.toThrow(NotFoundException);
    });
  });
});
