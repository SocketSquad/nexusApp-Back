import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsService } from './attachments.service';
import { AttachmentsRepository } from '../repositories/attachments.repository';
import { NotFoundException } from '@nestjs/common';
import { AttachmentType } from '../../utils/types';
import { Types } from 'mongoose';


describe('AttachmentsService', () => {
  let service: AttachmentsService;
  let repository: AttachmentsRepository;

  const mockAttachment = {
    _id: new Types.ObjectId(),
    messageId: new Types.ObjectId(),
    messageType: 'DirectMessage',
    type: AttachmentType.IMAGE,
    fileName: 'test.jpg',
    url: 'https://example.com/test.jpg',
    size: 1024,
    uploaderId: new Types.ObjectId(),
  };

  const mockAttachmentsRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByMessageId: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    deleteByMessageId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentsService,
        {
          provide: AttachmentsRepository,
          useValue: mockAttachmentsRepository,
        },
      ],
    }).compile();

    service = module.get<AttachmentsService>(AttachmentsService);
    repository = module.get<AttachmentsRepository>(AttachmentsRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an attachment', async () => {
      const createAttachmentDto = {
        messageId: mockAttachment.messageId.toString(),
        messageType: 'DirectMessage' as const,
        type: AttachmentType.IMAGE,
        fileName: 'test.jpg',
        url: 'https://example.com/test.jpg',
        size: 1024,
      };
      const uploaderId = mockAttachment.uploaderId.toString();

      mockAttachmentsRepository.create.mockResolvedValue(mockAttachment);

      const result = await service.create(createAttachmentDto, uploaderId);

      expect(repository.create).toHaveBeenCalledWith(createAttachmentDto, uploaderId);
      expect(result).toEqual(mockAttachment);
    });
  });

  describe('findById', () => {
    it('should find an attachment by id', async () => {
      mockAttachmentsRepository.findById.mockResolvedValue(mockAttachment);

      const result = await service.findById(mockAttachment._id.toString());

      expect(repository.findById).toHaveBeenCalledWith(mockAttachment._id.toString());
      expect(result).toEqual(mockAttachment);
    });

    it('should throw NotFoundException when attachment not found', async () => {
      mockAttachmentsRepository.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByMessageId', () => {
    it('should find attachments by message id', async () => {
      const attachments = [mockAttachment];
      mockAttachmentsRepository.findByMessageId.mockResolvedValue(attachments);

      const result = await service.findByMessageId(mockAttachment.messageId.toString());

      expect(repository.findByMessageId).toHaveBeenCalledWith(
        mockAttachment.messageId.toString(),
      );
      expect(result).toEqual(attachments);
    });
  });

  describe('delete', () => {
    it('should delete an attachment when user is the uploader', async () => {
      mockAttachmentsRepository.findById.mockResolvedValue(mockAttachment);
      mockAttachmentsRepository.delete.mockResolvedValue(mockAttachment);

      const result = await service.delete(
        mockAttachment._id.toString(),
        mockAttachment.uploaderId.toString(),
      );

      expect(repository.delete).toHaveBeenCalledWith(mockAttachment._id.toString());
      expect(result).toEqual(mockAttachment);
    });

    it('should throw error when user is not the uploader', async () => {
      mockAttachmentsRepository.findById.mockResolvedValue(mockAttachment);

      await expect(
        service.delete(
          mockAttachment._id.toString(),
          new Types.ObjectId().toString(),
        ),
      ).rejects.toThrow('Unauthorized to delete this attachment');
    });
  });
});