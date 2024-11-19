import { Document, Types } from 'mongoose';
import { MessageType } from '../../utils/types';

export interface IDirectMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  type: MessageType;
  attachments: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateDirectMessage {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  type: MessageType;
  attachments?: Types.ObjectId[];
}

export interface IUpdateDirectMessage {
  content?: string;
  type?: MessageType;
  attachments?: Types.ObjectId[];
}