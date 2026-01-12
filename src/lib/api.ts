const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

interface AuthData {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<AuthData>> {
    const response = await this.request<AuthData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async signup(email: string, password: string, name?: string): Promise<ApiResponse<AuthData>> {
    const response = await this.request<AuthData>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: AuthData['user'] }>> {
    return this.request<{ user: AuthData['user'] }>('/auth/me');
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  getUser(): AuthData['user'] | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  // Health check
  async checkHealth(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request<{ status: string; message: string }>('/health');
  }
}

export const api = new ApiClient(API_BASE_URL);
export type { ApiResponse, AuthData };
