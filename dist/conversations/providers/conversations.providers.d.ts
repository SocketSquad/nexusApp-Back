import { Mongoose } from 'mongoose';
export declare const conversationsProviders: {
    provide: string;
    useFactory: (mongoose: Mongoose) => import("mongoose").Model<import("../schemas/conversations.schema").Conversation, {}, {}, {}, import("mongoose").Document<unknown, {}, import("../schemas/conversations.schema").Conversation> & import("../schemas/conversations.schema").Conversation & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, import("mongoose").Schema<import("../schemas/conversations.schema").Conversation, import("mongoose").Model<import("../schemas/conversations.schema").Conversation, any, any, any, import("mongoose").Document<unknown, any, import("../schemas/conversations.schema").Conversation> & import("../schemas/conversations.schema").Conversation & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, import("../schemas/conversations.schema").Conversation, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<import("../schemas/conversations.schema").Conversation>> & import("mongoose").FlatRecord<import("../schemas/conversations.schema").Conversation> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>>;
    inject: string[];
}[];
