import type {
  LoginRequest,
  LoginResponse,
  AttendanceScanRequest,
  AttendanceScanResponse,
  LeaderboardResponse,
  User,
  ApiResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  Session,
  SessionQRResponse,
  DeactivateSessionResponse,
  BulkUsersRequest,
  BulkUsersResponse,
  CSVImportResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'Error en la solicitud',
        }));
        // Incluir código de estado en el error para manejar 401 específicamente
        throw new Error(`${response.status}: ${error.message || `Error ${response.status}`}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión');
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<ApiResponse<LoginResponse>>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    return response.data;
  }

  // Attendance endpoints
  async scanAttendance(
    data: AttendanceScanRequest
  ): Promise<AttendanceScanResponse> {
    const response = await this.request<ApiResponse<AttendanceScanResponse>>(
      '/attendance/scan',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  }

  // Leaderboard endpoints
  async getLeaderboard(): Promise<LeaderboardResponse> {
    const response = await this.request<ApiResponse<LeaderboardResponse>>(
      '/leaderboard',
      {
        method: 'GET',
      }
    );
    return response.data;
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    const response = await this.request<ApiResponse<User>>('/me', {
      method: 'GET',
    });
    return response.data;
  }

  // Admin Session endpoints
  async createSession(
    data: CreateSessionRequest
  ): Promise<CreateSessionResponse> {
    const response = await this.request<ApiResponse<CreateSessionResponse>>(
      '/admin/sessions',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  }

  async getSessions(): Promise<Session[]> {
    const response = await this.request<ApiResponse<Session[]>>(
      '/admin/sessions',
      {
        method: 'GET',
      }
    );
    return response.data;
  }

  async getSessionQR(sessionId: string): Promise<SessionQRResponse> {
    const response = await this.request<ApiResponse<SessionQRResponse>>(
      `/admin/sessions/${sessionId}/qr`,
      {
        method: 'GET',
      }
    );
    return response.data;
  }

  async deactivateSession(
    sessionId: string
  ): Promise<DeactivateSessionResponse> {
    const response = await this.request<ApiResponse<DeactivateSessionResponse>>(
      `/admin/sessions/${sessionId}/deactivate`,
      {
        method: 'PUT',
      }
    );
    return response.data;
  }

  // User management endpoints
  async createBulkUsers(
    request: BulkUsersRequest
  ): Promise<BulkUsersResponse> {
    const response = await this.request<ApiResponse<BulkUsersResponse>>(
      '/admin/users/bulk',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
    return response.data;
  }

  async uploadUsersCSV(file: File): Promise<CSVImportResponse> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/admin/users/csv`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || `Error ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
