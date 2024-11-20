import { Types } from 'mongoose';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { UpdatedGroupDto } from '../dtos/update-group.dto';
import { Group } from '../schemas/group.schema';

export interface IGroupRepository {
  create(createGroupDto: CreateGroupDto, ownerId: Types.ObjectId): Promise<Group>;
  findAll(filter: any): Promise<Group[]>;
  findById(id: Types.ObjectId): Promise<Group>;
  update(id: Types.ObjectId, updateGroupDto: UpdatedGroupDto): Promise<Group>;
  delete(id: Types.ObjectId): Promise<Group>;
  addMember(groupId: Types.ObjectId, userId: Types.ObjectId, role: string): Promise<Group>;
  removeMember(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<Group>;
  updateMemberRole(groupId: Types.ObjectId, userId: Types.ObjectId, newRole: string): Promise<Group>;
  updateLastMessage(
    groupId: Types.ObjectId,
    messageId: Types.ObjectId,
    content: string,
    senderId: Types.ObjectId,
    type: string
  ): Promise<Group>;
  updateMemberLastRead(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<Group>;
}