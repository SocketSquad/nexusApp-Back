import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFriendRequestDto {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;
}
