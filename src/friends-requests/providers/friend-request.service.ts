// friend-request.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFriendRequest } from '../interfaces/friend-request.interface';
import { CreateFriendRequestDto } from '../dtos/create-friend-request.dto';
import { UpdateFriendRequestDto } from '../dtos/update-friend-request.dto';
import { FriendRequestNotFoundException } from '../exeptions/friend-request-not-found.exception';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel('FriendRequest') private readonly friendRequestModel: Model<IFriendRequest>,
  ) {}

  async create(createFriendRequestDto: CreateFriendRequestDto): Promise<IFriendRequest> {
    const newRequest = new this.friendRequestModel(createFriendRequestDto);
    return newRequest.save();
  }

  async getById(id: string): Promise<IFriendRequest> {
    const friendRequest = await this.friendRequestModel.findById(id);
    if (!friendRequest) throw new FriendRequestNotFoundException();
    return friendRequest;
  }

  async updateStatus(
    id: string,
    updateFriendRequestDto: UpdateFriendRequestDto,
  ): Promise<IFriendRequest> {
    const updatedRequest = await this.friendRequestModel.findByIdAndUpdate(id, updateFriendRequestDto, {
      new: true,
    });
    if (!updatedRequest) throw new FriendRequestNotFoundException();
    return updatedRequest;
  }
}
