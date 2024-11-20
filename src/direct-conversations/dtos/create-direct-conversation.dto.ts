import { IsArray, IsNotEmpty, ValidateNested, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ParticipantDto {
  @ApiProperty({
    description: 'The ID of the participant user',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  userId: string;
}

export class CreateDirectConversationDto {
  @ApiProperty({
    description: 'Array of conversation participants (exactly 2)',
    type: [ParticipantDto],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  participants: ParticipantDto[];
}
