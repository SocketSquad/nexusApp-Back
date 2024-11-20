import { Document, Types } from 'mongoose';

export interface IParticipant {
  userId: Types.ObjectId;
  lastRead?: Date;
}

export interface ILastMessage {
    _id: Types.ObjectId;
    content: string;
    senderId: Types.ObjectId;
    sentAt: Date;
  }

export interface IDirectConversation extends Document {
  participants: IParticipant[];
  lastMessage?: ILastMessage;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateDirectConversation {
    participants: IParticipant[];
  }

export interface IUpdateDirectConversation {
  lastMessage?: ILastMessage;
  'participants.$.lastRead'?: Date;
}
export interface IUpdateLastMessage {
    _id: Types.ObjectId;
    content: string;
    senderId: Types.ObjectId;
    sentAt: Date;
  }