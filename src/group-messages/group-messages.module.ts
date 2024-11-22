import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupMessage, GroupMessageSchema } from './schemas/group-message.schema';
import { GroupMessagesRepository } from './repositories/group-messages.repository';
import { GroupMessagesService } from './providers/group-messages.service';
import { GroupMessagesController } from './group-messages.controller';
import { GroupsModule } from '@/groups/groups.module';
import { Group, GroupSchema } from '@/groups/schemas/group.schema';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupMessage.name, schema: GroupMessageSchema }
    ]),
    GroupsModule
  ],

  controllers: [GroupMessagesController],
  providers: [GroupMessagesRepository, GroupMessagesService],
  exports: [GroupMessagesService],
})
export class GroupMessagesModule {}
