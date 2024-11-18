import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupService } from './providers/groups.service';
import { CreateGroupDto } from './dtos/create-group.dto';
import { UpdatedGroupDto } from './dtos/update-group.dto';
import { AddMemberDto } from './dtos/add-member.dto';

@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully.' })
  async create(@Body() createGroupDto: CreateGroupDto, @Query('userId') userId: string) {
    return this.groupService.create(createGroupDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  async findAll(@Query('privacy') privacy?: string) {
    return this.groupService.findAll(privacy);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by id' })
  async findOne(@Param('id') id: string) {
    return this.groupService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update group' })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdatedGroupDto,
    @Body('userId') userId: string,
  ) {
    return this.groupService.update(id, updateGroupDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  async remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.groupService.delete(id, userId);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to group' })
  async addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
    @Body('requesterId') requesterId: string,
  ) {
    return this.groupService.addMember(id, addMemberDto, requesterId);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove member from group' })
  async removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body('requesterId') requesterId: string,
  ) {
    return this.groupService.removeMember(id, memberId, requesterId);
  }

  @Put(':id/members/:memberId/role')
  @ApiOperation({ summary: 'Update member role' })
  async updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body('role') role: string,
    @Body('requesterId') requesterId: string,
  ) {
    return this.groupService.updateMemberRole(id, memberId, role, requesterId);
  }
}