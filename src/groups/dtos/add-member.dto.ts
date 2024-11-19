import { IsString, IsEnum, IsOptional } from 'class-validator';
import { GroupRole } from '../../utils/types';

export class AddMemberDto {
  @IsString()
  userId: string;

  @IsEnum(GroupRole)
  @IsOptional()
  role?: GroupRole.MEMBER;
}
