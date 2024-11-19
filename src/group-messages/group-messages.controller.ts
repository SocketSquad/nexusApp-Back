    import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
    import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
    import { GroupMessagesService } from './providers/group-messages.service';
    import { CreateGroupMessageDto } from './dtos/create-group-message.dto';
    import { UpdateGroupMessageDto } from './dtos/update-group-message.dto';

    @ApiTags('group-messages')
    @Controller('group-messages')
    export class GroupMessagesController {
    constructor(private readonly groupMessagesService: GroupMessagesService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new group message' })
    @ApiResponse({ status: 201, description: 'Message created successfully.' })
    async create(@Body() createMessageDto: CreateGroupMessageDto) {
        return this.groupMessagesService.create(createMessageDto);
    }

    @Get('conversation/:conversationId')
    @ApiOperation({ summary: 'Get messages by conversation ID' })
    async findByConversation(
        @Param('conversationId') conversationId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 50,
    ) {
        return this.groupMessagesService.findByConversation(conversationId, page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get message by ID' })
    async findOne(@Param('id') id: string) {
        return this.groupMessagesService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update message' })
    async update(
        @Param('id') id: string,
        @Body() updateMessageDto: UpdateGroupMessageDto,
        @Body('userId') userId: string,
    ) {
        return this.groupMessagesService.update(id, updateMessageDto, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete message' })
    async remove(@Param('id') id: string, @Body('userId') userId: string) {
        return this.groupMessagesService.delete(id, userId);
    }
    }