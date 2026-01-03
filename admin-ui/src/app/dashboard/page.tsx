'use client'

import { useEffect, useState } from 'react'
import { adminService, DashboardData } from '../services/admin.service'
import {
  Users,
  UserCheck,
  UserX,
  FileText,
  Bot,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b']

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setIsLoading(true)
      const dashboardData = await adminService.getDashboard()
      setData(dashboardData)
    } catch (err) {
      setError('Không thể tải dữ liệu dashboard')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={loadDashboard}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Thử lại
        </button>
      </div>
    )
  }

  const { overview, aiUsage, recentUsers } = data

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng người dùng"
          value={overview.totalUsers}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Người dùng hoạt động"
          value={overview.activeUsers}
          icon={<UserCheck className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Tổng entries"
          value={overview.totalEntries}
          icon={<FileText className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Tổng AI calls"
          value={overview.totalAIUsages}
          icon={<Bot className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* AI Usage Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Stats Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AI Usage (30 ngày qua)
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Activity className="w-4 h-4" />
                <span>Tổng calls</span>
              </div>
              <span className="font-semibold">{aiUsage.last30Days.totalCalls}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Thành công</span>
              </div>
              <span className="font-semibold text-green-600">
                {aiUsage.last30Days.successfulCalls}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-4 h-4" />
                <span>Lỗi</span>
              </div>
              <span className="font-semibold text-red-600">
                {aiUsage.last30Days.failedCalls}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>Tỷ lệ thành công</span>
              </div>
              <span className="font-semibold">
                {aiUsage.last30Days.successRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>TB response time</span>
              </div>
              <span className="font-semibold">
                {Math.round(aiUsage.last30Days.avgResponseTime)}ms
              </span>
            </div>
          </div>
        </div>

        {/* Token Usage Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Token Usage
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">
                {aiUsage.last30Days.totalTokens.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Tổng tokens</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-xl font-semibold text-blue-700">
                  {aiUsage.last30Days.promptTokens.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600">Prompt tokens</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-xl font-semibold text-purple-700">
                  {aiUsage.last30Days.responseTokens.toLocaleString()}
                </p>
                <p className="text-xs text-purple-600">Response tokens</p>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Theo Provider
          </h3>
          {aiUsage.last30Days.byProvider.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={aiUsage.last30Days.byProvider}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="calls"
                  nameKey="provider"
                  label={({ provider }) => provider}
                >
                  {aiUsage.last30Days.byProvider.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              Chưa có dữ liệu
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Người dùng mới
          </h3>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.name || 'Chưa đặt tên'}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI Usages */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AI calls gần đây
          </h3>
          <div className="space-y-3">
            {aiUsage.recent.slice(0, 5).map((usage) => (
              <div
                key={usage.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      usage.provider === 'chatgpt'
                        ? 'bg-emerald-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    <Bot
                      className={`w-5 h-5 ${
                        usage.provider === 'chatgpt'
                          ? 'text-emerald-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {usage.provider}
                    </p>
                    <p className="text-sm text-gray-500">
                      {usage.user?.email || 'System'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      usage.success
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {usage.success ? 'OK' : 'Failed'}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {usage.totalTokens} tokens
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange'
}

function StatCard({ title, value, icon, color }: StatCardProps) {
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
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  )
}
