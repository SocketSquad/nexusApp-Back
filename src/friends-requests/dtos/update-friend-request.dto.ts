import { IsEnum, IsOptional } from 'class-validator';
import { FriendStatus } from '../../utils/types';

export class UpdateFriendRequestDto {
  @IsEnum(FriendStatus)
  @IsOptional()
  status?: FriendStatus;
}
