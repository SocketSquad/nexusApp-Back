import { Document, Schema as MongooseSchema } from 'mongoose';
import { FriendStatus } from '../../utils/types';
export declare class Friend extends Document {
    senderId: MongooseSchema.Types.ObjectId;
    receiverId: MongooseSchema.Types.ObjectId;
    status: FriendStatus;
    createdAt: Date;
    updatedAt: Date;
    acceptedAt?: Date;
    blockedAt?: Date;
}
export declare const FriendSchema: MongooseSchema<Friend, import("mongoose").Model<Friend, any, any, any, Document<unknown, any, Friend> & Friend & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Friend, Document<unknown, {}, import("mongoose").FlatRecord<Friend>> & import("mongoose").FlatRecord<Friend> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
