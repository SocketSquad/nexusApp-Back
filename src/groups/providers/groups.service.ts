import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { GroupRepository } from '../repositories/groups.repository';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { Group } from '../schemas/group.schema';
import { UpdatedGroupDto } from '../dtos/update-group.dto';
import { AddMemberDto } from '../dtos/add-member.dto';
import { IGroupService } from '../interfaces/group.service.interface';

@Injectable()
export class GroupService implements IGroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async create(createGroupDto: CreateGroupDto, userId: string): Promise<Group> {
    return this.groupRepository.create(createGroupDto, userId);
  }

  async findAll(privacy?: string): Promise<Group[]> {
    const filter = privacy ? { privacy } : {};
    return this.groupRepository.findAll(filter);
  }

  async findById(id: string): Promise<Group> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async update(
    id: string,
    updateGroupDto: UpdatedGroupDto,
    userId: string,
  ): Promise<Group> {
    const group = await this.findById(id);
    if (group.owner.toString() !== userId) {
      throw new ForbiddenException('Only the group owner can update the group');
    }
    return this.groupRepository.update(id, updateGroupDto);
  }

  async delete(id: string, userId: string): Promise<Group> {
    const group = await this.findById(id);
    if (group.owner.toString() !== userId) {
      throw new ForbiddenException('Only the group owner can delete the group');
    }
    return this.groupRepository.delete(id);
  }

  async addMember(
    groupId: string,
    addMemberDto: AddMemberDto,
    requesterId: string,
  ): Promise<Group> {
    const group = await this.findById(groupId);

    // Find the request member and check if he has permission
    const requesterMember = group.members.find(
      (m) => m.userId.toString() === requesterId,
    );
    if (
      !requesterMember ||
      (requesterMember.role !== 'admin' &&
        group.owner.toString() !== requesterId)
    ) {
      throw new ForbiddenException('No permission to add members');
    }

    // Check if user is already a member
    if (
      group.members.some((m) => m.userId.toString() === addMemberDto.userId)
    ) {
      throw new ForbiddenException('User is already a member of this group');
    }

    return this.groupRepository.addMember(
      groupId,
      addMemberDto.userId,
      addMemberDto.role,
    );
  }

  async removeMember(
    groupId: string,
    memberId: string,
    requesterId: string,
  ): Promise<Group> {
    const group = await this.findById(groupId);

    // Find the request member and check if he has permission
    const requesterMember = group.members.find(
      (m) => m.userId.toString() === requesterId,
    );
    if (
      !requesterMember ||
      (requesterMember.role !== 'admin' &&
        group.owner.toString() !== requesterId)
    ) {
      throw new ForbiddenException('No permission to remove members');
    }

    // Cannot remove the owner
    if (memberId === group.owner.toString()) {
      throw new ForbiddenException('Cannot remove the group owner');
    }

    return this.groupRepository.removeMember(groupId, memberId);
  }

  async updateMemberRole(
    groupId: string,
    memberId: string,
    newRole: string,
    requesterId: string,
  ): Promise<Group> {
    const group = await this.findById(groupId);

    // Check permission
    if (group.owner.toString() !== requesterId) {
      throw new ForbiddenException(
        'Only the group owner can update member roles',
      );
    }

    // Forbidden to change owner's role
    if (memberId === group.owner.toString()) {
      throw new ForbiddenException("Cannot change the owner's role");
    }

    return this.groupRepository.updateMemberRole(groupId, memberId, newRole);
  }
}
