import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  collection: 'profiles',
  timestamps: true,
})
export class Profile extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ required: false })
  bio?: string;

  @Prop({ type: String, default: 'light' })
  theme: string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ type: Date })
  blockedAt?: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
