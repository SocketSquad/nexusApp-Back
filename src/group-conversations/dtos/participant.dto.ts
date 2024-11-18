import { 
    IsString, 
    IsNotEmpty, 
    MinLength, 
    MaxLength, 
    IsArray, 
    ValidateNested, 
    IsOptional, 
    IsDate 
  } from 'class-validator';
  
  import { Type } from 'class-transformer';
import { GroupRole } from '../../../src/utils/types';
import { Types } from 'mongoose';
  
  export class ParticipantDto {
    @IsString()
    @IsNotEmpty()
    userId: string |Types.ObjectId;
  
    @IsString()
    @IsOptional()
    role?: string = GroupRole.MEMBER;
  
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    lastRead?: Date;
  }