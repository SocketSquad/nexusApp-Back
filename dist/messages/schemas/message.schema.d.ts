import { Document, Schema as MongooseSchema } from 'mongoose';
declare class Mention {
    userId: MongooseSchema.Types.ObjectId;
    username: string;
}
declare class MessageContent {
    text: string;
    mentions: Mention[];
}
declare class Attachment {
    _id: MongooseSchema.Types.ObjectId;
    type: string;
    url: string;
    metadata: Record<string, any>;
}
declare class DeliveryStatus {
    userId: MongooseSchema.Types.ObjectId;
    timestamp: Date;
}
declare class MessageStatus {
    delivered: DeliveryStatus[];
    read: DeliveryStatus[];
}
declare class ReplyTo {
    messageId: MongooseSchema.Types.ObjectId;
    content: string;
    senderId: MongooseSchema.Types.ObjectId;
}
declare class MessageMetadata {
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    editedAt?: Date;
}
export declare class Message extends Document {
    conversationId: MongooseSchema.Types.ObjectId;
    senderId: MongooseSchema.Types.ObjectId;
    type: string;
    content: MessageContent;
    attachments: Attachment[];
    status: MessageStatus;
    replyTo?: ReplyTo;
    metadata: MessageMetadata;
}
export declare const MessageSchema: MongooseSchema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message> & Message & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>> & import("mongoose").FlatRecord<Message> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
