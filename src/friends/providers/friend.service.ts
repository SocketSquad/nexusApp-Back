import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Friend } from '../schemas/friend.schema';
import { CreateFriendDto } from '../dtos/create-friend.dto';
import { UpdateFriendDto } from '../dtos/update-friend.dto';

@Injectable()
export class FriendService {
  constructor(@InjectModel(Friend.name) private friendModel: Model<Friend>) {}

  /**
   * Crée une nouvelle relation d'amitié
   */
  async create(createFriendDto: CreateFriendDto): Promise<Friend> {
    const newFriend = new this.friendModel(createFriendDto);
    return newFriend.save();
  }

  /**
   * Récupère les amis par userId
   */
  async findByUserId(userId: string): Promise<Friend[]> {
    return this.friendModel
      .find({ $or: [{ senderId: userId }, { receiverId: userId }] })
      .exec();
  }

  /**
   * Met à jour le statut d'une relation
   */
  async updateStatus(friendId: string, updateFriendDto: UpdateFriendDto): Promise<Friend> {
    const updatedFriend = await this.friendModel
      .findByIdAndUpdate(friendId, { status: updateFriendDto.status }, { new: true })
      .exec();

    if (!updatedFriend) {
      throw new NotFoundException('Relation non trouvée');
    }
    return updatedFriend;
  }

  /**
   * Supprime une relation d'amitié par ID
   */
  async delete(friendId: string): Promise<boolean> {
    const result = await this.friendModel.findByIdAndDelete(friendId).exec();
    return !!result;
  }
}
