import { AddMemberDto } from '../dtos/add-member.dto';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { UpdatedGroupDto } from '../dtos/update-group.dto';
import { Group } from '../schemas/group.schema';

export interface IGroupService {
  create(createGroupDto: CreateGroupDto, userId: string): Promise<Group>;
  findAll(privacy?: string): Promise<Group[]>;
  findById(id: string): Promise<Group>;
  update(
    id: string,
    updateGroupDto: UpdatedGroupDto,
    userId: string,
  ): Promise<Group>;
  delete(id: string, userId: string): Promise<Group>;
  addMember(
    groupId: string,
    addMemberDto: AddMemberDto,
    requesterId: string,
  ): Promise<Group>;
  removeMember(
    groupId: string,
    memberId: string,
    requesterId: string,
  ): Promise<Group>;
  updateMemberRole(
    groupId: string,
    memberId: string,
    newRole: string,
    requesterId: string,
  ): Promise<Group>;
}
