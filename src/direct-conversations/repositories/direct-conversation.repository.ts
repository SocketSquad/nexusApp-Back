import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DirectConversation } from '../schemas/direct-conversations.schema';
import { ICreateDirectConversation, IUpdateDirectConversation } from '../interfaces/direct-conversation.interface';

@Injectable()
export class DirectConversationRepository {
  constructor(
    @InjectModel(DirectConversation.name)
    private readonly directConversationModel: Model<DirectConversation>,
  ) {}

  async create(data: ICreateDirectConversation): Promise<DirectConversation> {
    const conversation = new this.directConversationModel(data);
    return conversation.save();
  }

  async findById(id: Types.ObjectId): Promise<DirectConversation> {
    return this.directConversationModel.findById(id).populate('participants.userId', 'username avatar').populate('lastMessage.senderId', 'username avatar').exec();
  }

  async findByParticipant(userId: Types.ObjectId): Promise<DirectConversation[]> {
    return this.directConversationModel
      .find({ 'participants.userId': userId })
      .populate('participants.userId', 'username avatar')
      .populate('lastMessage.senderId', 'username avatar')
      .sort({ 'lastMessage.sentAt': -1 })
      .exec();
  }

  async updateLastMessage(id: Types.ObjectId, lastMessage: IUpdateDirectConversation['lastMessage']): Promise<DirectConversation> {
    return this.directConversationModel
      .findByIdAndUpdate(id, { $set: { lastMessage } }, { new: true })
      .populate('participants.userId', 'username avatar')
      .populate('lastMessage.senderId', 'username avatar')
      .exec();
  }

  async updateLastRead(conversationId: Types.ObjectId, userId: Types.ObjectId, lastRead: Date): Promise<DirectConversation> {
    return this.directConversationModel
      .findOneAndUpdate(
        {
          _id: conversationId,
          'participants.userId': userId,
        },
        {
          $set: { 'participants.$.lastRead': lastRead },
        },
        { new: true },
      )
      .populate('participants.userId', 'username avatar')
      .populate('lastMessage.senderId', 'username avatar')
      .exec();
  }

  async delete(id: Types.ObjectId): Promise<DirectConversation> {
    return this.directConversationModel.findByIdAndDelete(id).exec();
  }
}
