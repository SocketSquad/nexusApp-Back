import { Mongoose } from 'mongoose';
export declare const groupsProviders: {
    provide: string;
    useFactory: (mongoose: Mongoose) => import("mongoose").Model<import("../schemas/group.schema").Group, {}, {}, {}, import("mongoose").Document<unknown, {}, import("../schemas/group.schema").Group> & import("../schemas/group.schema").Group & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, import("mongoose").Schema<import("../schemas/group.schema").Group, import("mongoose").Model<import("../schemas/group.schema").Group, any, any, any, import("mongoose").Document<unknown, any, import("../schemas/group.schema").Group> & import("../schemas/group.schema").Group & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, import("../schemas/group.schema").Group, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<import("../schemas/group.schema").Group>> & import("mongoose").FlatRecord<import("../schemas/group.schema").Group> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>>;
    inject: string[];
}[];
