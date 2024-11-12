import { Mongoose } from 'mongoose';
export declare const usersProviders: {
    provide: string;
    useFactory: (mongoose: Mongoose) => import("mongoose").Model<import("../schemas/user.schema").User, {}, {}, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User> & import("../schemas/user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, import("mongoose").Schema<import("../schemas/user.schema").User, import("mongoose").Model<import("../schemas/user.schema").User, any, any, any, import("mongoose").Document<unknown, any, import("../schemas/user.schema").User> & import("../schemas/user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, import("../schemas/user.schema").User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<import("../schemas/user.schema").User>> & import("mongoose").FlatRecord<import("../schemas/user.schema").User> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>>;
    inject: string[];
}[];
