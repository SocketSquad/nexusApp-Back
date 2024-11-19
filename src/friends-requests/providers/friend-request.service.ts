import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FriendRequestRepository } from '../repositories/friend-request.repository';
import { CreateFriendRequestDto } from '../dtos/create-friend-request.dto';
import { FriendRequest } from '../schemas/friend-request.schema';
import { FriendStatus } from '../../utils/types';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
  ) {}

  async create(createFriendRequestDto: CreateFriendRequestDto): Promise<FriendRequest> {
    const { senderId, receiverId } = createFriendRequestDto;

    // Check if request already exists
    const existingRequest = await this.friendRequestRepository.findBySenderAndReceiver(
      senderId,    // Original sender
      receiverId,  // Original receiver
    );

    if (existingRequest) {
      throw new BadRequestException('Friend request already exists');
    }

    // Check for reverse request
    const reverseRequest = await this.friendRequestRepository.findBySenderAndReceiver(
      receiverId,  // This person would be the sender in the reverse request
      senderId,    // This person would be the receiver in the reverse request
    );

    if (reverseRequest) {
      throw new BadRequestException('Reverse friend request already exists');
    }

    return this.friendRequestRepository.create(createFriendRequestDto);
  }

  async findAllByUser(userId: string): Promise<FriendRequest[]> {
    return this.friendRequestRepository.findAllByUser(userId);
  }

  async acceptRequest(requestId: string): Promise<FriendRequest> {
    const request = await this.friendRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    return this.friendRequestRepository.updateStatus(requestId, FriendStatus.ACCEPTED);
  }

  async rejectRequest(requestId: string): Promise<FriendRequest> {
    const request = await this.friendRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    return this.friendRequestRepository.updateStatus(requestId, FriendStatus.REJECTED);
  }

  async cancelRequest(requestId: string): Promise<FriendRequest> {
    const request = await this.friendRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    return this.friendRequestRepository.delete(requestId);
  }
}