import { Types } from 'mongoose';
import { GroupMessage } from '../schemas/group-message.schema';
import { CreateGroupMessageDto } from '../dtos/create-group-message.dto';
import { UpdateGroupMessageDto } from '../dtos/update-group-message.dto';

export interface IGroupMessagesService {
  create(groupId: string, senderId: Types.ObjectId, createMessageDto: CreateGroupMessageDto): Promise<GroupMessage>;

  findById(id: string): Promise<GroupMessage>;

  findByGroupId(groupId: string, userId: Types.ObjectId, limit?: number, before?: string): Promise<GroupMessage[]>;

  update(id: string, userId: Types.ObjectId, updateMessageDto: UpdateGroupMessageDto): Promise<GroupMessage>;

  delete(id: string, userId: Types.ObjectId): Promise<GroupMessage>;
}
