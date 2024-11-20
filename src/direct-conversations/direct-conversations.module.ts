import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectConversation, DirectConversationSchema } from './schemas/direct-conversations.schema';
import { DirectConversationController } from './direct-conversation.controller';
import { DirectConversationService } from './providers/direct-conversation.service';
import { DirectConversationRepository } from './repositories/direct-conversation.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DirectConversation.name, schema: DirectConversationSchema },
    ]),
  ],
  controllers: [DirectConversationController],
  providers: [DirectConversationService, DirectConversationRepository],
  exports: [DirectConversationService],
})
export class DirectConversationModule {}