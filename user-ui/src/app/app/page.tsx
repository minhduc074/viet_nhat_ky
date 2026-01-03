'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useEntry, DailyEntry } from '../context/EntryContext'
import { MOODS, getMood, DEFAULT_TAGS } from '../lib/config'
import {
  Plus,
  Edit3,
  Flame,
  Calendar,
  Smile,
  X,
  Check,
  Loader2,
} from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()
  const { todayEntry, stats, isLoading, loadTodayEntry, loadStats, createOrUpdateEntry } = useEntry()
  const [showMoodModal, setShowMoodModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadTodayEntry()
    loadStats()
  }, [loadTodayEntry, loadStats])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: 'Chào buổi sáng', emoji: '🌅' }
    if (hour < 18) return { text: 'Chào buổi chiều', emoji: '☀️' }
    return { text: 'Chào buổi tối', emoji: '🌙' }
  }

  const formatDate = () => {
    const now = new Date()
    const weekdays = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
    return `${weekdays[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
  }

  const greeting = getGreeting()

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Greeting Card */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-6 text-white shadow-lg shadow-primary-500/30">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{greeting.emoji}</span>
          <div>
            <h1 className="text-xl font-bold">{greeting.text}</h1>
            <p className="text-primary-100">
              {user?.name || 'bạn'}! Chúc bạn một ngày tốt lành!
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">{formatDate()}</span>
        </div>
      </div>

      {/* Today's Entry or Check-in Prompt */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : todayEntry ? (
        <TodayEntryCard entry={todayEntry} onEdit={() => setShowMoodModal(true)} />
      ) : (
        <CheckInPrompt onCheckIn={() => setShowMoodModal(true)} />
      )}

      {/* Quick Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            iconColor="text-orange-500"
            iconBg="bg-orange-100"
            value={stats?.currentStreak || 0}
            label="Chuỗi ngày"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            iconColor="text-primary-500"
            iconBg="bg-primary-100"
            value={stats?.totalEntries || 0}
            label="Tổng entries"
          />
          <StatCard
            icon={<Smile className="w-5 h-5" />}
            iconColor="text-green-500"
            iconBg="bg-green-100"
            value={stats?.averageMood?.toFixed(1) || '-'}
            label="TB cảm xúc"
          />
        </div>
      </div>

      {/* Mood Modal */}
      {showMoodModal && (
        <MoodEntryModal
          existingEntry={todayEntry}
          onClose={() => setShowMoodModal(false)}
          onSave={async (data) => {
            const success = await createOrUpdateEntry(data)
            if (success) {
              setShowMoodModal(false)
              loadTodayEntry()
              loadStats()
            }
          }}
        />
      )}
    </div>
  )
}

function TodayEntryCard({ entry, onEdit }: { entry: DailyEntry; onEdit: () => void }) {
  const mood = getMood(entry.moodScore)

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Cảm xúc hôm nay</h3>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
          >
            <Edit3 className="w-4 h-4" />
            Chỉnh sửa
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: mood.bgColor }}
          >
            {mood.emoji}
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: mood.color }}>
              {mood.label}
            </p>
            {entry.note && (
              <p className="text-gray-600 mt-1 text-sm">{entry.note}</p>
            )}
          </div>
        </div>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CheckInPrompt({ onCheckIn }: { onCheckIn: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">✨</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Hôm nay bạn thế nào?</h3>
      <p className="text-gray-600 mb-6">Hãy dành một phút để ghi lại cảm xúc của bạn</p>
      <button
        onClick={onCheckIn}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-500/30"
      >
        <Plus className="w-5 h-5" />
        Ghi nhận cảm xúc
      </button>
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

function MoodEntryModal({
  existingEntry,
  onClose,
  onSave,
}: {
  existingEntry?: DailyEntry | null
  onClose: () => void
  onSave: (data: { moodScore: number; note?: string; tags?: string[] }) => Promise<void>
}) {
  const [moodScore, setMoodScore] = useState(existingEntry?.moodScore || 3)
  const [note, setNote] = useState(existingEntry?.note || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(existingEntry?.tags || [])
  const [isLoading, setIsLoading] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    await onSave({
      moodScore,
      note: note.trim() || undefined,
      tags: selectedTags,
    })
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50">
      <div className="bg-white w-full lg:max-w-lg lg:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            {existingEntry ? 'Chỉnh sửa cảm xúc' : 'Ghi nhận cảm xúc'}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Hôm nay bạn cảm thấy thế nào?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.score}
                  onClick={() => setMoodScore(mood.score)}
                  className={`flex flex-col items-center p-3 rounded-xl transition ${
                    moodScore === mood.score
                      ? 'ring-2 ring-offset-2'
                      : 'hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: moodScore === mood.score ? mood.bgColor : undefined,
                    ...(moodScore === mood.score && { '--tw-ring-color': mood.color } as any),
                  }}
                >
                  <span className="text-2xl mb-1">{mood.emoji}</span>
                  <span className="text-xs text-gray-600">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bạn muốn ghi lại điều gì..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-400 text-right mt-1">{note.length}/500</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (tùy chọn)
            </label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Lưu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
