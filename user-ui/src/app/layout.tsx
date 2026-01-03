import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { EntryProvider } from './context/EntryContext'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'Viết Nhật Ký',
  description: 'Ghi chép cảm xúc hàng ngày của bạn',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          <EntryProvider>
            {children}
          </EntryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
