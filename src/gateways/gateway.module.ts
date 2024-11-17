import { Module } from '@nestjs/common';
// import { MessagingGateway } from './gateway';
import { GatewaySessionManager } from './gateway.session';
import { DirectConversationsModule } from '../direct-conversations/direct-conversations.module';
import { GroupConversationsModule } from '../group-conversations/group-conversations.module';
import { GroupsModule } from '../groups/groups.module';
import { FriendsModule } from '../friends/friends.module';

@Module({
  imports: [
    DirectConversationsModule,
    GroupConversationsModule,
    GroupsModule,
    FriendsModule,
  ],
  providers: [GatewaySessionManager],
  exports: [GatewaySessionManager],
})
export class GatewayModule {}
