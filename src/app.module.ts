import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { DirectConversationModule } from './direct-conversations/direct-conversations.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { DirectMessageModule } from './direct-messages/direct-messages.module';
import { GroupMessagesModule } from './group-messages/group-messages.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { SessionsModule } from './sessions/sessions.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { FriendModule } from './friends/friends.module';
import { FriendRequestModule } from './friends-requests/friends-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DirectConversationModule,
    UsersModule,
    GroupsModule,
    DirectMessageModule,
    GroupMessagesModule,
    AttachmentsModule,
    FriendModule,
    FriendRequestModule ,
    SessionsModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
