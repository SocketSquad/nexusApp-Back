import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './providers/friend-request.service';
import { CreateFriendRequestDto } from './dtos/create-friend-request.dto';
import { Types } from 'mongoose';

describe('FriendRequestController', () => {
  let controller: FriendRequestController;

  const mockFriendRequestService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    acceptRequest: jest.fn(),
    rejectRequest: jest.fn(),
    cancelRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendRequestController],
      providers: [
        {
          provide: FriendRequestService,
          useValue: mockFriendRequestService,
        },
      ],
    }).compile();

    controller = module.get<FriendRequestController>(FriendRequestController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a friend request', async () => {
      const createDto: CreateFriendRequestDto = {
        senderId: new Types.ObjectId().toString(),
        receiverId: new Types.ObjectId().toString(),
      };
      const expectedResult = { ...createDto, id: '1' };

      mockFriendRequestService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(mockFriendRequestService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAllForUser', () => {
    it('should return all friend requests for a user', async () => {
      const userId = new Types.ObjectId().toString();
      const expectedRequests = [{ id: '1' }, { id: '2' }];

      mockFriendRequestService.findAllByUser.mockResolvedValue(expectedRequests);

      const result = await controller.findAllForUser(userId);

      expect(result).toEqual(expectedRequests);
      expect(mockFriendRequestService.findAllByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('acceptRequest', () => {
    it('should accept a friend request', async () => {
      const requestId = new Types.ObjectId().toString();
      const expectedResult = { id: requestId, status: 'ACCEPTED' };

      mockFriendRequestService.acceptRequest.mockResolvedValue(expectedResult);

      const result = await controller.acceptRequest(requestId);

      expect(result).toEqual(expectedResult);
      expect(mockFriendRequestService.acceptRequest).toHaveBeenCalledWith(requestId);
    });
  });

  describe('rejectRequest', () => {
    it('should reject a friend request', async () => {
      const requestId = new Types.ObjectId().toString();
      const expectedResult = { id: requestId, status: 'REJECTED' };

      mockFriendRequestService.rejectRequest.mockResolvedValue(expectedResult);

      const result = await controller.rejectRequest(requestId);

      expect(result).toEqual(expectedResult);
      expect(mockFriendRequestService.rejectRequest).toHaveBeenCalledWith(requestId);
    });
  });

  describe('cancelRequest', () => {
    it('should cancel a friend request', async () => {
      const requestId = new Types.ObjectId().toString();
      const expectedResult = { id: requestId };

      mockFriendRequestService.cancelRequest.mockResolvedValue(expectedResult);

      const result = await controller.cancelRequest(requestId);

      expect(result).toEqual(expectedResult);
      expect(mockFriendRequestService.cancelRequest).toHaveBeenCalledWith(requestId);
    });
  });
});