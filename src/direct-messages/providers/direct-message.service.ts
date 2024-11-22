import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DirectMessageRepository } from '../repositories/direct-message.repository';
import { DirectMessage } from '../schemas/direct-message.schema';
import { ICreateDirectMessage, IUpdateDirectMessage } from '../interfaces/direct-message.interface';

@Injectable()
export class DirectMessageService {
  constructor(private readonly directMessageRepository: DirectMessageRepository) {}

  async create(messageData: ICreateDirectMessage): Promise<DirectMessage> {
    return this.directMessageRepository.create(messageData);
  }

  async findById(id: Types.ObjectId): Promise<DirectMessage> {
    const message = await this.directMessageRepository.findById(id);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async findByConversation(conversationId: Types.ObjectId, limit?: number, before?: Date): Promise<DirectMessage[]> {
    return this.directMessageRepository.findByConversation(conversationId, limit, before);
  }

  async update(id: Types.ObjectId, updateData: IUpdateDirectMessage): Promise<DirectMessage> {
    const message = await this.directMessageRepository.update(id, updateData);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async delete(id: Types.ObjectId): Promise<DirectMessage> {
    const message = await this.directMessageRepository.delete(id);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async getMessageCount(conversationId: Types.ObjectId): Promise<number> {
    return this.directMessageRepository.countMessages(conversationId);
  }

  async getLatestMessage(conversationId: Types.ObjectId): Promise<DirectMessage> {
    const message = await this.directMessageRepository.findLatestMessage(conversationId);
    if (!message) {
      throw new NotFoundException('No messages found in conversation');
    }
    return message;
  }
}
