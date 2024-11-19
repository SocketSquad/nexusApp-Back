import { CreateGroupConversationDto } from '../dtos/create-group-conversations.dto';
import { UpdateGroupConversationDto } from '../dtos/update-group-conversations.dto';
import { GroupConversation } from '../schemas/group-conversations.schema';



export interface IGroupConversationsRepository {
  create(createConversationDto: CreateGroupConversationDto): Promise<GroupConversation>;
  findById(id: string): Promise<GroupConversation | null>;
  findByUser(userId: string): Promise<GroupConversation[]>;
  update(id: string, updateConversationDto: UpdateGroupConversationDto): Promise<GroupConversation | null>;
  delete(id: string): Promise<boolean>;
  addParticipant(conversationId: string, userId: string, role?: string): Promise<GroupConversation | null>;
  removeParticipant(conversationId: string, userId: string): Promise<GroupConversation | null>;
}