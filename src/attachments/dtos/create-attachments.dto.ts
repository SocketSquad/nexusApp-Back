import { IsEnum, IsMongoId, IsNumber, IsString, IsUrl } from 'class-validator';
import { AttachmentType } from '@/utils/types';

export class CreateAttachmentDto {
  @IsMongoId()
  messageId: string;

  @IsEnum(['DirectMessage', 'GroupMessage'])
  messageType: 'DirectMessage' | 'GroupMessage';

  @IsEnum(AttachmentType)
  type: AttachmentType;

  @IsString()
  fileName: string;

  @IsUrl()
  url: string;

  @IsNumber()
  size: number;
}