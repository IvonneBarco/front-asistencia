// API Response types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Auth types
export interface LoginRequest {
  email: string;
  pin: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  flores: number;
  avatar?: string;
}

// Attendance types
export interface AttendanceScanRequest {
  qrCode: string;
}

export interface AttendanceScanResponse {
  success: boolean;
  message: string;
  flores?: number;
  session?: {
    id: string;
    name: string;
    date: string;
  };
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  flores: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  currentUser?: LeaderboardEntry;
}
