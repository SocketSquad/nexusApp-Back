import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestRepository } from '../repositories/friend-request.repository';
import { CreateFriendRequestDto } from '../dtos/create-friend-request.dto';
import { FriendStatus } from '../../utils/types';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('FriendRequestService', () => {
  let service: FriendRequestService;
  let repository: FriendRequestRepository;

  const mockRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findBySenderAndReceiver: jest.fn(),
    findAllByUser: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendRequestService,
        {
          provide: FriendRequestRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FriendRequestService>(FriendRequestService);
    repository = module.get<FriendRequestRepository>(FriendRequestRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: CreateFriendRequestDto = {
      senderId: new Types.ObjectId().toString(),
      receiverId: new Types.ObjectId().toString(),
    };

    it('should create a friend request successfully', async () => {
      mockRepository.findBySenderAndReceiver.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({ ...createDto, status: FriendStatus.PENDING });

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException if request already exists', async () => {
      mockRepository.findBySenderAndReceiver.mockResolvedValue({ id: '1' });

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if reverse request exists', async () => {
      mockRepository.findBySenderAndReceiver
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: '1' });

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllByUser', () => {
    it('should return all friend requests for a user', async () => {
      const userId = new Types.ObjectId().toString();
      const mockRequests = [{ id: '1' }, { id: '2' }];
      mockRepository.findAllByUser.mockResolvedValue(mockRequests);

      const result = await service.findAllByUser(userId);

      expect(result).toEqual(mockRequests);
      expect(mockRepository.findAllByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('acceptRequest', () => {
    it('should accept a friend request', async () => {
      const requestId = new Types.ObjectId().toString();
      mockRepository.findById.mockResolvedValue({ id: requestId });
      mockRepository.updateStatus.mockResolvedValue({ 
        id: requestId, 
        status: FriendStatus.ACCEPTED 
      });

      const result = await service.acceptRequest(requestId);

      expect(result.status).toBe(FriendStatus.ACCEPTED);
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(
        requestId,
        FriendStatus.ACCEPTED
      );
    });

    it('should throw NotFoundException if request not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.acceptRequest('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('rejectRequest', () => {
    it('should reject a friend request', async () => {
      const requestId = new Types.ObjectId().toString();
      mockRepository.findById.mockResolvedValue({ id: requestId });
      mockRepository.updateStatus.mockResolvedValue({ 
        id: requestId, 
        status: FriendStatus.REJECTED 
      });

      const result = await service.rejectRequest(requestId);

      expect(result.status).toBe(FriendStatus.REJECTED);
    });
  });

  describe('cancelRequest', () => {
    it('should cancel a friend request', async () => {
      const requestId = new Types.ObjectId().toString();
      mockRepository.findById.mockResolvedValue({ id: requestId });
      mockRepository.delete.mockResolvedValue({ id: requestId });

      const result = await service.cancelRequest(requestId);

      expect(result).toBeDefined();
      expect(mockRepository.delete).toHaveBeenCalledWith(requestId);
    });
  });
});