import { IsString, IsOptional, IsEnum, IsArray, MaxLength } from 'class-validator';
import { MessageType } from '../../utils/types';
import { Types } from 'mongoose';

export class UpdateDirectMessageDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsOptional()
  @IsArray()
  attachments?: Types.ObjectId[];
}