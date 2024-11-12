import { Document, Schema as MongooseSchema } from 'mongoose';
import { FriendStatus } from '../../utils/types';
export declare class FriendRequest extends Document {
    senderId: MongooseSchema.Types.ObjectId;
    receiverId: MongooseSchema.Types.ObjectId;
    status: FriendStatus;
    createdAt: Date;
    updatedAt: Date;
    respondedAt?: Date;
}
export declare const FriendRequestSchema: MongooseSchema<FriendRequest, import("mongoose").Model<FriendRequest, any, any, any, Document<unknown, any, FriendRequest> & FriendRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FriendRequest, Document<unknown, {}, import("mongoose").FlatRecord<FriendRequest>> & import("mongoose").FlatRecord<FriendRequest> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
