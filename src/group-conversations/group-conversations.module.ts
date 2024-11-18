import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GroupConversation,
  GroupConversationSchema,
} from './schemas/group-conversations.schema';
import { GroupConversationsController } from './group-conversations.controller';
import { GroupConversationsRepository } from './repositories/group-conversations.repository';
import { GroupConversationsService } from './providers/group-conversations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupConversation.name, schema: GroupConversationSchema },
    ]),
  ],
  controllers: [GroupConversationsController],
  providers: [
    {
      provide: 'GroupConversationsRepositoryInterface',
      useClass: GroupConversationsRepository,
    },
    {
      provide: 'GroupConversationsServiceInterface',
      useClass: GroupConversationsService,
    },
  ],
  exports: ['GroupConversationsServiceInterface'],
})
export class GroupConversationsModule {}
