import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Friend } from '../schemas/friend.schema';
import { CreateFriendDto } from '../dtos/create-friend.dto';
import { UpdateFriendDto } from '../dtos/update-friend.dto';
import { IFriendRepository } from '../interfaces/friend.repository.interface';
import { IFriendService } from '../interfaces/friend.service.interface';

@Injectable()
export class FriendService implements IFriendService {
  constructor(
    @Inject('IFriendRepository')
    private readonly friendRepository: IFriendRepository,
  ) {}

  async create(createFriendDto: CreateFriendDto): Promise<Friend> {
    return this.friendRepository.create(createFriendDto);
  }

  async findByUserId(userId: string): Promise<Friend[]> {
    return this.friendRepository.findByUserId(userId);
  }

  async updateStatus(
    friendId: string,
    updateFriendDto: UpdateFriendDto,
  ): Promise<Friend> {
    const updatedFriend = await this.friendRepository.updateStatus(
      friendId,
      updateFriendDto.status,
    );

    if (!updatedFriend) {
      throw new NotFoundException('Relation non trouvée');
    }
    return updatedFriend;
  }

  async delete(friendId: string): Promise<boolean> {
    return this.friendRepository.delete(friendId);
  }
}
