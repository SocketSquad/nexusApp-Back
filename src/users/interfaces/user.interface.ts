import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';

export interface IUserService {
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  create(createUserDto: CreateUserDto): Promise<User>;
  updateOnlineStatus(userId: string, isOnline: boolean): Promise<User>;
  validateCredentials(email: string, password: string): Promise<User>;
}
