import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupMessage, GroupMessageSchema } from './schemas/group-message.schema';
import { GroupMessagesRepository } from './repositories/group-messages.repository';
import { GroupMessagesService } from './providers/group-messages.service';
import { GroupMessagesController } from './group-messages.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: GroupMessage.name, schema: GroupMessageSchema }])],
  controllers: [GroupMessagesController],
  providers: [GroupMessagesRepository, GroupMessagesService],
  exports: [],
})
export class GroupMessagesModule {}
