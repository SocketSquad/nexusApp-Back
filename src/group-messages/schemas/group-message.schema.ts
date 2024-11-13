import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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
    enum: ['text', 'image', 'file', 'system'],
    default: 'text',
    required: true,
  })
  type: string;

  @Prop({ type: [String], default: [] })
  mentions: string[];

  @Prop({
    type: [
      {
        userId: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  readBy: Array<{ userId: MongooseSchema.Types.ObjectId; readAt: Date }>;
}

export const GroupMessageSchema = SchemaFactory.createForClass(GroupMessage);
