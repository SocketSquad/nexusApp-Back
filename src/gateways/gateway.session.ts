import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from '../utils/interfaces/authenticated-socket.interface';

export interface IGatewaySessionManager {
  getUserSocket(userId: number): AuthenticatedSocket;
  setUserSocket(userId: number, socketId: AuthenticatedSocket): void;
  removeUserSocket(userId: number): void;
  getSockets(): Map<number, AuthenticatedSocket>;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<number, AuthenticatedSocket> = new Map();

  getUserSocket(userId: number): AuthenticatedSocket {
    return this.sessions.get(userId);
  }

  setUserSocket(userId: number, socketId: AuthenticatedSocket): void {
    this.sessions.set(userId, socketId);
  }

  removeUserSocket(userId: number): void {
    this.sessions.delete(userId);
  }

  getSockets(): Map<number, AuthenticatedSocket> {
    return this.sessions;
  }
}
