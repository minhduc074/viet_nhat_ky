'use client'

import { useAuth } from '../../context/AuthContext'
import { LogOut, User, Moon, Sun } from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuth()

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Profile */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tài khoản</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 text-2xl font-bold">
              {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {user?.name || 'Người dùng'}
            </p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 p-6 pb-0">Cài đặt</h3>
        
        <div className="divide-y divide-gray-100">
          <SettingItem
            icon={<User className="w-5 h-5" />}
            title="Chỉnh sửa hồ sơ"
            subtitle="Cập nhật tên và thông tin cá nhân"
            onClick={() => {}}
          />
          <SettingItem
            icon={<Moon className="w-5 h-5" />}
            title="Giao diện"
            subtitle="Sáng / Tối"
            onClick={() => {}}
            disabled
          />
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Về ứng dụng</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <span className="font-medium">Viết Nhật Ký</span> - Ứng dụng ghi chép cảm xúc hàng ngày
          </p>
          <p>Phiên bản: 1.0.0 (Web)</p>
          <p>
            Ghi lại cảm xúc của bạn mỗi ngày để hiểu rõ hơn về sức khỏe tinh thần và nhận được
            những lời khuyên từ AI.
          </p>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition"
      >
        <LogOut className="w-5 h-5" />
        Đăng xuất
      </button>
    </div>
  )
}

function SettingItem({
  icon,
  title,
  subtitle,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition text-left ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </button>
  )
}
