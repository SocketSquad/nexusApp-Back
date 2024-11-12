import { Document, Schema as MongooseSchema } from 'mongoose';
declare class GroupMember {
    userId: MongooseSchema.Types.ObjectId;
    role: string;
    joinedAt: Date;
    permissions: string[];
}
declare class GroupSettings {
    privacy: string;
    joinApproval: boolean;
    allowInvites: boolean;
    messageRetention: number;
}
declare class GroupMetadata {
    createdAt: Date;
    updatedAt: Date;
    lastActivityAt: Date;
}
export declare class Group extends Document {
    name: string;
    description: string;
    avatar?: string;
    owner: MongooseSchema.Types.ObjectId;
    members: GroupMember[];
    settings: GroupSettings;
    metadata: GroupMetadata;
}
export declare const GroupSchema: MongooseSchema<Group, import("mongoose").Model<Group, any, any, any, Document<unknown, any, Group> & Group & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Group, Document<unknown, {}, import("mongoose").FlatRecord<Group>> & import("mongoose").FlatRecord<Group> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
