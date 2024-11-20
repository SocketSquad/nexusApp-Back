import { Types } from 'mongoose';
import { AddMemberDto } from '../dtos/add-member.dto';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { UpdatedGroupDto } from '../dtos/update-group.dto';
import { Group } from '../schemas/group.schema';

export interface IGroupService {
  create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<Group>;
  findAll(privacy?: string): Promise<Group[]>;
  findById(id: string): Promise<Group>;
  update(id: string, updateGroupDto: UpdatedGroupDto, userId: Types.ObjectId): Promise<Group>;
  delete(id: string, userId: Types.ObjectId): Promise<Group>;
  addMember(groupId: string, addMemberDto: AddMemberDto, requesterId: Types.ObjectId): Promise<Group>;
  removeMember(groupId: string, memberId: string, requesterId: Types.ObjectId): Promise<Group>;
  updateMemberRole(groupId: string, memberId: string, newRole: string, requesterId: Types.ObjectId): Promise<Group>;
}