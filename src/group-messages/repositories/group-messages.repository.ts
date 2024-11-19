import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GroupMessage } from '../schemas/group-message.schema';
import { CreateGroupMessageDto } from '../dtos/create-group-message.dto';
import { UpdateGroupMessageDto } from '../dtos/update-group-message.dto';
import { IGroupMessagesRepository } from '../interfaces/group-messages.repository.interface';

@Injectable()
export class GroupMessagesRepository implements IGroupMessagesRepository {
  constructor(
    @InjectModel(GroupMessage.name)
    private readonly groupMessageModel: Model<GroupMessage>,
  ) {}

  async create(createMessageDto: CreateGroupMessageDto): Promise<GroupMessage> {
    const message = new this.groupMessageModel({
      ...createMessageDto,
      conversationId: new Types.ObjectId(createMessageDto.conversationId),
      senderId: new Types.ObjectId(createMessageDto.senderId),
      attachments: createMessageDto.attachments?.map((id) => new Types.ObjectId(id)),
    });
    return message.save();
  }

  async findByConversation(conversationId: string, page: number, limit: number): Promise<{ messages: GroupMessage[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = { conversationId: new Types.ObjectId(conversationId) };

    const [messages, total] = await Promise.all([
      this.groupMessageModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('senderId', 'username avatar').populate('attachments').exec(),
      this.groupMessageModel.countDocuments(query),
    ]);

    return { messages, total };
  }

  async findById(id: string): Promise<GroupMessage | null> {
    return this.groupMessageModel.findById(id).populate('senderId', 'username avatar').populate('attachments').exec();
  }

  async update(id: string, updateMessageDto: UpdateGroupMessageDto): Promise<GroupMessage | null> {
    const updateData = {
      ...updateMessageDto,
      attachments: updateMessageDto.attachments?.map((id) => new Types.ObjectId(id)),
    };

    return this.groupMessageModel.findByIdAndUpdate(id, updateData, { new: true }).populate('senderId', 'username avatar').populate('attachments').exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.groupMessageModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
