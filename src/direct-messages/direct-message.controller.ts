import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Types } from 'mongoose';
import { DirectMessageService } from './providers/direct-message.service';
import { DirectMessage } from './schemas/direct-message.schema';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDirectMessageDto } from './dtos/create-direct-message.dto';
import { UpdateDirectMessageDto } from './dtos/update-direct-message.dto';
import { MessageQueryDto } from './dtos/message-query.dto';

@ApiTags('Direct Messages')
@Controller('direct-messages')
export class DirectMessageController {
  constructor(private readonly directMessageService: DirectMessageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new direct message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Message created successfully',
  })
  async createMessage(@Body(ValidationPipe) createMessageDto: CreateDirectMessageDto): Promise<DirectMessage> {
    const messageData = {
      ...createMessageDto,
      conversationId: new Types.ObjectId(createMessageDto.conversationId),
      senderId: new Types.ObjectId(createMessageDto.senderId),
      attachments: createMessageDto.attachments?.map((id) => new Types.ObjectId(id)),
    };
    return this.directMessageService.create(messageData);
  }

  @Get('conversation/:conversationId')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  async getConversationMessages(@Param('conversationId') conversationId: string, @Query(ValidationPipe) query: MessageQueryDto): Promise<DirectMessage[]> {
    const { limit = 50, before } = query;
    return this.directMessageService.findByConversation(new Types.ObjectId(conversationId), limit, before ? new Date(before) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific message' })
  async getMessage(@Param('id') id: string): Promise<DirectMessage> {
    return this.directMessageService.findById(new Types.ObjectId(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a message' })
  async updateMessage(@Param('id') id: string, @Body(ValidationPipe) updateMessageDto: UpdateDirectMessageDto): Promise<DirectMessage> {
    const updateData = {
      ...updateMessageDto,
      attachments: updateMessageDto.attachments?.map((id) => new Types.ObjectId(id)),
    };
    return this.directMessageService.update(new Types.ObjectId(id), updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message' })
  async deleteMessage(@Param('id') id: string): Promise<DirectMessage> {
    return this.directMessageService.delete(new Types.ObjectId(id));
  }

  @Get('conversation/:conversationId/count')
  @ApiOperation({ summary: 'Get message count for a conversation' })
  async getMessageCount(@Param('conversationId') conversationId: string): Promise<number> {
    return this.directMessageService.getMessageCount(new Types.ObjectId(conversationId));
  }

  @Get('conversation/:conversationId/latest')
  @ApiOperation({ summary: 'Get latest message from a conversation' })
  async getLatestMessage(@Param('conversationId') conversationId: string): Promise<DirectMessage> {
    return this.directMessageService.getLatestMessage(new Types.ObjectId(conversationId));
  }
}
