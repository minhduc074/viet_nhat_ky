const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface User {
  id: string
  email: string
  name: string | null
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    entries: number
    insights: number
    aiUsages: number
  }
}

export interface AIUsage {
  id: string
  userId: string | null
  provider: string
  endpoint: string
  promptTokens: number
  responseTokens: number
  totalTokens: number
  success: boolean
  errorMessage: string | null
  responseTimeMs: number
  createdAt: string
  user?: {
    id: string
    email: string
    name: string | null
  }
}

export interface DashboardData {
  overview: {
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
    totalEntries: number
    totalInsights: number
    totalAIUsages: number
  }
  aiUsage: {
    last30Days: {
      totalCalls: number
      successfulCalls: number
      failedCalls: number
      successRate: number
      totalTokens: number
      promptTokens: number
      responseTokens: number
      avgResponseTime: number
      byProvider: Array<{
        provider: string
        calls: number
        totalTokens: number
      }>
    }
    recent: AIUsage[]
  }
  recentUsers: Array<{
    id: string
    email: string
    name: string | null
    createdAt: string
    isActive: boolean
  }>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class AdminService {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    }
  }

  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    const response = await fetch(`${API_URL}/api/admin/dashboard`, {
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch dashboard')
    return response.json()
  }

  // Users
  async getUsers(page = 1, limit = 20, search = ''): Promise<{ users: User[], pagination: any }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.append('search', search)
    
    const response = await fetch(`${API_URL}/api/admin/users?${params}`, {
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  }

  async createUser(data: { email: string; password: string; name?: string; role?: string; isActive?: boolean }): Promise<User> {
    const response = await fetch(`${API_URL}/api/admin/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create user')
    }
    return response.json()
  }

  async updateUser(id: string, data: { name?: string; role?: string; isActive?: boolean; password?: string }): Promise<User> {
    const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update user')
    return response.json()
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete user')
  }

  // AI Usage
  async getAIUsage(params: {
    page?: number
    limit?: number
    userId?: string
    provider?: string
    startDate?: string
    endDate?: string
  } = {}): Promise<{
    usages: AIUsage[]
    pagination: any
    statistics: {
      totalCalls: number
      successfulCalls: number
      failedCalls: number
      successRate: number
      totalTokens: number
      totalPromptTokens: number
      totalResponseTokens: number
      avgResponseTime: number
      byProvider: Array<{ provider: string; calls: number; totalTokens: number }>
    }
  }> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', String(params.page))
    if (params.limit) searchParams.append('limit', String(params.limit))
    if (params.userId) searchParams.append('userId', params.userId)
    if (params.provider) searchParams.append('provider', params.provider)
    if (params.startDate) searchParams.append('startDate', params.startDate)
    if (params.endDate) searchParams.append('endDate', params.endDate)

    const response = await fetch(`${API_URL}/api/admin/ai-usage?${searchParams}`, {
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch AI usage')
    return response.json()
  }
}

export const adminService = new AdminService()
