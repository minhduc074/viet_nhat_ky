'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface DailyEntry {
  id: string
  userId: string
  date: string
  moodScore: number
  note: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface MoodStats {
  period: string
  totalEntries: number
  averageMood: number
  currentStreak: number
  moodDistribution: Array<{
    score: number
    label: string
    count: number
    percentage: number
  }>
  topTags: Array<{
    tag: string
    count: number
  }>
}

interface EntryContextType {
  entries: DailyEntry[]
  todayEntry: DailyEntry | null
  stats: MoodStats | null
  calendarEntries: Map<string, DailyEntry>
  isLoading: boolean
  loadTodayEntry: () => Promise<void>
  loadEntries: (month?: string) => Promise<void>
  loadStats: (month?: string) => Promise<void>
  createOrUpdateEntry: (data: { moodScore: number; note?: string; tags?: string[]; date?: string }) => Promise<boolean>
}

const EntryContext = createContext<EntryContextType | undefined>(undefined)

export function EntryProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null)
  const [stats, setStats] = useState<MoodStats | null>(null)
  const [calendarEntries, setCalendarEntries] = useState<Map<string, DailyEntry>>(new Map())
  const [isLoading, setIsLoading] = useState(false)

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token])

  const loadTodayEntry = useCallback(async () => {
    if (!token) return
    
    try {
      setIsLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`${API_URL}/api/entries/today`, {
        headers: getHeaders(),
      })
      const data = await response.json()
      
      if (data.success && data.data?.entry) {
        setTodayEntry(data.data.entry)
      } else {
        setTodayEntry(null)
      }
    } catch (error) {
      console.error('Load today entry error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [token, getHeaders])

  const loadEntries = useCallback(async (month?: string) => {
    if (!token) return

    try {
      setIsLoading(true)
      const params = month ? `?month=${month}` : ''
      const response = await fetch(`${API_URL}/api/entries${params}`, {
        headers: getHeaders(),
      })
      const data = await response.json()

      if (data.success && data.data?.entries) {
        const entriesList = data.data.entries
        setEntries(entriesList)
        
        // Build calendar entries map
        const map = new Map<string, DailyEntry>()
        entriesList.forEach((entry: DailyEntry) => {
          const dateKey = entry.date.split('T')[0]
          map.set(dateKey, entry)
        })
        setCalendarEntries(map)
      }
    } catch (error) {
      console.error('Load entries error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [token, getHeaders])

  const loadStats = useCallback(async (month?: string) => {
    if (!token) return

    try {
      const params = month ? `?month=${month}` : ''
      const response = await fetch(`${API_URL}/api/stats${params}`, {
        headers: getHeaders(),
      })
      const data = await response.json()

      if (data.success && data.data) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Load stats error:', error)
    }
  }, [token, getHeaders])

  const createOrUpdateEntry = useCallback(async (data: { moodScore: number; note?: string; tags?: string[]; date?: string }) => {
    if (!token) return false

    try {
      const response = await fetch(`${API_URL}/api/entries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      })
      const result = await response.json()

      if (result.success && result.data?.entry) {
        const entry = result.data.entry
        const dateKey = entry.date.split('T')[0]
        const today = new Date().toISOString().split('T')[0]
        
        if (dateKey === today) {
          setTodayEntry(entry)
        }
        
        // Update calendar entries
        setCalendarEntries(prev => {
          const newMap = new Map(prev)
          newMap.set(dateKey, entry)
          return newMap
        })
        
        return true
      }
      return false
    } catch (error) {
      console.error('Create entry error:', error)
      return false
    }
  }, [token, getHeaders])

  return (
    <EntryContext.Provider value={{
      entries,
      todayEntry,
      stats,
      calendarEntries,
      isLoading,
      loadTodayEntry,
      loadEntries,
      loadStats,
      createOrUpdateEntry,
    }}>
      {children}
    </EntryContext.Provider>
  )
}

export function useEntry() {
  const context = useContext(EntryContext)
  if (context === undefined) {
    throw new Error('useEntry must be used within an EntryProvider')
  }
  return context
}
