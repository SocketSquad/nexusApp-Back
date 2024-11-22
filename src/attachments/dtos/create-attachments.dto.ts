// // create-attachments.dto.ts
// import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

// export class CreateAttachmentDto {
//   @IsNotEmpty()
//   @IsString()
//   messageId: string;

//   @IsNotEmpty()
//   @IsEnum(['text', 'image', 'file'])
//   messageType: string;

//   @IsOptional()
//   @IsString()
//   fileName?: string;

//   @IsOptional()
//   @IsString()
//   fileUrl?: string;
// }
