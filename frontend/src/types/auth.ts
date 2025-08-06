export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  role: 2 | 1; // 2 for User, 1 for Admin
}

export interface AuthResponse {
  token: string;
  username: string;
  role: number;
}
