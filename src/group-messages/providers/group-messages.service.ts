import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
  } from '@nestjs/common';
  import { GroupMessagesRepository } from '../repositories/group-messages.repository';
  import { CreateGroupMessageDto } from '../dtos/create-group-message.dto';
  import { UpdateGroupMessageDto } from '../dtos/update-group-message.dto';
  import { GroupMessage } from '../schemas/group-message.schema';
  import { MessageType } from '../../utils/types';
import { IGroupMessagesService } from '../interfaces/group-messages.service.interface';
  
  @Injectable()
  export class GroupMessagesService implements IGroupMessagesService {
    constructor(private readonly groupMessagesRepository: GroupMessagesRepository) {}
  
    async create(createMessageDto: CreateGroupMessageDto): Promise<GroupMessage> {
      // Validate message type and content
      this.validateMessageContent(createMessageDto.type, createMessageDto.content);
  
      // Extract mentions
      if (createMessageDto.content.includes('@')) {
        createMessageDto.mentions = this.extractMentions(createMessageDto.content);
      }
  
      return this.groupMessagesRepository.create(createMessageDto);
    }
  
    async findByConversation(
      conversationId: string,
      page: number = 1,
      limit: number = 50,
    ): Promise<{ messages: GroupMessage[]; total: number }> {
      return this.groupMessagesRepository.findByConversation(
        conversationId,
        page,
        limit,
      );
    }
  
    async findById(id: string): Promise<GroupMessage> {
      const message = await this.groupMessagesRepository.findById(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      return message;
    }
  
    async update(
      id: string,
      updateMessageDto: UpdateGroupMessageDto,
      userId: string,
    ): Promise<GroupMessage> {
      const message = await this.findById(id);
  
      if (message.senderId.toString() !== userId) {
        throw new ForbiddenException('You can only edit your own messages');
      }
      
        // Check if the message is within the editable time frame (15 minutes)
      const currentTime = new Date();
      const messageCreationTime = new Date(message.createdAt);
      const timeDifference = (currentTime.getTime() - messageCreationTime.getTime()) / (1000 * 60); // Convert ms to minutes

      if (timeDifference > 15) {
        throw new ForbiddenException('You can only edit messages within 15 minutes of creation');
      }
  
      // Update mentions if content is being updated
      if (updateMessageDto.content) {
        if (updateMessageDto.content.includes('@')) {
          updateMessageDto.mentions = this.extractMentions(updateMessageDto.content);
        } else {
          updateMessageDto.mentions = [];
        }
      }
  
      const updatedMessage = await this.groupMessagesRepository.update(
        id,
        updateMessageDto,
      );
      if (!updatedMessage) {
        throw new NotFoundException('Message not found');
      }
  
      return updatedMessage;
    }
  
    async delete(id: string, userId: string): Promise<void> {
      const message = await this.findById(id);
  
      if (message.senderId.toString() !== userId) {
        throw new ForbiddenException('You can only delete your own messages');
      }
  
      const deleted = await this.groupMessagesRepository.delete(id);
      if (!deleted) {
        throw new NotFoundException('Message not found');
      }
    }
  
  
    private validateMessageContent(type: MessageType, content: string): void {
      if (type === MessageType.TEXT && !content.trim()) {
        throw new BadRequestException('Text message cannot be empty');
      }
    }
  
    private extractMentions(content: string): string[] {
      const mentionRegex = /@(\w+)/g;
      const matches = content.match(mentionRegex) || [];
      return matches.map(mention => mention.substring(1)); 
    }
  }