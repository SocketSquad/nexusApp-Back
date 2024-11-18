import { GroupMessage } from '../schemas/group-message.schema';
import { CreateGroupMessageDto } from '../dtos/create-group-message.dto';
import { UpdateGroupMessageDto } from '../dtos/update-group-message.dto';

export interface IGroupMessagesRepository {
  create(createMessageDto: CreateGroupMessageDto): Promise<GroupMessage>;
  findByConversation(
    conversationId: string,
    page: number,
    limit: number,
  ): Promise<{ messages: GroupMessage[]; total: number }>;
  findById(id: string): Promise<GroupMessage | null>;
  update(
    id: string,
    updateMessageDto: UpdateGroupMessageDto,
  ): Promise<GroupMessage | null>;
  delete(id: string): Promise<boolean>;
}
