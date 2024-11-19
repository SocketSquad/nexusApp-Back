import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './schemas/friend-request.schema';
import { FriendRequestRepository } from './repositories/friend-request.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
  ],
  providers: [FriendRequestRepository],
  exports: [FriendRequestRepository],
})
export class FriendRequestModule {}