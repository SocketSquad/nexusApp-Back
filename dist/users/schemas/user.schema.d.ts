import { Document } from 'mongoose';
declare class UserStatus {
    online: boolean;
    lastSeen: Date;
}
declare class AccountStatus {
    isBlocked: boolean;
    blockedReason?: string;
    blockedAt?: Date;
}
declare class UserSettings {
    theme: string;
}
export declare class User extends Document {
    username: string;
    email: string;
    password: string;
    avatar?: string;
    status: UserStatus;
    accountStatus: AccountStatus;
    settings: UserSettings;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
