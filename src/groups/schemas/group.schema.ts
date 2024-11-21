import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { GroupPrivacy } from '@/utils/types';

@Schema({ _id: false })
class GroupMember {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['admin', 'member'],
    default: 'member',
    required: true,
  })
  role: string;

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;

  @Prop({ type: Date })
  lastRead: Date;
}

@Schema({ _id: false })
class LastMessage {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  senderId: Types.ObjectId;

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
  collection: 'groups',
  timestamps: true,
})
export class Group extends Document {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  })
  name: string;

  @Prop({
    required: false,
    trim: true,
    minlength: 3,
    maxlength: 50,
  })
  description: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  owner: Types.ObjectId;

  @Prop({
    type: [GroupMember],
    default: [],
  })
  members: GroupMember[];

  @Prop({
    type: String,
    enum: Object.values(GroupPrivacy),
    default: GroupPrivacy.PUBLIC,
    required: true,
  })
  privacy: string;

  @Prop({ type: Date, default: Date.now })
  lastActivityAt: Date;

  @Prop({ type: LastMessage })
  lastMessage?: LastMessage;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'GroupMessage' }] })
  messages: MongooseSchema.Types.ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);