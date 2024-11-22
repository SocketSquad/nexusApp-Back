import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileUrl: string;

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
