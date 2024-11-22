import { Friend } from '../schemas/friend.schema';
import { CreateFriendDto } from '../dtos/create-friend.dto';
import { UpdateFriendDto } from '../dtos/update-friend.dto';

export interface IFriendService {
  /**
   * Creates a new friend relationship
   * @param createFriendDto The data to create the friend relationship
   */
  create(createFriendDto: CreateFriendDto): Promise<Friend>;

  /**
   * Finds all friend relationships for a user
   * @param userId The ID of the user
   */
  findByUserId(userId: string): Promise<Friend[]>;

  /**
   * Updates the status of a friend relationship
   * @param friendId The ID of the friend relationship
   * @param updateFriendDto The data to update the status
   * @throws NotFoundException when friend relationship is not found
   */
  updateStatus(friendId: string, updateFriendDto: UpdateFriendDto): Promise<Friend>;

  /**
   * Deletes a friend relationship
   * @param friendId The ID of the friend relationship to delete
   */
  delete(friendId: string): Promise<boolean>;
}
