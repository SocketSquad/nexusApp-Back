import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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
    enum: ['text', 'image', 'file'],
    default: 'text',
    required: true,
  })
  type: string;

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

export const DirectMessageSchema = SchemaFactory.createForClass(DirectMessage);
