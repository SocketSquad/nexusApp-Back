import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IGroupConversationsRepository } from '../interfaces/group-conversations.repository.interface';
import { GroupConversation } from '../schemas/group-conversations.schema';
import { CreateGroupConversationDto } from '../dtos/create-group-conversations.dto';
import { UpdateGroupConversationDto } from '../dtos/update-group-conversations.dto';


@Injectable()
export class GroupConversationsRepository implements IGroupConversationsRepository {
  constructor(
    @InjectModel(GroupConversation.name)
    private readonly groupConversationModel: Model<GroupConversation>,
  ) {}

  async create(createConversationDto: CreateGroupConversationDto): Promise<GroupConversation> {
    // Convert participant user IDs to ObjectId
    const participants = createConversationDto.participants.map(participant => ({
      userId: new Types.ObjectId(participant.userId),
      role: participant.role || 'member',
      lastRead: participant.lastRead || null,
    }));

    const conversation = new this.groupConversationModel({
      ...createConversationDto,
      participants,
      lastMessageAt: new Date(),
    });

    return conversation.save();
  }

  async findById(id: string): Promise<GroupConversation | null> {
    return this.groupConversationModel
      .findById(id)
      .populate('participants.userId', 'username avatar')
      .exec();
  }

  async findByUser(userId: string): Promise<GroupConversation[]> {
    return this.groupConversationModel
      .find({
        'participants.userId': new Types.ObjectId(userId),
      })
      .populate('participants.userId', 'username avatar')
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  async update(
    id: string, 
    updateConversationDto: UpdateGroupConversationDto
  ): Promise<GroupConversation | null> {
    // If updating participants, convert user IDs to ObjectId
    if (updateConversationDto.participants) {
      updateConversationDto.participants = updateConversationDto.participants.map(participant => ({
        ...participant,
        userId: new Types.ObjectId(participant.userId),
      }));
    }

    return this.groupConversationModel
      .findByIdAndUpdate(id, updateConversationDto, { new: true })
      .populate('participants.userId', 'username avatar')
      .exec();
  }

 

  async delete(id: string): Promise<boolean> {
    const result = await this.groupConversationModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async addParticipant(
    conversationId: string, 
    userId: string, 
    role: string = 'member'
  ): Promise<GroupConversation | null> {
    return this.groupConversationModel
      .findByIdAndUpdate(
        conversationId,
        {
          $addToSet: { 
            participants: { 
              userId: new Types.ObjectId(userId), 
              role,
              lastRead: null 
            } 
          }
        },
        { new: true }
      )
      .populate('participants.userId', 'username avatar')
      .exec();
  }

  async removeParticipant(
    conversationId: string, 
    userId: string
  ): Promise<GroupConversation | null> {
    return this.groupConversationModel
      .findByIdAndUpdate(
        conversationId,
        {
          $pull: { 
            participants: { 
              userId: new Types.ObjectId(userId) 
            } 
          }
        },
        { new: true }
      )
      .populate('participants.userId', 'username avatar')
      .exec();
  }
}