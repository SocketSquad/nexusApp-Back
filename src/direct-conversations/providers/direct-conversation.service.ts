import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DirectConversationRepository } from '../repositories/direct-conversation.repository';
import { DirectConversation } from '../schemas/direct-conversations.schema';
import { ICreateDirectConversation, ILastMessage } from '../interfaces/direct-conversation.interface';

@Injectable()
export class DirectConversationService {
  constructor(private readonly directConversationRepository: DirectConversationRepository) {}

  async create(data: ICreateDirectConversation): Promise<DirectConversation> {
    if (data.participants.length !== 2) {
      throw new BadRequestException('Direct conversation must have exactly 2 participants');
    }
    return this.directConversationRepository.create(data);
  }

  async findById(id: string): Promise<DirectConversation> {
    const conversation = await this.directConversationRepository.findById(new Types.ObjectId(id));
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  async findByParticipant(userId: string): Promise<DirectConversation[]> {
    return this.directConversationRepository.findByParticipant(new Types.ObjectId(userId));
  }

  async updateLastMessage(id: string, lastMessage: ILastMessage): Promise<DirectConversation> {
    const conversation = await this.directConversationRepository.updateLastMessage(new Types.ObjectId(id), lastMessage);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  async updateLastRead(conversationId: string, userId: string): Promise<DirectConversation> {
    const conversation = await this.directConversationRepository.updateLastRead(new Types.ObjectId(conversationId), new Types.ObjectId(userId), new Date());
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  async delete(id: string): Promise<DirectConversation> {
    const conversation = await this.directConversationRepository.delete(new Types.ObjectId(id));
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }
}
