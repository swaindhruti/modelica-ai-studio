export interface User {
  id: number;
  username: string;
  email: string;
  tier: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Generation {
  id: number;
  userId: number;
  prompt: string;
  style?: string | null;
  status: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSignupRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, "passwordHash">;
}

export interface CreateGenerationRequest {
  prompt: string;
  style?: string;
}

export interface GenerationResponse {
  generation: Generation;
}
