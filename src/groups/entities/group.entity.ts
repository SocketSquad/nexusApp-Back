import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GroupMemberEntity {
  @Expose()
  @ApiProperty({ description: 'User ID of the member' })
  @Transform(({ value }) => value.toString())
  userId: string;

  @ApiProperty({
    description: 'Role in the group',
    enum: ['admin', 'member'],
  })
  @Expose()
  role: string;

  @ApiProperty({ description: 'When the member joined' })
  @Expose()
  joinedAt: Date;

  @ApiProperty({ description: 'Member permissions' })
  @Expose()
  permissions: string[];
}

class GroupSettingsEntity {
  @ApiProperty({
    description: 'Group privacy setting',
    enum: ['public', 'private'],
  })
  @Expose()
  privacy: string;

  @ApiProperty({ description: 'Require approval to join' })
  @Expose()
  joinApproval: boolean;

  @ApiProperty({ description: 'Allow members to invite others' })
  @Expose()
  allowInvites: boolean;

  @ApiProperty({ description: 'Message retention period in days' })
  @Expose()
  messageRetention: number;
}

export class GroupEntity {
  @Expose()
  @ApiProperty({ description: 'Group ID' })
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @ApiProperty({
    description: 'Group name',
    minLength: 3,
    maxLength: 50,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Group description',
    maxLength: 500,
    required: false,
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Group avatar',
    type: 'object',
    properties: {
      url: { type: 'string' },
      thumbnailUrl: { type: 'string' },
    },
  })
  @Expose()
  avatar: {
    url: string;
    thumbnailUrl: string;
  };

  @ApiProperty({ description: 'Group owner ID' })
  @Expose()
  @Transform(({ value }) => value.toString())
  owner: string;

  @ApiProperty({
    description: 'Group members',
    type: [GroupMemberEntity],
  })
  @Expose()
  @Type(() => GroupMemberEntity)
  members: GroupMemberEntity[];

  @ApiProperty({
    description: 'Group settings',
    type: GroupSettingsEntity,
  })
  @Expose()
  @Type(() => GroupSettingsEntity)
  settings: GroupSettingsEntity;

  @ApiProperty({
    description: 'Group metadata',
    type: 'object',
    properties: {
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      lastActivityAt: { type: 'string', format: 'date-time' },
    },
  })
  @Expose()
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastActivityAt: Date;
  };

  constructor(partial: Partial<GroupEntity>) {
    Object.assign(this, partial);
  }
}
