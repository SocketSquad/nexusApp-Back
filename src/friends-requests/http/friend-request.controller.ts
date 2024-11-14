

import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { FriendRequestService } from '../providers/friend-request.service';
import { CreateFriendRequestDto } from '../dtos/create-friend-request.dto';
import { UpdateFriendRequestDto } from '../dtos/update-friend-request.dto';
import { IFriendRequest } from '../interfaces/friend-request.interface';

@Controller('friend-requests')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  async create(@Body() createFriendRequestDto: CreateFriendRequestDto): Promise<IFriendRequest> {
    return this.friendRequestService.create(createFriendRequestDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<IFriendRequest> {
    return this.friendRequestService.getById(id);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateFriendRequestDto: UpdateFriendRequestDto,
  ): Promise<IFriendRequest> {
    return this.friendRequestService.updateStatus(id, updateFriendRequestDto);
  }
}
                                  