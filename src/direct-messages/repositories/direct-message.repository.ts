import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DirectMessage } from '../schemas/direct-message.schema';
import { ICreateDirectMessage, IUpdateDirectMessage } from '../interfaces/direct-message.interface';

@Injectable()
export class DirectMessageRepository {
  constructor(
    @InjectModel(DirectMessage.name)
    private readonly directMessageModel: Model<DirectMessage>,
  ) {}

  async create(data: ICreateDirectMessage): Promise<DirectMessage> {
    const message = new this.directMessageModel(data);
    return message.save();
  }

  async findById(id: Types.ObjectId): Promise<DirectMessage> {
    return this.directMessageModel
      .findById(id)
      .populate('senderId', 'username avatar')
      .populate('attachments')
      .exec();
  }

  async findByConversation(
    conversationId: Types.ObjectId,
    limit: number = 50,
    before?: Date,
  ): Promise<DirectMessage[]> {
    const query: any = { conversationId };
    if (before) {
      query.createdAt = { $lt: before };
    }

    return this.directMessageModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('senderId', 'username avatar')
      .populate('attachments')
      .exec();
  }

  async update(
    id: Types.ObjectId,
    updateData: IUpdateDirectMessage,
  ): Promise<DirectMessage> {
    return this.directMessageModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('senderId', 'username avatar')
      .populate('attachments')
      .exec();
  }

  async delete(id: Types.ObjectId): Promise<DirectMessage> {
    return this.directMessageModel.findByIdAndDelete(id).exec();
  }

  async countMessages(conversationId: Types.ObjectId): Promise<number> {
    return this.directMessageModel.countDocuments({ conversationId }).exec();
  }

  async findLatestMessage(conversationId: Types.ObjectId): Promise<DirectMessage> {
    return this.directMessageModel
      .findOne({ conversationId })
      .sort({ createdAt: -1 })
      .populate('senderId', 'username avatar')
      .populate('attachments')
      .exec();
  }
}