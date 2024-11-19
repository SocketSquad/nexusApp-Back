export interface GroupUserRequest {
  groupId: string;
}

export interface GroupUsersResponse {
  onlineUsers: string[];
  offlineUsers: string[];
}

export interface JoinGroupDto {
  groupId: string;
}
