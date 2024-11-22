// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { AttachmentsRepository } from '../repositories/attachments.repository';
// import { UploadService } from '../../upload/providers/upload.service';
// import { CreateAttachmentDto } from '../dtos/create-attachments.dto';
// import { Attachment } from '../schema/attachment.schema';

// @Injectable()
// export class AttachmentsService {
//   constructor(
//     private readonly attachmentsRepository: AttachmentsRepository,
//     private readonly uploadService: UploadService,
//   ) {}

//   // Simplified create method
//   async create(
//     createAttachmentDto: CreateAttachmentDto,
//     uploaderId: string,
//     file: Express.Multer.File
//   ): Promise<Attachment> {
//     // Upload the file to S3 or local storage
//     const fileUploadResult = await this.uploadService.uploadFile(file);

//     // Create the attachment record in the database
//     // const attachment = await this.attachmentsRepository.create({
//     //   ...createAttachmentDto,
//     //   fileName: file.originalname,
//     //   fileUrl: fileUploadResult.url,
//     //   size: file.size,
//     // }, uploaderId);

//     // return attachment;
//   }

//   // Find attachment by ID (simplified)
//   async findById(id: string): Promise<Attachment> {
//     const attachment = await this.attachmentsRepository.findById(id);
//     if (!attachment) {
//       throw new NotFoundException(`Attachment with ID ${id} not found`);
//     }
//     return attachment;
//   }
// }
