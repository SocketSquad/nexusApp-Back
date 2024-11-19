import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { GroupPrivacy } from '@/utils/types';

export class CreateGroupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  description?: string;

  @IsEnum(GroupPrivacy)
  @IsOptional()
  privacy?: GroupPrivacy = GroupPrivacy.PUBLIC;
}
