import * as cookie from 'cookie';
import * as cookieParser from 'cookie-parser';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Session } from '../../sessions/schemas/session.schema';
import { User } from '../../users/schemas/user.schema';
import { AuthenticatedSocket } from '../../utils/interfaces/authenticated-socket.interface';

@Injectable()
export class AuthenticateSocketMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async use(socket: AuthenticatedSocket, next: (err?: Error) => void) {
    try {
      const clientCookie = socket.handshake.headers.cookie;
      if (!clientCookie) {
        return next(new Error('Not Authenticated: No cookies were sent'));
      }

      const { CHAT_APP_SESSION_ID } = cookie.parse(clientCookie);
      if (!CHAT_APP_SESSION_ID) {
        return next(new Error('Not Authenticated: Session ID missing'));
      }

      const signedCookie = cookieParser.signedCookie(
        CHAT_APP_SESSION_ID,
        process.env.COOKIE_SECRET,
      );

      if (!signedCookie) {
        return next(new Error('Error signing cookie'));
      }

      const sessionDB = await this.sessionModel
        .findOne({ _id: signedCookie })
        .exec();
      if (!sessionDB) {
        return next(new Error('No session found'));
      }

      const userFromJson = JSON.parse(sessionDB.json);
      if (!userFromJson.passport?.user) {
        return next(new Error('Passport or User object does not exist.'));
      }

      const userDB = plainToInstance(User, userFromJson.passport.user);
      socket.user = userDB;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      next(new Error('Authentication failed'));
    }
  }
}
