import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GroupMessagesService } from './providers/group-messages.service';
import { CreateGroupMessageDto } from './dtos/create-group-message.dto';
import { UpdateGroupMessageDto } from './dtos/update-group-message.dto';

@ApiTags('group-messages')
@Controller('groups/:groupId/messages')
@UseGuards(JwtAuthGuard)
export class GroupMessagesController {
  constructor(private readonly messagesService: GroupMessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message in group' })

  async create(
    @Param('groupId') groupId: string,
    @Body() createMessageDto: CreateGroupMessageDto,
    @Req() req: any
  ) {


    const userId = new Types.ObjectId(req.user.userId);
    return this.messagesService.create(groupId, userId, createMessageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get messages from group' })
  async findAll(@Param('groupId') groupId: string, @Req() req: any, @Query('limit') limit?: number, @Query('before') before?: string) {
    const userId = new Types.ObjectId(req.user.userId);
    return this.messagesService.findByGroupId(groupId, userId, limit, before);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by id' })
  async findOne(@Param('id') id: string) {
    return this.messagesService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update message' })
  async update(@Param('id') id: string, @Body() updateMessageDto: UpdateGroupMessageDto, @Req() req: any) {
    const userId = new Types.ObjectId(req.user.userId);
    return this.messagesService.update(id, userId, updateMessageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete message' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = new Types.ObjectId(req.user.userId);
    return this.messagesService.delete(id, userId);
  }
}
