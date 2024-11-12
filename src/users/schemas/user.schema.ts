import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class UserStatus {
  @Prop({ default: false })
  online: boolean;

  @Prop({ type: Date, default: Date.now })
  lastSeen: Date;
}

@Schema({ _id: false })
class AccountStatus {
  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ required: false })
  blockedReason?: string;

  @Prop({ type: Date, required: false })
  blockedAt?: Date;
}

@Schema({ _id: false })
class UserSettings {
  @Prop({
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  })
  theme: string;
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ type: UserStatus, default: () => ({}) })
  status: UserStatus;

  @Prop({ type: AccountStatus, default: () => ({}) })
  accountStatus: AccountStatus;

  @Prop({ type: UserSettings, default: () => ({}) })
  settings: UserSettings;
}

export const UserSchema = SchemaFactory.createForClass(User);
