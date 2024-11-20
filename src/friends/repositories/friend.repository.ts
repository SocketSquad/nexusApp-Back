import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Friend } from '../schemas/friend.schema';
import { CreateFriendDto } from '../dtos/create-friend.dto';
import { IFriendRepository } from '../interfaces/friend.repository.interface';

@Injectable()
export class FriendRepository implements IFriendRepository {
  constructor(@InjectModel(Friend.name) private readonly friendModel: Model<Friend>) {}

  async create(createFriendDto: CreateFriendDto): Promise<Friend> {
    const friend = new this.friendModel(createFriendDto);
    return friend.save();
  }

  async findByUserId(userId: string): Promise<Friend[]> {
    return this.friendModel.find({ $or: [{ senderId: userId }, { receiverId: userId }] }).exec();
  }

  async updateStatus(friendId: string, status: string): Promise<Friend | null> {
    return this.friendModel.findByIdAndUpdate(friendId, { status }, { new: true }).exec();
  }

  async delete(friendId: string): Promise<boolean> {
    const result = await this.friendModel.findByIdAndDelete(friendId).exec();
    return !!result;
  }
}
