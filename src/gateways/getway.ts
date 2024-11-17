// import { Inject } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../utils/interfaces/authenticated-socket.interface';
// import { CreateCallDto } from './dtos/create-call.dto';
import { IGatewaySessionManager } from './gateway.session';
// import { IDirectConversationsService } from '../direct-conversations/interfaces/direct-conversations.interface';
// import { IGroupConversationsService } from '../group-conversations/interfaces/group-conversations.interface';
// import { IFriendsService } from '../friends/interfaces/friends.interface';
// import { IGroupsService } from '../groups/interfaces/groups.interface';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    readonly sessions: IGatewaySessionManager,
    // private readonly directConversationsService: IDirectConversationsService,
    // private readonly groupConversationsService: IGroupConversationsService,
    // private readonly friendsService: IFriendsService,
    // private readonly groupsService: IGroupsService,
  ) {}

  handleConnection(socket: AuthenticatedSocket) {
    console.log('Incoming Connection');
    this.sessions.setUserSocket(socket.user.id, socket);
    socket.emit('connected', {});
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log('handleDisconnect');
    console.log(`${socket.user.username} disconnected.`);
    this.sessions.removeUserSocket(socket.user.id);
  }
}
