import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { GroupConversationsRepository } from '../repositories/group-conversations.repository';
import { IGroupConversationsService } from '../interfaces/group-conversations.service.interface';
import { CreateGroupConversationDto } from '../dtos/create-group-conversations.dto';
import { GroupConversation } from '../schemas/group-conversations.schema';
import { UpdateGroupConversationDto } from '../dtos/update-group-conversations.dto';

@Injectable()
export class GroupConversationsService implements IGroupConversationsService {
  constructor(private readonly groupConversationsRepository: GroupConversationsRepository) {}

  async create(createConversationDto: CreateGroupConversationDto, creatorId: string): Promise<GroupConversation> {
    // Check if the creator is participant and has admin role
    const creatorParticipant = createConversationDto.participants.find((p) => p.userId === creatorId);

    if (!creatorParticipant) {
      createConversationDto.participants.push({
        userId: creatorId,
        role: 'admin',
      });
    } else if (creatorParticipant.role !== 'admin') {
      creatorParticipant.role = 'admin';
    }

    // Validate unique participants
    const uniqueParticipants = new Set(createConversationDto.participants.map((p) => p.userId));
    if (uniqueParticipants.size !== createConversationDto.participants.length) {
      throw new BadRequestException('Participants must be unique');
    }

    return this.groupConversationsRepository.create(createConversationDto);
  }

  async findById(id: string, userId: string): Promise<GroupConversation> {
    const conversation = await this.groupConversationsRepository.findById(id);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some((p) => p.userId.toString() === userId);

    if (!isParticipant) {
      throw new ForbiddenException('You are not a member of this conversation');
    }

    return conversation;
  }

  async findByUser(userId: string): Promise<GroupConversation[]> {
    return this.groupConversationsRepository.findByUser(userId);
  }

  async update(id: string, updateConversationDto: UpdateGroupConversationDto, userId: string): Promise<GroupConversation> {
    // Check if conversation exists and user is a participant
    const conversation = await this.findById(id, userId);

    // Check if user has admin permissions
    const userRole = conversation.participants.find((p) => p.userId.toString() === userId)?.role;

    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can update conversation details');
    }

    return this.groupConversationsRepository.update(id, updateConversationDto);
  }

  async delete(id: string, userId: string): Promise<void> {
    // Check if conversation exists and user is a participant
    const conversation = await this.findById(id, userId);

    // Check if user has admin permissions
    const userRole = conversation.participants.find((p) => p.userId.toString() === userId)?.role;

    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can delete the conversation');
    }

    const deleted = await this.groupConversationsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Conversation not found');
    }
  }

  async addParticipant(conversationId: string, participantId: string, addedById: string): Promise<GroupConversation> {
    // Check if conversation exists and user is a participant
    const conversation = await this.findById(conversationId, addedById);

    // Check if user has admin permissions
    const userRole = conversation.participants.find((p) => p.userId.toString() === addedById)?.role;

    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can add participants');
    }

    // Check if participant is already in the conversation
    const isExistingParticipant = conversation.participants.some((p) => p.userId.toString() === participantId);

    if (isExistingParticipant) {
      throw new BadRequestException('User is already a participant');
    }

    return this.groupConversationsRepository.addParticipant(conversationId, participantId);
  }

  async removeParticipant(conversationId: string, participantId: string, removedById: string): Promise<GroupConversation> {
    // Check if conversation exists and user is a participant
    const conversation = await this.findById(conversationId, removedById);

    // Check if user has admin permissions
    const userRole = conversation.participants.find((p) => p.userId.toString() === removedById)?.role;

    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can remove participants');
    }

    // Prevent removing the  admin
    const adminCount = conversation.participants.filter((p) => p.role === 'admin').length;

    const participantToRemove = conversation.participants.find((p) => p.userId.toString() === participantId);

    if (!participantToRemove) {
      throw new NotFoundException('Participant not found in conversation');
    }

    if (participantToRemove.role === 'admin' && adminCount <= 1) {
      throw new ForbiddenException('Cannot remove the admin');
    }

    return this.groupConversationsRepository.removeParticipant(conversationId, participantId);
  }
}
