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
}

export const GroupSchema = SchemaFactory.createForClass(Group);