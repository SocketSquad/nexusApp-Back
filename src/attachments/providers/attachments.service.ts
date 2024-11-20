import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AttachmentsRepository } from '../repositories/attachments.repository';
import { CreateAttachmentDto } from '../dtos/create-attachments.dto';
import { QueryAttachmentDto } from '../dtos/query-attachments.dto';
import { IAttachmentsService } from '../interfaces/attachments.service.interface';
import { Attachment } from '../schema/attachment.schema';

@Injectable()
export class AttachmentsService implements IAttachmentsService {
  constructor(private readonly attachmentsRepository: AttachmentsRepository) {}

  async create(createAttachmentDto: CreateAttachmentDto, uploaderId: string): Promise<Attachment> {
    return this.attachmentsRepository.create(createAttachmentDto, uploaderId);
  }

  async findById(id: string): Promise<Attachment> {
    const attachment = await this.attachmentsRepository.findById(id);
    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }
    return attachment;
  }

  async findByMessageId(messageId: string): Promise<Attachment[]> {
    return this.attachmentsRepository.findByMessageId(messageId);
  }

  async find(query: QueryAttachmentDto): Promise<Attachment[]> {
    return this.attachmentsRepository.find(query);
  }

  async delete(id: string, userId: string): Promise<Attachment> {
    const attachment = await this.findById(id);

    // Check  user is the uploader
    if (attachment.uploaderId.toString() !== userId) {
      throw new ForbiddenException('Unauthorized to delete this attachment');
    }

    return this.attachmentsRepository.delete(id);
  }

  async deleteByMessageId(messageId: string): Promise<void> {
    await this.attachmentsRepository.deleteByMessageId(messageId);
  }
}
