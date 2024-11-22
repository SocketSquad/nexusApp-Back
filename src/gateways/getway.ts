import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { GroupService } from '../groups/providers/groups.service';
import { GroupMessagesService } from '../group-messages/providers/group-messages.service';
import { IGatewaySessionManager } from './gateway.session';
import { AuthenticatedSocket } from '../utils/interfaces/authenticated-socket.interface';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(MessagingGateway.name);

  constructor(
    private readonly sessions: IGatewaySessionManager,
    private readonly groupService: GroupService,
    private readonly messagesService: GroupMessagesService,
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

  // Group handlers
  @SubscribeMessage('joinGroup')
  async handleJoinGroup(client: Socket, groupId: string) {
    await client.join(`group-${groupId}`);
    client.emit('joinedGroup', { groupId });
  }

  @SubscribeMessage('leaveGroup')
  async handleLeaveGroup(client: Socket, groupId: string) {
    await client.leave(`group-${groupId}`);
    client.emit('leftGroup', { groupId });
  }

  // Message handlers
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: {
      groupId: string;
      content: string;
      senderId: string;
    },
  ) {
    try {
      const message = await this.messagesService.create(payload.groupId, new Types.ObjectId(payload.senderId), { content: payload.content, type: 'text' });

      // Broadcast to all clients in the group
      this.server.to(`group-${payload.groupId}`).emit('newMessage', message);

      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    client: Socket,
    payload: {
      messageId: string;
      content: string;
      userId: string;
    },
  ) {
    try {
      const message = await this.messagesService.update(payload.messageId, new Types.ObjectId(payload.userId), { content: payload.content });

      // Broadcast update to group
      const groupId = message.groupId.toString();
      this.server.to(`group-${groupId}`).emit('messageUpdated', message);

      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    client: Socket,
    payload: {
      messageId: string;
      userId: string;
    },
  ) {
    try {
      const message = await this.messagesService.delete(payload.messageId, new Types.ObjectId(payload.userId));

      // Broadcast deletion to group
      const groupId = message.groupId.toString();
      this.server.to(`group-${groupId}`).emit('messageDeleted', {
        messageId: payload.messageId,
        groupId,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Group Invitation Handlers
  @SubscribeMessage('sendGroupInvitation')
  async handleSendInvitation(
    client: Socket,
    payload: {
      groupId: string;
      inviterId: string;
      inviteeId: string;
    },
  ) {
    try {
      const group = await this.groupService.sendInvitation(payload.groupId, new Types.ObjectId(payload.inviterId), new Types.ObjectId(payload.inviteeId));

      // Notify the invitee
      const inviteeSocket = this.sessions.getUserSocket(payload.inviteeId);
      if (inviteeSocket) {
        inviteeSocket.emit('groupInvitation', {
          groupId: group._id,
          groupName: group.name,
          inviterId: payload.inviterId,
        });
      }

      return { success: true, group };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('acceptGroupInvitation')
  async handleAcceptInvitation(
    client: Socket,
    payload: {
      groupId: string;
      userId: string;
    },
  ) {
    try {
      const group = await this.groupService.acceptInvitation(payload.groupId, new Types.ObjectId(payload.userId));

      // Add user to group room
      await client.join(`group-${payload.groupId}`);

      // Notify group members
      this.server.to(`group-${payload.groupId}`).emit('memberJoined', {
        groupId: payload.groupId,
        userId: payload.userId,
      });

      return { success: true, group };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('declineGroupInvitation')
  async handleDeclineInvitation(
    client: Socket,
    payload: {
      groupId: string;
      userId: string;
    },
  ) {
    try {
      const group = await this.groupService.declineInvitation(payload.groupId, new Types.ObjectId(payload.userId));

      return { success: true, group };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
