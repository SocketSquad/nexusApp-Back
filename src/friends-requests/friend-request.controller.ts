import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { FriendRequestService } from './providers/friend-request.service';
import { CreateFriendRequestDto } from './dtos/create-friend-request.dto';
import { FriendRequest } from './schemas/friend-request.schema';

@Controller('friend-requests')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  async create(
    @Body() createFriendRequestDto: CreateFriendRequestDto,
  ): Promise<FriendRequest> {
    return this.friendRequestService.create(createFriendRequestDto);
  }

  @Get(':userId')
  async findAllForUser(
    @Param('userId') userId: string,
  ): Promise<FriendRequest[]> {
    return this.friendRequestService.findAllByUser(userId);
  }

  @Patch(':id/accept')
  async acceptRequest(
    @Param('id') id: string,
  ): Promise<FriendRequest> {
    return this.friendRequestService.acceptRequest(id);
  }

  @Patch(':id/reject')
  async rejectRequest(
    @Param('id') id: string,
  ): Promise<FriendRequest> {
    return this.friendRequestService.rejectRequest(id);
  }

  @Delete(':id')
  async cancelRequest(
    @Param('id') id: string,
  ): Promise<FriendRequest> {
    return this.friendRequestService.cancelRequest(id);
  }
}