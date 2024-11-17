import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AuthenticateSocketMiddleware } from './middlewares/authenticate-socket.middleware';

@Injectable()
export class WebsocketAdapter extends IoAdapter {
  constructor(
    private readonly authenticateSocket: AuthenticateSocketMiddleware,
  ) {
    super();
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    server.use(this.authenticateSocket.use.bind(this.authenticateSocket));

    return server;
  }
}
