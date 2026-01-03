'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useEntry } from '../../context/EntryContext'
import { MOODS, getMood } from '../../lib/config'
import {
  ChevronLeft,
  ChevronRight,
  Brain,
  Loader2,
  Calendar,
  Smile,
  Flame,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { format, subMonths, addMonths, isSameMonth } from 'date-fns'
import { vi } from 'date-fns/locale'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface MonthlyInsight {
  id: string
  month: string
  insight: string
  totalEntries: number
  avgMood: number
}

export default function StatsPage() {
  const { token } = useAuth()
  const { stats, loadStats, isLoading } = useEntry()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [insight, setInsight] = useState<MonthlyInsight | null>(null)
  const [insightLoading, setInsightLoading] = useState(false)

  useEffect(() => {
    const monthStr = format(currentMonth, 'yyyy-MM')
    loadStats(monthStr)
    setInsight(null) // Reset insight when month changes
  }, [currentMonth, loadStats])

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const canGoNext = !isSameMonth(currentMonth, new Date())

  const loadInsight = async () => {
    if (!token) return
    setInsightLoading(true)

    try {
      const monthStr = format(currentMonth, 'yyyy-MM')
      const response = await fetch(`${API_URL}/api/insights?month=${monthStr}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (data.success && data.data) {
        setInsight(data.data)
      }
    } catch (error) {
      console.error('Failed to load insight:', error)
    } finally {
      setInsightLoading(false)
    }
  }

  // Prepare pie chart data
  const pieData = stats?.moodDistribution
    ?.filter((d) => d.count > 0)
    .map((d) => ({
      name: d.label,
      value: d.count,
      color: getMood(d.score).color,
    })) || []

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Month Selector */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy', { locale: vi })}
          </h2>
          <button
            onClick={nextMonth}
            disabled={!canGoNext}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<Calendar className="w-5 h-5" />}
              iconColor="text-primary-500"
              iconBg="bg-primary-100"
              value={stats?.totalEntries || 0}
              label="Số ngày ghi"
            />
            <StatCard
              icon={<Smile className="w-5 h-5" />}
              iconColor="text-green-500"
              iconBg="bg-green-100"
              value={stats?.averageMood?.toFixed(1) || '-'}
              label="Điểm TB"
            />
            <StatCard
              icon={<Flame className="w-5 h-5" />}
              iconColor="text-orange-500"
              iconBg="bg-orange-100"
              value={stats?.currentStreak || 0}
              label="Chuỗi ngày"
            />
          </div>

          {/* Mood Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân bố cảm xúc
            </h3>

            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {stats?.moodDistribution?.map((d) => {
                    const mood = getMood(d.score)
                    return (
                      <div key={d.score} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: mood.color }}
                        />
                        <span className="text-sm text-gray-600">
                          {mood.emoji} {d.label} ({d.count})
                        </span>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Smile className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có dữ liệu</p>
              </div>
            )}
          </div>

          {/* Top Tags */}
          {stats?.topTags && stats.topTags.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tags phổ biến
              </h3>
              <div className="space-y-3">
                {stats.topTags.map((tagData) => {
                  const maxCount = stats.topTags[0].count
                  const percentage = maxCount > 0 ? (tagData.count / maxCount) * 100 : 0

                  return (
                    <div key={tagData.tag}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">
                          #{tagData.tag}
                        </span>
                        <span className="text-gray-500">{tagData.count} lần</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Phân tích từ AI
              </h3>
            </div>

            {insightLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : insight ? (
              <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {insight.insight}
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">
                  Nhấn nút bên dưới để tạo phân tích AI cho tháng này
                </p>
                <button
                  onClick={loadInsight}
                  disabled={!stats || stats.totalEntries === 0}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain className="w-5 h-5" />
                  Xem phân tích
                </button>
                {stats && stats.totalEntries === 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    Cần có ít nhất 1 entry để phân tích
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({
  icon,
  iconColor,
  iconBg,
  value,
  label,
}: {
  icon: React.ReactNode
  iconColor: string
  iconBg: string
  value: string | number
  label: string
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
