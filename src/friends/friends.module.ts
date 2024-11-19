import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Friend, FriendSchema } from './schemas/friend.schema';
import { FriendService } from './providers/friend.service';
import { FriendController } from './FriendController';
import { FriendRepository } from './repositories/friend.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Friend.name, schema: FriendSchema }]),
  ],
  controllers: [FriendController],
  providers: [
    FriendService,
    {
      provide: 'IFriendRepository',
      useClass: FriendRepository,
    },
  ],
  exports: [FriendService],
})
export class FriendModule {}
