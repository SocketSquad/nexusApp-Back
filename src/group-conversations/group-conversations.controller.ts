import { 
    Controller, 
    Post, 
    Get, 
    Put, 
    Delete, 
    Body, 
    Param, 
    Query, 
    HttpCode, 
    HttpStatus 
  } from '@nestjs/common';
import { GroupConversationsService } from './providers/group-conversations.service';
import { CreateGroupConversationDto } from './dtos/create-group-conversations.dto';
import { UpdateGroupConversationDto } from './dtos/update-group-conversations.dto';
import { Types } from 'mongoose';

  
  @Controller('group-conversations')
  export class GroupConversationsController {
    constructor(
      private readonly groupConversationsService: GroupConversationsService
    ) {}
  
    @Post()
    async createConversation(
      @Body() createConversationDto: CreateGroupConversationDto,
      @Query('creatorId') creatorId: string 
    ) {
      return this.groupConversationsService.create(
        createConversationDto, 
        creatorId
      );
    }
  
    @Get(':id')
    async getConversationById(
      @Param('id') id: string,
      @Query('userId') userId: string
    ) {
      return this.groupConversationsService.findById(id, userId);
    }
  
    @Get()
    async getUserConversations(
      @Query('userId') userId: string
    ) {
      return this.groupConversationsService.findByUser(userId);
    }
  
    @Put(':id')
    async updateConversation(
      @Param('id') id: string,
      @Body() updateConversationDto: UpdateGroupConversationDto,
      @Query('userId') userId: string
    ) {
      return this.groupConversationsService.update(
        id, 
        updateConversationDto, 
        userId
      );
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteConversation(
      @Param('id') id: string,
      @Query('userId') userId: string
    ) {
      return this.groupConversationsService.delete(id, userId);
    }
  
    @Post(':id/participants')
    async addParticipant(
      @Param('id') conversationId: string,
      @Query('participantId') participantId: string,
      @Query('addedById') addedById: string
    ) {
      return this.groupConversationsService.addParticipant(
        conversationId, 
        participantId, 
        addedById
      );
    }
  
    @Delete(':id/participants')
    async removeParticipant(
      @Param('id') conversationId: string,
      @Query('participantId') participantId: string,
      @Query('removedById') removedById: string
    ) {
      return this.groupConversationsService.removeParticipant(
        conversationId, 
        participantId, 
        removedById
      );
    }
  }