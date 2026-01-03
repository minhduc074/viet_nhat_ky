'use client'

import { useEffect, useState } from 'react'
import { useEntry, DailyEntry } from '../../context/EntryContext'
import { MOODS, getMood, DEFAULT_TAGS } from '../../lib/config'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  X,
  Check,
  Loader2,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isFuture,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns'
import { vi } from 'date-fns/locale'

export default function CalendarPage() {
  const { calendarEntries, loadEntries, createOrUpdateEntry } = useEntry()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [showMoodModal, setShowMoodModal] = useState(false)

  useEffect(() => {
    const monthStr = format(currentMonth, 'yyyy-MM')
    loadEntries(monthStr)
  }, [currentMonth, loadEntries])

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  // Get starting day of week (0 = Sunday, 1 = Monday, etc.)
  const startingDayOfWeek = getDay(startOfMonth(currentMonth))

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const canGoNext = !isSameMonth(currentMonth, new Date())

  const getEntryForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return calendarEntries.get(dateKey)
  }

  const selectedEntry = selectedDate ? getEntryForDate(selectedDate) : null

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
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

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before start of month */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days */}
          {days.map((day) => {
            const entry = getEntryForDate(day)
            const mood = entry ? getMood(entry.moodScore) : null
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const today = isToday(day)
            const future = isFuture(day)

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                disabled={future}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition ${
                  isSelected
                    ? 'bg-primary-100 ring-2 ring-primary-500'
                    : today
                    ? 'bg-primary-50'
                    : 'hover:bg-gray-100'
                } ${future ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`text-sm ${
                    today ? 'font-bold text-primary-700' : 'text-gray-700'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {entry && (
                  <div
                    className="w-2 h-2 rounded-full mt-1"
                    style={{ backgroundColor: mood?.color }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t">
          {MOODS.map((mood) => (
            <div key={mood.score} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: mood.color }}
              />
              <span className="text-xs text-gray-500">{mood.emoji}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Day Content */}
      <SelectedDayContent
        date={selectedDate}
        entry={selectedEntry}
        onCreateEntry={() => setShowMoodModal(true)}
        onEditEntry={() => setShowMoodModal(true)}
      />

      {/* Mood Modal */}
      {showMoodModal && selectedDate && (
        <MoodEntryModal
          date={selectedDate}
          existingEntry={selectedEntry}
          onClose={() => setShowMoodModal(false)}
          onSave={async (data) => {
            const success = await createOrUpdateEntry({
              ...data,
              date: format(selectedDate, 'yyyy-MM-dd'),
            })
            if (success) {
              setShowMoodModal(false)
              loadEntries(format(currentMonth, 'yyyy-MM'))
            }
          }}
        />
      )}
    </div>
  )
}

function SelectedDayContent({
  date,
  entry,
  onCreateEntry,
  onEditEntry,
}: {
  date: Date | null
  entry: DailyEntry | null | undefined
  onCreateEntry: () => void
  onEditEntry: () => void
}) {
  if (!date) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
        Chọn một ngày để xem chi tiết
      </div>
    )
  }

  if (isFuture(date)) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⏳</span>
        </div>
        <p className="text-gray-500">Ngày này chưa đến</p>
      </div>
    )
  }

  if (entry) {
    const mood = getMood(entry.moodScore)
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {format(date, 'EEEE, dd MMMM yyyy', { locale: vi })}
          </p>
          {isToday(date) && (
            <button
              onClick={onEditEntry}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Edit3 className="w-4 h-4" />
              Chỉnh sửa
            </button>
          )}
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
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">😐</span>
      </div>
      <p className="text-gray-600 mb-4">Không có ghi chép cho ngày này</p>
      <button
        onClick={onCreateEntry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition"
      >
        <Plus className="w-4 h-4" />
        {isToday(date) ? 'Ghi nhận ngay' : 'Tạo entry'}
      </button>
    </div>
  )
}

function MoodEntryModal({
  date,
  existingEntry,
  onClose,
  onSave,
}: {
  date: Date
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
          <div>
            <h3 className="text-lg font-semibold">
              {existingEntry ? 'Chỉnh sửa' : 'Ghi nhận cảm xúc'}
            </h3>
            <p className="text-sm text-gray-500">
              {format(date, 'EEEE, dd MMMM yyyy', { locale: vi })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Bạn cảm thấy thế nào?
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
