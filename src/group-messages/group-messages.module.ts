import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupMessage, GroupMessageSchema } from './schemas/group-message.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: GroupMessage.name, schema: GroupMessageSchema }])],
  providers: [],
  exports: [],
})
export class GroupMessagesModule {}
