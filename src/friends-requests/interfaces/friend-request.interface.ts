

import { Document } from 'mongoose';
import { FriendStatus } from '../../utils/types';

export interface IFriendRequest extends Document {
  senderId: string;
  receiverId: string;
  status: FriendStatus;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}
