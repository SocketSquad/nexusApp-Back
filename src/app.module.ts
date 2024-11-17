import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { DirectConversationsModule } from './direct-conversations/direct-conversations.module';
import { GroupConversationsModule } from './group-conversations/group-conversations.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { DirectMessagesModule } from './direct-messages/direct-messages.module';
import { GroupMessagesModule } from './group-messages/group-messages.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { FriendsModule } from './friends/friends.module';
import { FriendsRequestsModule } from './friends-requests/friends-requests.module';
import { SessionsModule } from './sessions/sessions.module';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateways/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DirectConversationsModule,
    GroupConversationsModule,
    UsersModule,
    GroupsModule,
    DirectMessagesModule,
    GroupMessagesModule,
    AttachmentsModule,
    FriendsModule,
    FriendsRequestsModule,
    SessionsModule,
    AuthModule,
    GatewayModule,
  ],
})
export class AppModule {}
