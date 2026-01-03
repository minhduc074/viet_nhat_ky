export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    entries: number;
    insights: number;
    aiUsages: number;
  };
}

export interface AIUsage {
  id: string;
  userId?: string;
  provider: string;
  endpoint: string;
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
  success: boolean;
  errorMessage?: string;
  responseTimeMs: number;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface DashboardStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalEntries: number;
    totalInsights: number;
    totalAIUsages: number;
  };
  aiUsage: {
    last30Days: {
      totalCalls: number;
      successfulCalls: number;
      failedCalls: number;
      successRate: number;
      totalTokens: number;
      promptTokens: number;
      responseTokens: number;
      avgResponseTime: number;
      byProvider: Array<{
        provider: string;
        calls: number;
        totalTokens: number;
      }>;
    };
    recent: AIUsage[];
  };
  recentUsers: User[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
