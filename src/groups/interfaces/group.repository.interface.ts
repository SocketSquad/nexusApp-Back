import { CreateGroupDto } from '../dtos/create-group.dto';
import { UpdatedGroupDto } from '../dtos/update-group.dto';
import { Group } from '../schemas/group.schema';

export interface IGroupRepository {
  create(createGroupDto: CreateGroupDto, ownerId: string): Promise<Group>;
  findAll(filter: any): Promise<Group[]>;
  findById(id: string): Promise<Group>;
  update(id: string, updateGroupDto: UpdatedGroupDto): Promise<Group>;
  delete(id: string): Promise<Group>;
  addMember(groupId: string, userId: string, role: string): Promise<Group>;
  removeMember(groupId: string, userId: string): Promise<Group>;
  updateMemberRole(groupId: string, userId: string, newRole: string): Promise<Group>;
}
