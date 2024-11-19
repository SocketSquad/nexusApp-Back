import { IsNotEmpty, IsEnum } from 'class-validator';
import { FriendStatus } from '../../utils/types';

export class CreateFriendDto {
  @IsNotEmpty()
  senderId: string;

  @IsNotEmpty()
  receiverId: string;

  @IsEnum(FriendStatus)
  status: FriendStatus;
}
