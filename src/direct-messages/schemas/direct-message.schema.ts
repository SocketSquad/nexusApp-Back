import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MessageType } from '@/utils/types';
@Schema({
  collection: 'direct_messages',
  timestamps: true,
})
export class DirectMessage extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'DirectConversation',
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
}

export const DirectMessageSchema = SchemaFactory.createForClass(DirectMessage);
