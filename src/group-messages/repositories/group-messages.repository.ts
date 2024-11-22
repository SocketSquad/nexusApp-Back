import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GroupMessage } from '../schemas/group-message.schema';
import { CreateGroupMessageDto } from '../dtos/create-group-message.dto';
import { UpdateGroupMessageDto } from '../dtos/update-group-message.dto';
import { IGroupMessagesRepository } from '../interfaces/group-messages.repository.interface';
import { Group } from '@/groups/schemas/group.schema';

@Injectable()
export class GroupMessagesRepository implements IGroupMessagesRepository {
  constructor(
    @InjectModel(GroupMessage.name)
    private readonly messageModel: Model<GroupMessage>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>
  ) {}

  async create(groupId: Types.ObjectId, senderId: Types.ObjectId, createMessageDto: CreateGroupMessageDto): Promise<GroupMessage> {
    const message = new this.messageModel({
      groupId,
      senderId,
      ...createMessageDto,
    });
      // Update the group to include the new message
    await this.groupModel.findByIdAndUpdate(
    groupId,
    { $push: { messages: message._id } }, 
    { new: true } 
    );
    return message.save();
  }

  async findById(id: Types.ObjectId): Promise<GroupMessage> {
    return this.messageModel.findById(id).populate('senderId', 'username email').exec();
  }

  async findByGroupId(groupId: Types.ObjectId, limit: number = 50, before?: Date): Promise<GroupMessage[]> {
    const query = {
      groupId,
      deletedAt: { $exists: false },
    };

    if (before) {
      query['createdAt'] = { $lt: before };
    }

    return this.messageModel.find(query).sort({ createdAt: -1 }).limit(limit).populate('senderId', 'username email').exec();
  }

  async update(id: Types.ObjectId, updateMessageDto: UpdateGroupMessageDto): Promise<GroupMessage> {
    return this.messageModel
      .findByIdAndUpdate(
        id,
        {
          ...updateMessageDto,
          isEdited: true,
        },
        { new: true },
      )
      .exec();
  }

  async softDelete(id: Types.ObjectId): Promise<GroupMessage> {
    return this.messageModel.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true }).exec();
  }

  async setHasAttachments(id: Types.ObjectId, hasAttachments: boolean): Promise<GroupMessage> {
    return this.messageModel.findByIdAndUpdate(id, { hasAttachments }, { new: true }).exec();
  }
}
