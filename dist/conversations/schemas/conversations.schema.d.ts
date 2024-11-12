import { Document, Schema as MongooseSchema } from 'mongoose';
declare class Participant {
    userId: MongooseSchema.Types.ObjectId;
    role: string;
    joinedAt: Date;
    lastRead: Date;
    isArchived: boolean;
}
declare class ConversationMetadata {
    createdAt: Date;
    updatedAt: Date;
    lastMessageAt: Date;
}
declare class LastMessage {
    _id: MongooseSchema.Types.ObjectId;
    content: string;
    senderId: MongooseSchema.Types.ObjectId;
    sentAt: Date;
    type: string;
}
export declare class Conversation extends Document {
    type: string;
    participants: Participant[];
    metadata: ConversationMetadata;
    lastMessage?: LastMessage;
}
export declare const ConversationSchema: MongooseSchema<Conversation, import("mongoose").Model<Conversation, any, any, any, Document<unknown, any, Conversation> & Conversation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conversation, Document<unknown, {}, import("mongoose").FlatRecord<Conversation>> & import("mongoose").FlatRecord<Conversation> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
