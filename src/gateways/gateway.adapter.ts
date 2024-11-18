import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { Injectable, INestApplication } from '@nestjs/common';
import { AuthenticateSocketMiddleware } from './middlewares/authenticate-socket.middleware';

@Injectable()
export class WebsocketAdapter extends IoAdapter {
  constructor(
    private readonly app: INestApplication,
    private readonly authenticateSocket: AuthenticateSocketMiddleware,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
      },
    });

    server.use(this.authenticateSocket.use.bind(this.authenticateSocket));

    return server;
  }
}
