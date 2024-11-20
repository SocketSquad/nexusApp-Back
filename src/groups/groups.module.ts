import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';
import { GroupController } from './groups.controller';
import { GroupService } from './providers/groups.service';
import { GroupRepository } from './repositories/groups.repository';
import { GroupMessage, GroupMessageSchema } from '@/group-messages/schemas/group-message.schema';
import { GroupMessagesService } from '@/group-messages/providers/group-messages.service';
import { GroupMessagesRepository } from '@/group-messages/repositories/group-messages.repository';
import { GroupMessagesController } from '@/group-messages/group-messages.controller';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupMessage.name, schema: GroupMessageSchema }
    ])
  ],
  controllers: [GroupController, GroupMessagesController
  ],
  providers: [
    GroupService, 
    GroupRepository,
    GroupMessagesService,
    GroupMessagesRepository
  ],
  exports: [GroupService, GroupMessagesService],
})
export class GroupsModule {}
