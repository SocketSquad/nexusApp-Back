import { IsString, IsEnum, IsOptional } from 'class-validator';
import { GroupRole } from '@/utils/types';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

export class AddMemberDto {
  @IsString()
  @Transform(({ value }) => value ? new Types.ObjectId(String(value)) : value)
  userId: Types.ObjectId;

  @IsEnum(GroupRole)
  @IsOptional()
  role?: GroupRole.MEMBER;
}