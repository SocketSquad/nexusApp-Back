import { Injectable } from '@nestjs/common';
import { IUserService } from '../interfaces/user.interface';

@Injectable()
export class UserService implements IUserService {}
