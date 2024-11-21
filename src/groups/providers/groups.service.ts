import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { GroupRepository } from '../repositories/groups.repository';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { Group } from '../schemas/group.schema';
import { UpdatedGroupDto } from '../dtos/update-group.dto';
import { AddMemberDto } from '../dtos/add-member.dto';
import { IGroupService } from '../interfaces/group.service.interface';

@Injectable()
export class GroupService implements IGroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<Group> {
    return this.groupRepository.create(createGroupDto, userId);
  }

  async findAll(privacy?: string): Promise<Group[]> {
    const filter = privacy ? { privacy } : {};
    return this.groupRepository.findAll(filter);
  }

  async findById(id: string): Promise<Group> {
    const objectId = new Types.ObjectId(String(id));
    const group = await this.groupRepository.findById(objectId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async update(id: string, updateGroupDto: UpdatedGroupDto, userId: Types.ObjectId): Promise<Group> {
    const group = await this.findById(id);
    if (group.owner._id.toString() !== userId.toString()) {
      throw new ForbiddenException('Only the group owner can update the group');
    }
    return this.groupRepository.update(new Types.ObjectId(String(id)), updateGroupDto);
  }

  async delete(id: string, userId: Types.ObjectId): Promise<Group> {
    const group = await this.findById(id);
    if (group.owner._id.toString() !== userId.toString()) {
      throw new ForbiddenException('Only the group owner can delete the group');
    }
    return this.groupRepository.delete(new Types.ObjectId(String(id)));
  }

  async   addMember(groupId: string, addMemberDto: AddMemberDto, requesterId: Types.ObjectId): Promise<Group> {
    const group = await this.findById(groupId);

    const requesterMember = group.members.find(
      (m) => m.userId._id.toString() === requesterId.toString()
    );
    
    if (!requesterMember || (requesterMember.role !== 'admin' && group.owner._id.toString() !== requesterId.toString())) {
      throw new ForbiddenException('No permission to add members');
    }

    if (group.members.some((m) => m.userId._id.toString() === addMemberDto.userId.toString())) {
      throw new ForbiddenException('User is already a member of this group');
    }

    return this.groupRepository.addMember(
      new Types.ObjectId(String(groupId)),
      addMemberDto.userId,
      addMemberDto.role
    );
  }

  async removeMember(groupId: string, memberId: string, requesterId: Types.ObjectId): Promise<Group> {
    const group = await this.findById(groupId);

    const requesterMember = group.members.find(
      (m) => m.userId._id.toString() === requesterId.toString()
    );
    
    if (!requesterMember || (requesterMember.role !== 'admin' && group.owner._id.toString() !== requesterId.toString())) {
      throw new ForbiddenException('No permission to remove members');
    }

    const memberIdObj = new Types.ObjectId(String(memberId));
    if (group.owner._id.toString() === memberIdObj.toString()) {
      throw new ForbiddenException('Cannot remove the group owner');
    }

    // Find the member to be removed
    const memberToRemove = group.members.find(m => m.userId._id.toString() === memberIdObj.toString());

    if (!memberToRemove) {
      throw new NotFoundException('Member not found');
    }

    return this.groupRepository.removeMember(
      new Types.ObjectId(String(groupId)),
      memberIdObj
    );
  }

  async updateMemberRole(groupId: string, memberId: string, newRole: string, requesterId: Types.ObjectId): Promise<Group> {
    const group = await this.findById(groupId);

    if (group.owner._id.toString() !== requesterId.toString()) {
      throw new ForbiddenException('Only the group owner can update member roles');
    }

    const memberIdObj = new Types.ObjectId(String(memberId));
    if (group.owner._id.toString() === memberIdObj.toString()) {
      throw new ForbiddenException("Cannot change the owner's role");
    }

    // Find the member to be removed
    const memberToUpdate = group.members.find(m => m.userId._id.toString() === memberIdObj.toString());

    if (!memberToUpdate) {
      throw new NotFoundException('Member not found');
    }

    return this.groupRepository.updateMemberRole(
      new Types.ObjectId(String(groupId)),
      memberIdObj,
      newRole
    );
  }

  async checkMessageAccess(groupId: string, userId: Types.ObjectId): Promise<boolean> {
    const group = await this.findById(groupId);
    
    // Check if user is a member or owner
    const isMember = group.members.some(m => m.userId.toString() === userId.toString());
    const isOwner = group.owner._id.toString() === userId.toString();
    
    if (!isMember && !isOwner) {
      throw new ForbiddenException('User is not a member of this group');
    }
    
    return true;
  }

  async updateLastMessage(
    groupId: string,
    messageId: Types.ObjectId,
    content: string,
    senderId: Types.ObjectId,
    type: string
  ): Promise<Group> {
    return this.groupRepository.updateLastMessage(
      new Types.ObjectId(groupId),
      messageId,
      content,
      senderId,
      type
    );
  }

  async updateMemberLastRead(groupId: string, userId: Types.ObjectId): Promise<Group> {
    return this.groupRepository.updateMemberLastRead(
      new Types.ObjectId(groupId),
      userId
    );
  }

  async getUnreadCount(groupId: string, userId: Types.ObjectId): Promise<number> {
    const group = await this.findById(groupId);
    const member = group.members.find(m => m.userId._id.toString() === userId.toString());
    
    if (!member) {
      throw new ForbiddenException('User is not a member of this group');
    }

    // If no lastRead date, use joinedAt date
    const lastReadDate = member.lastRead || member.joinedAt;
    
    // If no messages yet, return 0
    if (!group.lastMessage) {
      return 0;
    }

    return group.lastMessage.sentAt > lastReadDate ? 1 : 0;
  }

}
