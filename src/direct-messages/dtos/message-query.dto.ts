import { IsOptional, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100) // Hardcoded maximum page size
  limit?: number;

  @IsOptional()
  @IsDateString()
  before?: string;
}
