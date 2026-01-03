'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminService, AIUsage } from '../../services/admin.service'
import {
  Bot,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  TrendingUp,
  Zap,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, subDays } from 'date-fns'

export default function AIUsagePage() {
  const [usages, setUsages] = useState<AIUsage[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState({
    provider: '',
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const loadUsages = useCallback(async (page = 1) => {
    try {
      setIsLoading(true)
      const result = await adminService.getAIUsage({
        page,
        limit: 50,
        provider: filters.provider || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      })
      setUsages(result.usages)
      setPagination(result.pagination)
      setStatistics(result.statistics)
    } catch (err) {
      console.error('Failed to load AI usage:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadUsages()
  }, [loadUsages])

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadUsages(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Usage</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <Filter className="w-5 h-5" />
          Bộ lọc
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <select
                value={filters.provider}
                onChange={(e) =>
                  setFilters({ ...filters, provider: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Tất cả</option>
                <option value="chatgpt">ChatGPT</option>
                <option value="gemini">Gemini</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Áp dụng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng API calls"
            value={statistics.totalCalls}
            icon={<Activity className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Thành công"
            value={statistics.successfulCalls}
            subtext={`${statistics.successRate.toFixed(1)}%`}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Tổng tokens"
            value={statistics.totalTokens}
            icon={<Zap className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="TB response time"
            value={`${Math.round(statistics.avgResponseTime)}ms`}
            icon={<Clock className="w-6 h-6" />}
            color="orange"
            isText
          />
        </div>
      )}

      {/* Provider Stats */}
      {statistics && statistics.byProvider.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Theo Provider
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statistics.byProvider.map((provider: any) => (
              <div
                key={provider.provider}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      provider.provider === 'chatgpt'
                        ? 'bg-emerald-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    <Bot
                      className={`w-5 h-5 ${
                        provider.provider === 'chatgpt'
                          ? 'text-emerald-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {provider.provider}
                  </h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Calls:</span>
                    <span className="font-medium">{provider.calls}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Tokens:</span>
                    <span className="font-medium">
                      {provider.totalTokens.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chi tiết calls</h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : usages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Bot className="w-12 h-12 mb-4" />
            <p>Không có dữ liệu</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Tokens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Response
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usages.map((usage) => (
                    <tr key={usage.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(usage.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {usage.user?.name || usage.user?.email || 'System'}
                          </p>
                          {usage.user?.email && usage.user.name && (
                            <p className="text-gray-500 text-xs">
                              {usage.user.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            usage.provider === 'chatgpt'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          <Bot className="w-3 h-3" />
                          {usage.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usage.endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="space-y-0.5">
                          <p className="font-medium text-gray-900">
                            {usage.totalTokens.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {usage.promptTokens} / {usage.responseTokens}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usage.responseTimeMs}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {usage.success ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            OK
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium cursor-help"
                            title={usage.errorMessage || 'Unknown error'}
                          >
                            <XCircle className="w-3 h-3" />
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
                trên {pagination.total} records
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadUsages(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-sm">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => loadUsages(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number | string
  subtext?: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange'
  isText?: boolean
}

function StatCard({ title, value, subtext, icon, color, isText }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {isText ? value : (value as number).toLocaleString()}
          </p>
          {subtext && (
            <p className="text-sm text-gray-500 mt-1">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  )
}
