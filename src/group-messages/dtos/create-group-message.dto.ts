import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { MessageType } from '@/utils/types';

export class CreateGroupMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType.TEXT;
}

