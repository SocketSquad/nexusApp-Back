export interface CreateMessageDto {
  content: string;
  groupId: string;
}

export interface MessageResponse {
  id: string;
  content: string;
  groupId: string;
  userId: string;
  createdAt: Date;
}
