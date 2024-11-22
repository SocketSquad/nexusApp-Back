// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Attachment } from '../schema/attachment.schema';
// import { CreateAttachmentDto } from '../dtos/create-attachments.dto';
// import { QueryAttachmentDto } from '../dtos/query-attachments.dto';

// @Injectable()
// export class AttachmentsRepository {
//   constructor(
//     @InjectModel(Attachment.name)
//     private readonly attachmentModel: Model<Attachment>,
//   ) {}

//   async create(
//     createAttachmentDto: CreateAttachmentDto,
//     uploaderId: string,
//     messageId: string,
//     messageType: string
//   ): Promise<Attachment> {
//     const attachment = new this.attachmentModel({
//       ...createAttachmentDto,
//       uploaderId,
//       messageId,
//       messageType,
//     });
//     return attachment.save();
//   }

//   async findById(id: string): Promise<Attachment> {
//     return this.attachmentModel.findById(id).exec();
//   }

//   async findByMessageId(messageId: string, messageType: string): Promise<Attachment[]> {
//     return this.attachmentModel.find({ messageId, messageType }).exec();
//   }

//   async find(query: QueryAttachmentDto): Promise<Attachment[]> {
//     return this.attachmentModel.find(query).exec();
//   }

//   async delete(id: string): Promise<Attachment> {
//     return this.attachmentModel.findByIdAndDelete(id).exec();
//   }

//   async deleteByMessageId(messageId: string): Promise<void> {
//     await this.attachmentModel.deleteMany({ messageId }).exec();
//   }
// }
