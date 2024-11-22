import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './providers/friend-request.service';
import { FriendRequestRepository } from './repositories/friend-request.repository';
import { FriendRequest, FriendRequestSchema } from './schemas/friend-request.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FriendRequest.name, schema: FriendRequestSchema }])],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, FriendRequestRepository],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}
