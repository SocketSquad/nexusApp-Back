import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'sessions',
  timestamps: true,
})
export class Session extends Document {
  @Prop({ type: Number, default: Date.now })
  expiredAt: number;

  @Prop({ required: true })
  json: string;

  @Prop({ type: Date, default: null })
  destroyedAt: Date | null;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
