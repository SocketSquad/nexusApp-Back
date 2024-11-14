import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AttachmentType } from '../../utils/types';

@Schema({
  collection: 'attachments',
  timestamps: true,
})
export class Attachment extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    refPath: 'messageType',
    index: true,
  })
  messageId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['DirectMessage', 'GroupMessage'],
  })
  messageType: string;

  @Prop({
    type: String,
    enum: Object.values(AttachmentType),
    required: true,
  })
  type: AttachmentType;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  size: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  uploaderId: MongooseSchema.Types.ObjectId;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
