import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { FriendService } from './providers/friend.service';
import { CreateFriendDto } from './dtos/create-friend.dto';
import { UpdateFriendDto } from './dtos/update-friend.dto';

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  /**
   * Créer une nouvelle relation d'amitié
   */
  @Post()
  async createFriend(@Body() createFriendDto: CreateFriendDto) {
    return this.friendService.create(createFriendDto);
  }

  /**
   * Obtenir une liste des amis d'un utilisateur
   */
  @Get(':userId')
  async getFriendsByUserId(@Param('userId') userId: string) {
    const friends = await this.friendService.findByUserId(userId);
    if (!friends) {
      throw new HttpException(
        'Aucun ami trouvé pour cet utilisateur',
        HttpStatus.NOT_FOUND,
      );
    }
    return friends;
  }

  /**
   * Mettre à jour le statut d'une relation (ACCEPTED, BLOCKED)
   */
  @Patch(':id')
  async updateFriendStatus(
    @Param('id') friendId: string,
    @Body() updateFriendDto: UpdateFriendDto,
  ) {
    const updatedFriend = await this.friendService.updateStatus(
      friendId,
      updateFriendDto,
    );
    if (!updatedFriend) {
      throw new HttpException('Relation non trouvée', HttpStatus.NOT_FOUND);
    }
    return updatedFriend;
  }

  /**
   * Supprimer une relation d'amitié
   */
  @Delete(':id')
  async deleteFriend(@Param('id') friendId: string) {
    const result = await this.friendService.delete(friendId);
    if (!result) {
      throw new HttpException('Relation non trouvée', HttpStatus.NOT_FOUND);
    }
    return { message: 'Relation supprimée avec succès' };
  }
}
