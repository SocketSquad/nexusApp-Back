import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsController } from './attachments.controller';
import { Types } from 'mongoose';
import { AttachmentsService } from './providers/attachments.service';
import { AttachmentType } from '@/utils/types';
import { CreateAttachmentDto } from './dtos/create-attachments.dto';
import { QueryAttachmentDto } from './dtos/query-attachments.dto';


describe('AttachmentsController', () => {
  let controller: AttachmentsController;
  let service: AttachmentsService;

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

  const mockUser = {
    id: mockAttachment.uploaderId.toString(),
    email: 'test@example.com',
  };

  const mockAttachmentsService = {
    create: jest.fn(),
    findById: jest.fn(),
    findByMessageId: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentsController],
      providers: [
        {
          provide: AttachmentsService,
          useValue: mockAttachmentsService,
        },
      ],
    }).compile();

    controller = module.get<AttachmentsController>(AttachmentsController);
    service = module.get<AttachmentsService>(AttachmentsService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an attachment', async () => {
      const createAttachmentDto: CreateAttachmentDto = {
        messageId: mockAttachment.messageId.toString(),
        messageType: 'DirectMessage',
        type: AttachmentType.IMAGE,
        fileName: 'test.jpg',
        url: 'https://example.com/test.jpg',
        size: 1024,
      };

      mockAttachmentsService.create.mockResolvedValue(mockAttachment);

      const result = await controller.create(createAttachmentDto, { user: mockUser });

      expect(service.create).toHaveBeenCalledWith(
        createAttachmentDto,
        mockUser.id,
      );
      expect(result).toEqual(mockAttachment);
    });
  });

  describe('findById', () => {
    it('should find an attachment by id', async () => {
      mockAttachmentsService.findById.mockResolvedValue(mockAttachment);

      const result = await controller.findById(mockAttachment._id.toString());

      expect(service.findById).toHaveBeenCalledWith(mockAttachment._id.toString());
      expect(result).toEqual(mockAttachment);
    });
  });

  describe('findByMessageId', () => {
    it('should find attachments by message id', async () => {
      const attachments = [mockAttachment];
      mockAttachmentsService.findByMessageId.mockResolvedValue(attachments);

      const result = await controller.findByMessageId(
        mockAttachment.messageId.toString(),
      );

      expect(service.findByMessageId).toHaveBeenCalledWith(
        mockAttachment.messageId.toString(),
      );
      expect(result).toEqual(attachments);
    });
  });

  describe('find', () => {
    it('should find attachments by query', async () => {
      const query: QueryAttachmentDto = {
        messageType: 'DirectMessage',
      };
      const attachments = [mockAttachment];

      mockAttachmentsService.find.mockResolvedValue(attachments);

      const result = await controller.find(query);

      expect(service.find).toHaveBeenCalledWith(query);
      expect(result).toEqual(attachments);
    });
  });

  describe('delete', () => {
    it('should delete an attachment', async () => {
      mockAttachmentsService.delete.mockResolvedValue(mockAttachment);

      const result = await controller.delete(mockAttachment._id.toString(), {
        user: mockUser,
      });

      expect(service.delete).toHaveBeenCalledWith(
        mockAttachment._id.toString(),
        mockUser.id,
      );
      expect(result).toEqual(mockAttachment);
    });
  });
});

// Test Helper Types (create a new file called test-helpers.ts if needed)
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidMongoId(): R;
    }
  }
}

// Custom matcher for MongoDB ObjectId validation
expect.extend({
  toBeValidMongoId(received) {
    const pass = Types.ObjectId.isValid(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid MongoDB ObjectId`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid MongoDB ObjectId`,
        pass: false,
      };
    }
  },
});