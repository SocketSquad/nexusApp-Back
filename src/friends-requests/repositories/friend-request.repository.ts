import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { FriendRequest } from '../schemas/friend-request.schema';
import { CreateFriendRequestDto } from '../dtos/create-friend-request.dto';
import { FriendStatus } from '../../utils/types';

@Injectable()
export class FriendRequestRepository {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequest>,
  ) {}

  async create(createFriendRequestDto: CreateFriendRequestDto): Promise<FriendRequest> {
    const createdRequest = new this.friendRequestModel(createFriendRequestDto);
    return createdRequest.save();
  }

  async findById(id: string): Promise<FriendRequest> {
    return this.friendRequestModel.findById(id).exec();
  }

  async findOne(filter: FilterQuery<FriendRequest>): Promise<FriendRequest> {
    return this.friendRequestModel.findOne(filter).exec();
  }

  async findBySenderAndReceiver(senderId: string, receiverId: string): Promise<FriendRequest | null> {
    return this.friendRequestModel.findOne({ senderId, receiverId }).exec();
  }

  async findAllByUser(userId: string): Promise<FriendRequest[]> {
    return this.friendRequestModel
      .find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
      .exec();
  }

  async updateStatus(requestId: string, status: FriendStatus): Promise<FriendRequest> {
    return this.friendRequestModel
      .findByIdAndUpdate(
        requestId,
        {
          status,
          respondedAt: status !== FriendStatus.PENDING ? new Date() : undefined,
        },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<FriendRequest> {
    return this.friendRequestModel.findByIdAndDelete(id).exec();
  }
}
