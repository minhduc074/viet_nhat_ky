'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string | null
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem('vnk_token')
    const savedUser = localStorage.getItem('vnk_user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        const { user: userData, token: authToken } = data.data
        setUser(userData)
        setToken(authToken)
        localStorage.setItem('vnk_token', authToken)
        localStorage.setItem('vnk_user', JSON.stringify(userData))
        return { success: true }
      }
      return { success: false, error: data.error || 'Đăng nhập thất bại' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Đã xảy ra lỗi khi đăng nhập' }
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        const { user: userData, token: authToken } = data.data
        setUser(userData)
        setToken(authToken)
        localStorage.setItem('vnk_token', authToken)
        localStorage.setItem('vnk_user', JSON.stringify(userData))
        return { success: true }
      }
      return { success: false, error: data.error || 'Đăng ký thất bại' }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Đã xảy ra lỗi khi đăng ký' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('vnk_token')
    localStorage.removeItem('vnk_user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
