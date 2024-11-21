import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { MessageType } from '@/utils/types';

@Schema({
  collection: 'group_messages',
  timestamps: true,
})
export class GroupMessage extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Group',
    required: true,
    index: true,
  })
  groupId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  senderId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  content: string;

  @Prop({
    type: String,
    enum: Object.values(MessageType),
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Prop({ type: Boolean, default: false })
  hasAttachments: boolean;

  @Prop({ type: Boolean, default: false })
  isEdited: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const GroupMessageSchema = SchemaFactory.createForClass(GroupMessage);
