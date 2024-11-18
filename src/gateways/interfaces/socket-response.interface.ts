export interface ErrorResponse {
  message: string;
  code?: string;
}

export interface SuccessResponse {
  status: string;
  data?: any;
}
