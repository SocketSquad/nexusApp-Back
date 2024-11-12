import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { FriendStatus } from '../../utils/types';

@Schema({
  collection: 'friend_requests',
  timestamps: true,
})
export class FriendRequest extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  senderId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  receiverId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(FriendStatus),
    default: FriendStatus.PENDING,
    index: true,
  })
  status: FriendStatus;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  respondedAt?: Date;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
