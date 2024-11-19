import { IsNotEmpty, IsString, IsEnum, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { MessageType } from '../../utils/types';

export class CreateGroupMessageDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsMongoId({ each: true })
  attachments?: string[];
}
