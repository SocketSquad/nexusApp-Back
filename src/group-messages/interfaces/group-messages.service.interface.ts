import { GroupMessage } from '../schemas/group-message.schema';
import { CreateGroupMessageDto } from '../dtos/create-group-message.dto';
import { UpdateGroupMessageDto } from '../dtos/update-group-message.dto';

export interface IGroupMessagesService {
  create(createMessageDto: CreateGroupMessageDto): Promise<GroupMessage>;
  findByConversation(
    conversationId: string,
    page: number,
    limit: number,
  ): Promise<{ messages: GroupMessage[]; total: number }>;
  findById(id: string): Promise<GroupMessage>;
  update(
    id: string,
    updateMessageDto: UpdateGroupMessageDto,
    userId: string,
  ): Promise<GroupMessage>;
  delete(id: string, userId: string): Promise<void>;
}
