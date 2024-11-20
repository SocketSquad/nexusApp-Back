import { CreateAttachmentDto } from '../dtos/create-attachments.dto';
import { QueryAttachmentDto } from '../dtos/query-attachments.dto';
import { Attachment } from '../schema/attachment.schema';

export interface IAttachmentsRepository {
  create(createAttachmentDto: CreateAttachmentDto, uploaderId: string): Promise<Attachment>;
  findById(id: string): Promise<Attachment>;
  findByMessageId(messageId: string): Promise<Attachment[]>;
  find(query: QueryAttachmentDto): Promise<Attachment[]>;
  delete(id: string): Promise<Attachment>;
  deleteByMessageId(messageId: string): Promise<void>;
}
