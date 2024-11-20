import { Test, TestingModule } from '@nestjs/testing';
import { FriendService } from './friend.service';
import { NotFoundException } from '@nestjs/common';
import { FriendStatus } from '../../utils/types';
import { IFriendRepository } from '../interfaces/friend.repository.interface';
import { Friend } from '../schemas/friend.schema';

describe('FriendService', () => {
  let service: FriendService;
  let mockRepository: jest.Mocked<IFriendRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendService,
        {
          provide: 'IFriendRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FriendService>(FriendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new friend relationship', async () => {
      const createFriendDto = {
        senderId: 'sender123',
        receiverId: 'receiver123',
        status: FriendStatus.PENDING,
      };

      const expectedResult = {
        _id: 'friend123',
        senderId: 'sender123',
        receiverId: 'receiver123',
        status: FriendStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Friend;

      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createFriendDto);
      expect(result).toEqual(expectedResult);
      expect(mockRepository.create).toHaveBeenCalledWith(createFriendDto);
    });
  });

  describe('findByUserId', () => {
    it('should return friends for a given user ID', async () => {
      const userId = 'user123';
      const expectedFriends = [
        {
          id: 'friend1',
          senderId: userId,
          receiverId: 'user2',
          status: FriendStatus.ACCEPTED,
        },
        {
          id: 'friend2',
          senderId: 'user3',
          receiverId: userId,
          status: FriendStatus.PENDING,
        },
      ];

      mockRepository.findByUserId.mockResolvedValue(
        expectedFriends as unknown as Friend[],
      );

      const result = await service.findByUserId(userId);
      expect(result).toEqual(expectedFriends);
      expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateStatus', () => {
    it('should update friend status successfully', async () => {
      const friendId = 'friend123';
      const updateDto = { status: FriendStatus.ACCEPTED };
      const expectedResult = {
        id: friendId,
        senderId: 'sender123',
        receiverId: 'receiver123',
        status: FriendStatus.ACCEPTED,
      } as unknown as Friend;

      mockRepository.updateStatus.mockResolvedValue(expectedResult);

      const result = await service.updateStatus(friendId, updateDto);
      expect(result).toEqual(expectedResult);
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(
        friendId,
        updateDto.status,
      );
    });

    it('should throw NotFoundException when friend not found', async () => {
      const friendId = 'nonexistent';
      const updateDto = { status: FriendStatus.ACCEPTED };

      mockRepository.updateStatus.mockResolvedValue(null);

      await expect(service.updateStatus(friendId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete friend relationship successfully', async () => {
      const friendId = 'friend123';
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.delete(friendId);
      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(friendId);
    });

    it('should return false when friend relationship not found', async () => {
      const friendId = 'nonexistent';
      mockRepository.delete.mockResolvedValue(false);

      const result = await service.delete(friendId);
      expect(result).toBe(false);
      expect(mockRepository.delete).toHaveBeenCalledWith(friendId);
    });
  });
});
