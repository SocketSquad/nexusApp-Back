import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectConversation, DirectConversationSchema } from './schemas/direct-conversations.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DirectConversation.name, schema: DirectConversationSchema }])],
  controllers: [],
  providers: [],
  exports: [],
})
export class DirectConversationsModule {}
