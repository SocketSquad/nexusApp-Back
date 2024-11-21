import { IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { GroupRole } from '@/utils/types';
import { Types } from 'mongoose';

export class AddMemberDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsEnum(GroupRole)
  @IsOptional()
  role?: GroupRole.MEMBER;
}
