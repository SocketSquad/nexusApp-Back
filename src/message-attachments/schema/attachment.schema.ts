import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AttachmentType, AttachmentStatus } from '../../utils/types';

@Schema({ _id: false })
class AttachmentMetadata {
  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  mimeType: string;
}

@Schema({
  collection: 'attachments',
  timestamps: true,
})
export class Attachment extends Document {
  @Prop({
    type: String,
    enum: Object.values(AttachmentType),
    required: true,
    index: true,
  })
  type: AttachmentType;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: AttachmentMetadata, required: true })
  metadata: AttachmentMetadata;

  @Prop({
    type: String,
    enum: Object.values(AttachmentStatus),
    default: AttachmentStatus.PENDING,
    index: true,
  })
  status: AttachmentStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message', required: true })
  messageId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
