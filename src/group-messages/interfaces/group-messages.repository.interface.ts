import { Types } from 'mongoose';
import { GroupMessage } from '../schemas/group-message.schema';
import { CreateGroupMessageDto } from '../dtos/create-group-message.dto';
import { UpdateGroupMessageDto } from '../dtos/update-group-message.dto';

export interface IGroupMessagesRepository {
  create(groupId: Types.ObjectId, senderId: Types.ObjectId, createMessageDto: CreateGroupMessageDto): Promise<GroupMessage>;

  findById(id: Types.ObjectId): Promise<GroupMessage>;

  findByGroupId(groupId: Types.ObjectId, limit?: number, before?: Date): Promise<GroupMessage[]>;

  update(id: Types.ObjectId, updateMessageDto: UpdateGroupMessageDto): Promise<GroupMessage>;

  softDelete(id: Types.ObjectId): Promise<GroupMessage>;

  setHasAttachments(id: Types.ObjectId, hasAttachments: boolean): Promise<GroupMessage>;
}
