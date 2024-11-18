import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupConversation, GroupConversationSchema } from './schemas/group-conversations.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: GroupConversation.name, schema: GroupConversationSchema }])],
  controllers: [],
  providers: [],
  exports: [],
})
export class GroupConversationsModule {}
