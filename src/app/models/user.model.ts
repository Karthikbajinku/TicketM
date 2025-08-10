export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'AGENT' | 'ADMIN';
  createdAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'USER' | 'AGENT';
}

export interface LoginResponse {
  token: string;
  user: User;
}
