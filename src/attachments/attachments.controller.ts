import {Controller,Get,Post,Delete,Param,Body,Query,UseGuards,Request,} from '@nestjs/common';
import { AttachmentsService } from './providers/attachments.service';
import { CreateAttachmentDto } from './dtos/create-attachments.dto';
import { QueryAttachmentDto } from './dtos/query-attachments.dto';
  
  @Controller('attachments')
  export class AttachmentsController {
    constructor(private readonly attachmentsService: AttachmentsService) {}
  
    @Post()
    async create(@Body() createAttachmentDto: CreateAttachmentDto, @Request() req) {
      return this.attachmentsService.create(createAttachmentDto, req.user.id);
    }
  
    @Get(':id')
    async findById(@Param('id') id: string) {
      return this.attachmentsService.findById(id);
    }
  
    @Get('message/:messageId')
    async findByMessageId(@Param('messageId') messageId: string) {
      return this.attachmentsService.findByMessageId(messageId);
    }
  
    @Get()
    async find(@Query() query: QueryAttachmentDto) {
      return this.attachmentsService.find(query);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req) {
      return this.attachmentsService.delete(id, req.user.id);
    }
  }