import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class UserDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatar?: string;
}

class ParticipantResponseDto {
  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  userId: UserDto;

  @ApiProperty({ example: '2024-01-20T12:00:00Z' })
  lastRead?: Date;
}

class LastMessageResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'Hello, how are you?' })
  content: string;

  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  senderId: UserDto;

  @ApiProperty({ example: '2024-01-20T12:00:00Z' })
  sentAt: Date;
}

export class ConversationResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ type: [ParticipantResponseDto] })
  @Type(() => ParticipantResponseDto)
  participants: ParticipantResponseDto[];

  @ApiProperty({ type: LastMessageResponseDto })
  @Type(() => LastMessageResponseDto)
  lastMessage?: LastMessageResponseDto;

  @ApiProperty({ example: '2024-01-20T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T12:00:00Z' })
  updatedAt: Date;
}