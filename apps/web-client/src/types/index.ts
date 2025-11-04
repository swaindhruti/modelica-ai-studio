// API Error Types
export interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
  code?: string; // For axios error codes like ERR_CANCELED
  name?: string; // For axios error names like CanceledError
}

// Generation Types
export interface Generation {
  id: number;
  userId: number;
  prompt: string;
  style: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface CreateGenerationRequest {
  prompt: string;
  style: string;
  image?: File;
}

export interface CreateGenerationResponse {
  id: number;
  prompt: string;
  style: string;
  imageUrl: string | null;
  createdAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

// Image Types
export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}
