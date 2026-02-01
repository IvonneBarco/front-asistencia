import type {
  LoginRequest,
  LoginResponse,
  AttendanceScanRequest,
  AttendanceScanResponse,
  LeaderboardResponse,
  User,
  ApiResponse,
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
        throw new Error(error.message || `Error ${response.status}`);
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
}

export const apiClient = new ApiClient(API_BASE_URL);
