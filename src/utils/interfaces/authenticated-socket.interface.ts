import { User } from '../../users/schemas/user.schema';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user?: User;
}
