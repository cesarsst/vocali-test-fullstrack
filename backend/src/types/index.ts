export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FileUploadRequest {
  fileName: string;
  fileType: string;
}

export interface FileUploadResponse {
  uploadUrl: string;
  fileKey: string;
}

export interface TranscriptionRequest {
  transcription_name: string;
  file_key: string;
}

export interface TranscriptionResponse {
  PK: string;
  SK: string;
  transcription_name: string;
  file_key: string;
  text?: string;
  createdAt: string;
}

export interface DynamoDBItem {
  PK: string;
  SK: string;
  GSI1PK?: string;
  GSI1SK?: string;
  [key: string]: any;
}
