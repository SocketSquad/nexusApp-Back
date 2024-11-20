// import { MessageAttachment, UploadAttachmentParams, UploadImageParams } from '@/utils/types';

// export interface IImageStorageService {
//   upload(params: UploadImageParams): Promise<void>;
//   uploadAttachment(params: UploadAttachmentParams): Promise<MessageAttachment>;
// }

export interface UploadInterface {
  uploadFile(file: Express.Multer.File): Promise<{ url: string; key: string }>;
  // deleteFile(fileKey: string): Promise<void>;
}
