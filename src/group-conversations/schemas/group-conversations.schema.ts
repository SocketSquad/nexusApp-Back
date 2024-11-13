import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GroupRole } from '../../utils/types';

@Schema({ _id: false })
class GroupParticipant {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(GroupRole),
    default: GroupRole.MEMBER,
    required: true,
  })
  role: string;

  @Prop({ type: Date })
  lastRead: Date;
}

@Schema({ _id: false })
class LastMessage {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  senderId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  sentAt: Date;
}

@Schema({
  collection: 'group_conversations',
  timestamps: true,
})
export class GroupConversation extends Document {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  })
  name: string;

  @Prop({
    type: [GroupParticipant],
    required: true,
  })
  participants: GroupParticipant[];

  @Prop({ type: LastMessage })
  lastMessage?: LastMessage;
}

export const GroupConversationSchema =
  SchemaFactory.createForClass(GroupConversation);
