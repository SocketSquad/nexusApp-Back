import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ParticipantEntity {
  @Expose()
  @ApiProperty({ description: 'User ID of the participant' })
  @Transform(({ value }) => value.toString())
  userId: string;

  @ApiProperty({
    description: 'Role in conversation',
    enum: ['admin', 'member'],
  })
  @Expose()
  role: string;

  @ApiProperty({ description: 'Date when user joined conversation' })
  @Expose()
  joinedAt: Date;

  @ApiProperty({ description: 'Last time user read the conversation' })
  @Expose()
  lastRead: Date;
}

class LastMessageEntity {
  @Expose()
  @ApiProperty({ description: 'Message ID' })
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty({ description: 'Message content' })
  @Expose()
  content: string;

  @ApiProperty({ description: 'ID of user who sent the message' })
  @Expose()
  @Transform(({ value }) => value.toString())
  senderId: string;

  @ApiProperty({ description: 'Time message was sent' })
  @Expose()
  sentAt: Date;

  @ApiProperty({
    description: 'Type of message',
    enum: ['text', 'image', 'file'],
  })
  @Expose()
  type: string;
}

export class ConversationEntity {
  @Expose()
  @ApiProperty({ description: 'Conversation ID' })
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @ApiProperty({
    description: 'Type of conversation',
    enum: ['private', 'group'],
  })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'List of conversation participants',
    type: [ParticipantEntity],
  })
  @Expose()
  @Type(() => ParticipantEntity)
  participants: ParticipantEntity[];

  @ApiProperty({
    description: 'Conversation metadata',
    example: {
      createdAt: '2024-01-20T12:00:00Z',
      updatedAt: '2024-01-20T12:00:00Z',
      lastMessageAt: '2024-01-20T12:00:00Z',
    },
  })
  @Expose()
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastMessageAt: Date;
  };

  @ApiProperty({
    description: 'Last message in conversation',
    type: LastMessageEntity,
    required: false,
  })
  @Expose()
  @Type(() => LastMessageEntity)
  lastMessage?: LastMessageEntity;

  constructor(partial: Partial<ConversationEntity>) {
    Object.assign(this, partial);
  }
}
