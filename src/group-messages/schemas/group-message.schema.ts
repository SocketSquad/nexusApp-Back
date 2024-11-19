import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MessageType } from '@/utils/types';

@Schema({
  collection: 'group_messages',
  timestamps: true,
})
export class GroupMessage extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'GroupConversation',
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

  @Prop({ required: true })
  content: string;

  @Prop({
    type: String,
    enum: Object.values(MessageType),
    default: MessageType.TEXT,
    required: true,
  })
  type: MessageType;

  @Prop({ type: [String], default: [] })
  mentions: string[];

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Attachment',
      },
    ],
    default: [],
  })
  attachments: MongooseSchema.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export const GroupMessageSchema = SchemaFactory.createForClass(GroupMessage);
