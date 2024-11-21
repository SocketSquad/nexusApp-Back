import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { GroupMessagesRepository } from '../repositories/group-messages.repository';
import { GroupService } from '@/groups/providers/groups.service';
import { GroupMessage } from '../schemas/group-message.schema';
import { CreateGroupMessageDto } from '../dtos/create-group-message.dto';
import { UpdateGroupMessageDto } from '../dtos/update-group-message.dto';
import { IGroupMessagesService } from '../interfaces/group-messages.service.interface';

@Injectable()
export class GroupMessagesService implements IGroupMessagesService {
  constructor(
    private readonly messagesRepository: GroupMessagesRepository,
    private readonly groupService: GroupService,
  ) {}

  async create(groupId: string, senderId: Types.ObjectId, createMessageDto: CreateGroupMessageDto): Promise<GroupMessage> {
    // Check if user has access to the group
    await this.groupService.checkMessageAccess(groupId, senderId);

    const groupObjectId = new Types.ObjectId(groupId);
    const message = await this.messagesRepository.create(groupObjectId, senderId, createMessageDto);

    // Update group's last message
    await this.groupService.updateLastMessage(groupId, message._id as Types.ObjectId, message.content, senderId, message.type);

    return message;
  }

  async findById(id: string): Promise<GroupMessage> {
    const message = await this.messagesRepository.findById(new Types.ObjectId(id));

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async findByGroupId(groupId: string, userId: Types.ObjectId, limit?: number, before?: string): Promise<GroupMessage[]> {
    // Check if user has access to the group
    await this.groupService.checkMessageAccess(groupId, userId);

    const beforeDate = before ? new Date(before) : undefined;

    return this.messagesRepository.findByGroupId(new Types.ObjectId(groupId), limit, beforeDate);
  }

  async update(id: string, userId: Types.ObjectId, updateMessageDto: UpdateGroupMessageDto): Promise<GroupMessage> {
    const message = await this.findById(id);

    // Check if user is the message sender
    if (message.senderId._id.toString() !== userId.toString()) {
      throw new ForbiddenException('Only the message sender can update the message');
    }

    // Only update in 15 minutes after creating message
    const messageAge = Date.now() - message.createdAt.getTime();
    const fifteenMinutes = 15 * 60 * 1000;
    if (messageAge > fifteenMinutes) {
      throw new ForbiddenException('Messages can only be edited within 15 minutes of sending');
    }

    return this.messagesRepository.update(new Types.ObjectId(id), updateMessageDto);
  }

  async delete(id: string, userId: Types.ObjectId): Promise<GroupMessage> {
    const message = await this.findById(id);

    if (!message) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }

    // Check if user is the message sender
    if (message.senderId._id.toString() !== userId.toString()) {
      throw new ForbiddenException('Only the message sender can delete the message');
    }
    return this.messagesRepository.softDelete(new Types.ObjectId(id));
  }

  async setHasAttachments(id: string, hasAttachments: boolean): Promise<GroupMessage> {
    const messageId = new Types.ObjectId(id);
    return this.messagesRepository.setHasAttachments(messageId, hasAttachments);
  }
}
