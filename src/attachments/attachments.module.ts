// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Attachment, AttachmentSchema } from './schema/attachment.schema';
// import { AttachmentsController } from './attachments.controller';
// import { AttachmentsRepository } from './repositories/attachments.repository';
// import { AttachmentsService } from './providers/attachments.service';
// import { UploadModule } from '@/upload/upload.module';

// @Module({
//   imports: [MongooseModule.forFeature([{ name: Attachment.name, schema: AttachmentSchema }]), UploadModule],
//   controllers: [AttachmentsController],
//   providers: [AttachmentsRepository, AttachmentsService],
//   exports: [AttachmentsService],
// })
// export class AttachmentsModule {}
