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
  role: 'user' | 'admin';
}

// Attendance types
export interface AttendanceScanRequest {
  qrCode: string;
}

export interface AttendanceScanResponse {
  added: boolean;
  message: string;
  flowers: number;
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

// Session types
export interface Session {
  id: string;
  sessionId: string;
  name: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateSessionRequest {
  name: string;
  startsAt: string;
  endsAt: string;
}

export interface CreateSessionResponse extends Session {
  qrCode: string;
}

export interface SessionQRResponse {
  sessionId: string;
  name: string;
  qrCode: string;
}

export interface DeactivateSessionResponse {
  message: string;
  sessionId: string;
}

// Bulk user creation types
export interface BulkUserInput {
  name: string;
  email: string;
  pin: string;
  role: 'user' | 'admin';
}

export interface BulkUsersRequest {
  users: BulkUserInput[];
}

export interface BulkUsersResponse {
  created: Array<{ email: string; name: string }>;
  updated: Array<{ email: string; name: string }>;
  errors: Array<{ email: string; name: string; error: string }>;
  total: number;
}

// CSV import types
export interface CSVImportError {
  email: string;
  name: string;
  error: string;
}

export interface CSVImportResponse {
  created: Array<{ email: string; name: string }>;
  updated: Array<{ email: string; name: string }>;
  errors: CSVImportError[];
  total: number;
}
