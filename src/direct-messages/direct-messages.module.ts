import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectMessage, DirectMessageSchema } from './schemas/direct-message.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DirectMessage.name, schema: DirectMessageSchema }])],
  providers: [],
  exports: [],
})
export class DirectMessagesModule {}
