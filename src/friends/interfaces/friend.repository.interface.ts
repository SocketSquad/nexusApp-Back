import { Friend } from '../schemas/friend.schema';
import { CreateFriendDto } from '../dtos/create-friend.dto';

export interface IFriendRepository {
  create(createFriendDto: CreateFriendDto): Promise<Friend>;
  findByUserId(userId: string): Promise<Friend[]>;
  updateStatus(friendId: string, status: string): Promise<Friend | null>;
  delete(friendId: string): Promise<boolean>;
}
