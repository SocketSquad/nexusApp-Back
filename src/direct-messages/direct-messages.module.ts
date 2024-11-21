import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectMessageController } from './direct-message.controller';
import { DirectMessageService } from './providers/direct-message.service';
import { DirectMessage, DirectMessageSchema } from './schemas/direct-message.schema';

import { DirectMessageRepository } from './repositories/direct-message.repository';
@Module({
  imports: [MongooseModule.forFeature([{ name: DirectMessage.name, schema: DirectMessageSchema }])],
  controllers: [DirectMessageController],
  providers: [DirectMessageService, DirectMessageRepository],
  exports: [DirectMessageService],
})
export class DirectMessageModule {}
