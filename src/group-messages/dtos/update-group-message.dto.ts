import { IsString, IsOptional, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateGroupMessageDto } from './create-group-message.dto';

export class UpdateGroupMessageDto extends PartialType(CreateGroupMessageDto) {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}