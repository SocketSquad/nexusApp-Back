import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class GroupMember {
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

  @Prop({ type: [String], default: [] })
  permissions: string[];
}

@Schema({ _id: false })
class GroupSettings {
  @Prop({
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  })
  privacy: string;

  @Prop({ default: false })
  joinApproval: boolean;

  @Prop({ default: true })
  allowInvites: boolean;

  @Prop({ type: Number, default: 30 })
  messageRetention: number;
}

@Schema({ _id: false })
class GroupMetadata {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  lastActivityAt: Date;
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
    trim: true,
    maxlength: 500,
  })
  description: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: MongooseSchema.Types.ObjectId;

  @Prop({ type: [GroupMember], default: [] })
  members: GroupMember[];

  @Prop({ type: GroupSettings, default: () => ({}) })
  settings: GroupSettings;

  @Prop({ type: GroupMetadata, default: () => ({}) })
  metadata: GroupMetadata;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
