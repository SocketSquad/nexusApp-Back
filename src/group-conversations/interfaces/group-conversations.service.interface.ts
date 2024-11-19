import { CreateGroupConversationDto } from '../dtos/create-group-conversations.dto';
import { UpdateGroupConversationDto } from '../dtos/update-group-conversations.dto';
import { GroupConversation } from '../schemas/group-conversations.schema';

export interface IGroupConversationsService {
  create(createConversationDto: CreateGroupConversationDto, creatorId: string): Promise<GroupConversation>;

  findById(id: string, userId: string): Promise<GroupConversation>;

  findByUser(userId: string): Promise<GroupConversation[]>;

  update(id: string, updateConversationDto: UpdateGroupConversationDto, userId: string): Promise<GroupConversation>;

  delete(id: string, userId: string): Promise<void>;

  addParticipant(conversationId: string, participantId: string, addedById: string): Promise<GroupConversation>;

  removeParticipant(conversationId: string, participantId: string, removedById: string): Promise<GroupConversation>;
}
