import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class Participant {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: ['admin', 'member'],
    default: 'member',
  })
  role: string;

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;

  @Prop({ type: Date })
  lastRead: Date;

  @Prop({ default: false })
  isArchived: boolean;
}

@Schema({ _id: false })
class ConversationMetadata {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  lastMessageAt: Date;
}

@Schema({ _id: false })
class LastMessage {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  senderId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  sentAt: Date;

  @Prop({
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text',
  })
  type: string;
}

@Schema({
  collection: 'conversations',
  timestamps: true,
})
export class Conversation extends Document {
  @Prop({
    type: String,
    enum: ['private', 'group'],
    required: true,
  })
  type: string;

  @Prop({ type: [Participant], required: true })
  participants: Participant[];

  @Prop({ type: ConversationMetadata, default: () => ({}) })
  metadata: ConversationMetadata;

  @Prop({ type: LastMessage })
  lastMessage?: LastMessage;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
