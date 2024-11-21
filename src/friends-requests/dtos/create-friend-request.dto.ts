import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateFriendRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  senderId: string;

  @IsNotEmpty()
  @IsMongoId()
  receiverId: string;
}
