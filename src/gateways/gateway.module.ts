import { Module } from '@nestjs/common';
import { MessagingGateway } from './getway';
import { GatewaySessionManager } from './gateway.session';
import { GroupsModule } from '../groups/groups.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, GroupsModule],
  providers: [
    MessagingGateway,
    GatewaySessionManager,
    {
      provide: 'IGatewaySessionManager',
      useClass: GatewaySessionManager,
    },
  ],
  exports: ['IGatewaySessionManager'],
})
export class GatewayModule {}
