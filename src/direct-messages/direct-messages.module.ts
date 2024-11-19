import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectMessage, DirectMessageSchema } from './schemas/direct-message.schema';
import { DirectMessageRepository } from './repositories/direct-message.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DirectMessage.name, schema: DirectMessageSchema },
    ]),
  ],
  providers: [DirectMessageRepository],
  exports: [DirectMessageRepository],
})
export class DirectMessageModule {}