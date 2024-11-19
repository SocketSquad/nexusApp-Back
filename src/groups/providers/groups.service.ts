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
    console.log("owner",group.owner);
    console.log("userId",userId);
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

  async addMember(groupId: string, addMemberDto: AddMemberDto, requesterId: Types.ObjectId): Promise<Group> {
    const group = await this.findById(groupId);

    const requesterMember = group.members.find(
      (m) => m.userId.toString() === requesterId.toString()
    );
    
    if (!requesterMember || (requesterMember.role !== 'admin' && group.owner._id.toString() !== requesterId.toString())) {
      throw new ForbiddenException('No permission to add members');
    }

    if (group.members.some((m) => m.userId.toString() === addMemberDto.userId.toString())) {
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
      (m) => m.userId.toString() === requesterId.toString()
    );
    
    if (!requesterMember || (requesterMember.role !== 'admin' && group.owner._id.toString() !== requesterId.toString())) {
      throw new ForbiddenException('No permission to remove members');
    }

    const memberIdObj = new Types.ObjectId(String(memberId));
    if (group.owner._id.toString() === memberIdObj.toString()) {
      throw new ForbiddenException('Cannot remove the group owner');
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

    return this.groupRepository.updateMemberRole(
      new Types.ObjectId(String(groupId)),
      memberIdObj,
      newRole
    );
  }
}