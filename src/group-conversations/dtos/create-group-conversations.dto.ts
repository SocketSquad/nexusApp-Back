import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { ParticipantDto } from "./participant.dto";

export class CreateGroupConversationDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ParticipantDto)
    participants: ParticipantDto[];
  }
  