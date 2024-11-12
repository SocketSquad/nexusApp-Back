import { Document } from 'mongoose';
import { FriendStatus } from '../../utils/types';

export interface IFriend extends Document {
  senderId: string;
  receiverId: string;
  status: FriendStatus;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  blockedAt?: Date;
}

export interface IFriendResponse {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendStatus;
  createdAt: Date;
  acceptedAt?: Date;
}
