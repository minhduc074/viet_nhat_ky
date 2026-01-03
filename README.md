# Viết Nhật Ký - Micro-journaling App

Ứng dụng ghi lại cảm xúc hàng ngày với giao diện đơn giản, giúp người dùng theo dõi sức khỏe tinh thần.

## 🌟 Tính năng

- ✅ Đăng nhập/Đăng ký với JWT authentication
- ✅ Check-in cảm xúc hàng ngày (5 mức độ)
- ✅ Ghi chú ngắn kèm theo cảm xúc
- ✅ Tags để phân loại (Công việc, Gia đình, Thể thao...)
- ✅ Lịch sử với Calendar view
- ✅ Thống kê biểu đồ cảm xúc theo tháng
- ✅ Logic: Mỗi ngày chỉ ghi 1 lần (có thể sửa)

## 📂 Cấu trúc Project

```
viet_nhat_ky/
├── backend/                 # Next.js API Server
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── src/
│   │   ├── app/
│   │   │   └── api/        # API Routes
│   │   │       ├── auth/
│   │   │       │   ├── login/
│   │   │       │   ├── register/
│   │   │       │   └── me/
│   │   │       ├── entries/
│   │   │       │   ├── route.ts
│   │   │       │   └── today/
│   │   │       └── stats/
│   │   └── lib/
│   │       ├── prisma.ts
│   │       ├── auth.ts
│   │       └── utils.ts
│   ├── package.json
│   └── .env
│
├── admin-ui/                # Admin Dashboard (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── context/    # Auth context
│   │   │   ├── dashboard/  # Dashboard pages
│   │   │   ├── login/      # Login page
│   │   │   └── services/   # API service
│   ├── package.json
│   └── .env.local
│
├── user-ui/                 # User Web App (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── context/    # Auth & Entry contexts
│   │   │   ├── app/        # Protected app pages
│   │   │   ├── login/      # Login page
│   │   │   └── register/   # Register page
│   ├── package.json
│   └── .env.local
│
└── mobile/                  # Flutter App
    └── lib/
        ├── config/
        │   ├── app_config.dart
        │   └── theme.dart
        ├── models/
        │   ├── user.dart
        │   ├── daily_entry.dart
        │   └── mood_stats.dart
        ├── services/
        │   ├── api_service.dart
        │   ├── auth_service.dart
        │   └── entry_service.dart
        ├── providers/
        │   ├── auth_provider.dart
        │   └── entry_provider.dart
        ├── widgets/
        │   ├── mood_selector.dart
        │   ├── tag_selector.dart
        │   ├── entry_card.dart
        │   └── common_widgets.dart
        ├── screens/
        │   ├── splash_screen.dart
        │   ├── auth/
        │   │   ├── login_screen.dart
        │   │   └── register_screen.dart
        │   ├── main/
        │   │   ├── main_screen.dart
        │   │   ├── home_tab.dart
        │   │   ├── calendar_tab.dart
        │   │   └── stats_tab.dart
        │   └── entry/
        │       └── create_entry_screen.dart
        └── main.dart
```

## 🚀 Hướng dẫn chạy

### Backend (Next.js)

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

Server sẽ chạy tại: http://localhost:3000

### Admin UI (Next.js)

```bash
cd admin-ui
npm install
npm run dev
```

- Development: http://localhost:3001
- 🚀 Production: https://viet-nhat-ky-cbz2.vercel.app/

### User UI (Next.js)

```bash
cd user-ui
npm install
npm run dev
```

- Development: http://localhost:3002
- 🚀 Production: https://viet-nhat-ky-sw6o.vercel.app/

### Mobile (Flutter)

```bash
cd mobile

# Get dependencies
flutter pub get

# Run on device/emulator
flutter run
```

**Lưu ý**: Đổi `baseUrl` trong `lib/config/app_config.dart`:
- Android Emulator: `http://10.0.2.2:3000/api`
- iOS Simulator: `http://localhost:3000/api`
- Physical device: `http://<your-ip>:3000/api`

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/register | Đăng ký tài khoản |
| POST | /api/auth/login | Đăng nhập |
| GET | /api/auth/me | Lấy thông tin user |
| GET | /api/entries/today | Lấy entry hôm nay |
| GET | /api/entries | Lấy danh sách entries |
| POST | /api/entries | Tạo/cập nhật entry |
| GET | /api/stats | Lấy thống kê |

## 🎨 Mood Levels

| Score | Emoji | Label | Color |
|-------|-------|-------|-------|
| 1 | 😢 | Tệ | Red |
| 2 | 😔 | Không tốt | Orange |
| 3 | 😐 | Bình thường | Yellow |
| 4 | 😊 | Tốt | Green |
| 5 | 🤩 | Tuyệt vời | Blue |

## 🛠 Tech Stack

**Backend:**
- Next.js 14 (App Router)
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation

**Mobile:**
- Flutter 3.x
- Provider (State Management)
- table_calendar
- fl_chart
- http package

## 📝 Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
DATABASE_URL="your_postgres_url"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="7d"
```

## 🔮 Future Improvements

- [ ] Push notifications nhắc nhở ghi nhật ký
- [ ] Export dữ liệu ra PDF/CSV
- [ ] Dark mode
- [ ] Widget cho home screen
- [ ] Reminder settings
- [ ] Cloud backup

---

Made with ❤️ using Flutter & Next.js
