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

  // Campaign endpoints
  async saveCampaign(
    ads: Array<{ image: string; caption: string; title?: string }>,
    projectInfo?: { 
      name: string; 
      url?: string;
      strategyAnalysis?: {
        usp?: string;
        targetAudience?: string;
        currentOffer?: string;
        brandTone?: string;
      };
    }
  ): Promise<ApiResponse<{ savedCount: number; totalAds: number; projectId: string }>> {
    return this.request<{ savedCount: number; totalAds: number; projectId: string }>('/campaign/save', {
      method: 'POST',
      body: JSON.stringify({ 
        ads,
        projectName: projectInfo?.name,
        projectUrl: projectInfo?.url,
        strategyAnalysis: projectInfo?.strategyAnalysis,
      }),
    });
  }

  async getSavedAds(): Promise<ApiResponse<{ ads: Array<{
    id: string;
    title: string;
    content: string;
    image_url: string;
    platform: string;
    status: string;
    created_at: string;
  }> }>> {
    return this.request('/campaign/ads');
  }

  // Project endpoints
  async getProjects(): Promise<ApiResponse<{ projects: Array<{
    id: string;
    name: string;
    description: string | null;
    url: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    ad_count: number;
    thumbnail_url: string | null;
  }> }>> {
    return this.request('/campaign/projects');
  }

  async deleteProject(projectId: string): Promise<ApiResponse<void>> {
    return this.request(`/campaign/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  async getProject(projectId: string): Promise<ApiResponse<{ project: {
    id: string;
    name: string;
    description: string | null;
    url: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    ads: Array<{
      id: string;
      title: string;
      content: string;
      image_url: string;
      platform: string;
      status: string;
      created_at: string;
    }>;
  } }>> {
    return this.request(`/campaign/projects/${projectId}`);
  }

  async deleteAd(adId: string): Promise<ApiResponse<void>> {
    return this.request(`/campaign/ads/${adId}`, {
      method: 'DELETE',
    });
  }

  // Usage & Token endpoints
  async getUsage(): Promise<ApiResponse<{
    plan: string;
    adsRemaining: number;
    adsUsedThisMonth: number;
    monthlyLimit: number;
    billingPeriodStart: string | null;
    billingPeriodEnd: string | null;
  }>> {
    return this.request('/auth/usage');
  }

  async checkTokens(count: number): Promise<ApiResponse<{
    canGenerate: boolean;
    adsRemaining: number;
    monthlyLimit: number;
    requested: number;
    message?: string;
  }>> {
    return this.request('/campaign/check-tokens', {
      method: 'POST',
      body: JSON.stringify({ count }),
    });
  }

  async getPlans(): Promise<ApiResponse<{
    plans: Array<{
      id: string;
      name: string;
      adsPerMonth: number;
      price: number;
    }>;
  }>> {
    return this.request('/auth/plans');
  }
}

export const api = new ApiClient(API_BASE_URL);
export type { ApiResponse, AuthData };
