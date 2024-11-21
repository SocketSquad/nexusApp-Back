import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { GroupService } from './providers/groups.service';
import { CreateGroupDto } from './dtos/create-group.dto';
import { UpdatedGroupDto } from './dtos/update-group.dto';
import { AddMemberDto } from './dtos/add-member.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully.' })
  async create(@Body() createGroupDto: CreateGroupDto, @Req() req: any) {
    const userId = new Types.ObjectId(String(req.user.userId));
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

  // Update group name or description
  @Put(':id')
  @ApiOperation({ summary: 'Update group' })
  async update(@Param('id') id: string, @Body() updateGroupDto: UpdatedGroupDto, @Req() req: any) {
    const userId = new Types.ObjectId(String(req.user.userId));
    return this.groupService.update(id, updateGroupDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = new Types.ObjectId(String(req.user.userId));
    const userObjectId = new Types.ObjectId(String(userId));
    return this.groupService.delete(id, userObjectId);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to group' })
  async addMember(@Param('id') id: string, @Body() addMemberDto: AddMemberDto, @Req() req: any) {
    const requesterId = req.user.userId;
    const requesterObjectId = new Types.ObjectId(String(requesterId));
    return this.groupService.addMember(id, addMemberDto, requesterObjectId);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove member from group' })
  async removeMember(@Param('id') id: string, @Param('memberId') memberId: string, @Req() req: any) {
    const requesterId = req.user.userId;
    const requesterObjectId = new Types.ObjectId(String(requesterId));
    return this.groupService.removeMember(id, memberId, requesterObjectId);
  }

  //Update member role
  @Put(':id/members/:memberId/role')
  @ApiOperation({ summary: 'Update member role' })
  async updateMemberRole(@Param('id') id: string, @Param('memberId') memberId: string, @Body('role') role: string, @Req() req: any) {
    const requesterId = req.user.userId;
    const requesterObjectId = new Types.ObjectId(String(requesterId));
    return this.groupService.updateMemberRole(id, memberId, role, requesterObjectId);
  }

  @Get(':id/unread')
  @ApiOperation({ summary: 'Get unread messages count' })
  async getUnreadCount(@Param('id') id: string, @Req() req: any) {
    const userId = new Types.ObjectId(String(req.user.userId));
    return this.groupService.getUnreadCount(id, userId);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark messages as read' })
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    const userId = new Types.ObjectId(String(req.user.userId));
    return this.groupService.updateMemberLastRead(id, userId);
  }
}
