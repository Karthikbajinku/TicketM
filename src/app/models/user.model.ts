export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'AGENT' | 'ADMIN';
  category?: string;
  flagged?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'AGENT';
  category?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
