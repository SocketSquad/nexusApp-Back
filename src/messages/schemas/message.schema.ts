import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class Mention {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  username: string;
}

@Schema({ _id: false })
class MessageContent {
  @Prop({ required: true })
  text: string;

  @Prop({ type: [Mention], default: [] })
  mentions: Mention[];
}

@Schema({ _id: false })
class Attachment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Attachment' })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: ['image', 'file'],
    required: true,
  })
  type: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;
}

@Schema({ _id: false })
class DeliveryStatus {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

@Schema({ _id: false })
class MessageStatus {
  @Prop({ type: [DeliveryStatus], default: [] })
  delivered: DeliveryStatus[];

  @Prop({ type: [DeliveryStatus], default: [] })
  read: DeliveryStatus[];
}

@Schema({ _id: false })
class ReplyTo {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message' })
  messageId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  senderId: MongooseSchema.Types.ObjectId;
}

@Schema({ _id: false })
class MessageMetadata {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: Date })
  editedAt?: Date;
}

@Schema({
  collection: 'messages',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Message extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  })
  conversationId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  senderId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text',
    index: true,
  })
  type: string;

  @Prop({ type: MessageContent, required: true })
  content: MessageContent;

  @Prop({ type: [Attachment], default: [] })
  attachments: Attachment[];

  @Prop({ type: MessageStatus, default: () => ({}) })
  status: MessageStatus;

  @Prop({ type: ReplyTo })
  replyTo?: ReplyTo;

  @Prop({ type: MessageMetadata, default: () => ({}) })
  metadata: MessageMetadata;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
