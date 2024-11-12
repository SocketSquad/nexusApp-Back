import { Document, Schema as MongooseSchema } from 'mongoose';
import { AttachmentType, AttachmentStatus } from '../../utils/types';
declare class AttachmentMetadata {
    size: number;
    mimeType: string;
}
export declare class Attachment extends Document {
    type: AttachmentType;
    key: string;
    originalName: string;
    url: string;
    metadata: AttachmentMetadata;
    status: AttachmentStatus;
    messageId: MongooseSchema.Types.ObjectId;
    userId: MongooseSchema.Types.ObjectId;
}
export declare const AttachmentSchema: MongooseSchema<Attachment, import("mongoose").Model<Attachment, any, any, any, Document<unknown, any, Attachment> & Attachment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Attachment, Document<unknown, {}, import("mongoose").FlatRecord<Attachment>> & import("mongoose").FlatRecord<Attachment> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
