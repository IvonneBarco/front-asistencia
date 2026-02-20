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

export interface LoginIdentificationRequest {
  identification: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string | null;
  identification: string;
  name: string;
  flores: number;
  flowers: number;
  avatar?: string;
  role: 'user' | 'admin';
  group?: {
    id: string;
    name: string;
  } | null;
}

// Attendance types
export interface AttendanceScanRequest {
  qrCode?: string;
  sessionPin?: string;
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
  sessionPin: string;
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
  identification: string;
  role: 'user' | 'admin';
}

export interface BulkUsersRequest {
  users: BulkUserInput[];
}

export interface BulkUsersResponse {
  created: Array<{ identification: string; name: string }>;
  updated: Array<{ identification: string; name: string }>;
  errors: Array<{ identification: string; name: string; error: string }>;
  total: number;
}

// CSV import types
export interface CSVImportError {
  identification: string;
  name: string;
  error: string;
}

export interface CSVImportResponse {
  created: Array<{ identification: string; name: string }>;
  updated: Array<{ identification: string; name: string }>;
  errors: CSVImportError[];
  total: number;
}

export interface UsersListResponse extends Array<User> {}

// Group types
export interface GroupUser {
  id: string;
  name: string;
  email: string;
  identification: string;
  flowers: number;
  role: string;
}

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  isActive: boolean;
  users?: GroupUser[];
}

export interface GroupsResponse extends Array<Group> {}

export interface MyGroupResponse {
  hasGroup?: boolean;
  group?: {
    id: string;
    name: string;
    isActive: boolean;
  };
  joinedAt?: string;
  message?: string;
}

export interface JoinGroupRequest {
  groupId: string;
}

export interface JoinGroupResponse {
  message: string;
  groupId: string;
  groupName: string;
}

export interface AssignGroupRequest {
  groupId: string;
  reason?: string;
}

export interface AssignGroupResponse {
  message: string;
  user: {
    id: string;
    name: string;
    group: {
      id: string;
      name: string;
    };
  };
}

export interface GroupHistoryEntry {
  id: number;
  groupId: string;
  groupName: string;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface GroupHistoryResponse {
  history: GroupHistoryEntry[];
}

// Admin Group Management types
export interface CreateGroupRequest {
  name: string;
  isActive: boolean;
}

export interface CreateGroupResponse {
  message: string;
  group: Group;
}

export interface AllGroupsResponse extends Array<Group> {}

export interface UpdateGroupRequest {
  name?: string;
  isActive?: boolean;
}

export interface UpdateGroupResponse {
  message: string;
  group: Group;
}

export interface DeleteGroupResponse {
  message: string;
  groupId: string;
}
