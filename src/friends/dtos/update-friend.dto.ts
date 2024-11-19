import { IsEnum, IsOptional } from 'class-validator';
import { FriendStatus } from '../../utils/types';

export class UpdateFriendDto {
  @IsOptional()
  @IsEnum(FriendStatus)
  status?: FriendStatus;
}
