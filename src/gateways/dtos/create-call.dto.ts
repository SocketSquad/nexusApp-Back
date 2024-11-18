import { IsNumber } from 'class-validator';

export class CreateCallDto {
  @IsNumber()
  recipientId: number;

  @IsNumber()
  conversationId: number;
}
