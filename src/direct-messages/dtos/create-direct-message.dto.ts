import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional } from 'class-validator';
import { MessageType } from '../../utils/types';
import { Types } from 'mongoose';

export class CreateDirectMessageDto {
  @IsNotEmpty()
  @IsString()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsOptional()
  @IsArray()
  attachments?: Types.ObjectId[];
}
