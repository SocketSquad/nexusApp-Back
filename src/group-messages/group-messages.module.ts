import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GroupMessage,
  GroupMessageSchema,
} from './schemas/group-message.schema';
import { GroupMessagesRepository } from './repositories/group-messages.repository';
import { GroupMessagesService } from './providers/group-messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupMessage.name, schema: GroupMessageSchema },
    ]),
  ],
  providers: [
    {
      provide: 'GroupMessagesRepositoryInterface',
      useClass: GroupMessagesRepository,
    },
    {
      provide: 'GroupMessagesServiceInterface',
      useClass: GroupMessagesService,
    },
  ],
  exports: ['GroupMessagesServiceInterface'],
})
export class GroupMessagesModule {}
