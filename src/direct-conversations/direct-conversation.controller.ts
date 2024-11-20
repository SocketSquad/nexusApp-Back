import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpStatus,
    ValidationPipe,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { Types } from 'mongoose';
  import { DirectConversationService } from './providers/direct-conversation.service';
  import { DirectConversation } from './schemas/direct-conversations.schema';
  import { CreateDirectConversationDto, ParticipantDto } from './dtos/create-direct-conversation.dto';
  import { UpdateLastMessageDto } from './dtos/update-last-message.dto';
  import { ConversationResponseDto } from './dtos/conversation-response.dto';
  import { ICreateDirectConversation, IParticipant } from './interfaces/direct-conversation.interface';
  import { ILastMessage } from './interfaces/direct-conversation.interface';
  @ApiTags('Direct Conversations')
  @Controller('direct-conversations')
  export class DirectConversationController {
    constructor(
      private readonly directConversationService: DirectConversationService,
    ) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new direct conversation' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Conversation created successfully',
      type: ConversationResponseDto,
    })
    async create(
      @Body(ValidationPipe) createDto: CreateDirectConversationDto,
    ): Promise<DirectConversation> {
      // Transform string IDs to ObjectIds
      const transformedData: ICreateDirectConversation = {
        participants: createDto.participants.map((participant: ParticipantDto) => ({
          userId: new Types.ObjectId(participant.userId),
        })),
      };
      return this.directConversationService.create(transformedData);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a conversation by ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Conversation found successfully',
      type: ConversationResponseDto,
    })
    async findById(@Param('id') id: string): Promise<DirectConversation> {
      return this.directConversationService.findById(id);
    }
  
    @Get('user/:userId')
    @ApiOperation({ summary: 'Get all conversations for a user' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Conversations retrieved successfully',
      type: [ConversationResponseDto],
    })
    async findByParticipant(
      @Param('userId') userId: string,
    ): Promise<DirectConversation[]> {
      return this.directConversationService.findByParticipant(userId);
    }
  
    @Put(':id/last-message')
    @ApiOperation({ summary: 'Update last message in conversation' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Last message updated successfully',
      type: ConversationResponseDto,
    })
    async updateLastMessage(
      @Param('id') id: string,
      @Body(ValidationPipe) updateDto: UpdateLastMessageDto,
    ): Promise<DirectConversation> {
      const transformedData: ILastMessage = {
        _id: new Types.ObjectId(updateDto._id),
        content: updateDto.content,
        senderId: new Types.ObjectId(updateDto.senderId),
        sentAt: updateDto.sentAt || new Date(), // Utiliser la date fournie ou créer une nouvelle
      };
      return this.directConversationService.updateLastMessage(id, transformedData);
    }
  
    @Put(':id/read/:userId')
    @ApiOperation({ summary: 'Mark conversation as read for user' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Conversation marked as read successfully',
      type: ConversationResponseDto,
    })
    async updateLastRead(
      @Param('id') id: string,
      @Param('userId') userId: string,
    ): Promise<DirectConversation> {
      return this.directConversationService.updateLastRead(id, userId);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a conversation' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Conversation deleted successfully',
      type: ConversationResponseDto,
    })
    async delete(@Param('id') id: string): Promise<DirectConversation> {
      return this.directConversationService.delete(id);
    }
  }