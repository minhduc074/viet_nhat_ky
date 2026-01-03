# 🌟 Viết Nhật Ký - Micro-journaling App

Ứng dụng ghi lại cảm xúc mỗi ngày, giúp theo dõi sức khỏe tinh thần một cách đơn giản và nhanh gọn.

## 📁 Cấu trúc dự án

```
viet_nhat_ky/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config/      # Cấu hình
│   │   ├── controllers/ # Xử lý logic
│   │   ├── middleware/  # Middleware (auth, error)
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── validators/  # Validation rules
│   │   └── server.js    # Entry point
│   ├── .env            # Environment variables
│   └── package.json
│
└── mobile/           # Flutter App
    ├── lib/
    │   ├── config/      # Theme & App config
    │   ├── models/      # Data models
    │   ├── providers/   # State management
    │   ├── screens/     # UI screens
    │   ├── services/    # API services
    │   ├── widgets/     # Reusable widgets
    │   └── main.dart    # Entry point
    └── pubspec.yaml
```

## 🚀 Hướng dẫn chạy

### Prerequisites

- Node.js v18+
- MongoDB (local hoặc MongoDB Atlas)
- Flutter SDK 3.0+
- Android Studio / Xcode

### Backend

1. **Cài đặt dependencies:**
```bash
cd backend
npm install
```

2. **Cấu hình environment:**
```bash
# Sửa file .env với MongoDB URI của bạn
MONGODB_URI=mongodb://localhost:27017/viet_nhat_ky
JWT_SECRET=your_secret_key_here
```

3. **Chạy server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại `http://localhost:3000`

### Mobile (Flutter)

1. **Cài đặt dependencies:**
```bash
cd mobile
flutter pub get
```

2. **Cấu hình API URL:**
Sửa file `lib/config/app_config.dart`:
```dart
// Android Emulator
static const String baseUrl = 'http://10.0.2.2:3000';

// iOS Simulator  
static const String baseUrl = 'http://localhost:3000';

// Device thật (thay bằng IP máy bạn)
static const String baseUrl = 'http://192.168.x.x:3000';
```

3. **Chạy app:**
```bash
flutter run
```

## 📱 Tính năng

### ✅ Đã hoàn thành (MVP)

- [x] **Authentication**
  - Đăng ký / Đăng nhập
  - JWT Token
  - Auto-login

- [x] **Check-in cảm xúc**
  - 5 mức cảm xúc (😢 😔 😐 😊 😄)
  - Ghi chú (optional)
  - Tags phân loại
  - Logic 1 lần/ngày (có thể sửa)

- [x] **Lịch sử**
  - Calendar view
  - Màu theo cảm xúc
  - Xem chi tiết entry

- [x] **Thống kê**
  - Biểu đồ tuần
  - Biểu đồ phân bố cảm xúc
  - Streak tracking
  - Top tags

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/me` | Lấy thông tin user |

### Entries
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/entries` | Tạo/Cập nhật entry hôm nay |
| GET | `/api/entries/today` | Lấy entry hôm nay |
| GET | `/api/entries?year=&month=` | Lấy entries theo tháng |
| DELETE | `/api/entries/:id` | Xóa entry (chỉ hôm nay) |

### Stats
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/stats/monthly` | Thống kê tháng |
| GET | `/api/stats/weekly` | Thống kê tuần |
| GET | `/api/stats/streak` | Lấy streak |
| GET | `/api/stats/overview` | Tổng quan |

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken)
- **Validation:** express-validator

### Frontend (Mobile)
- **Framework:** Flutter
- **State Management:** Provider
- **HTTP Client:** http package
- **Charts:** fl_chart
- **Calendar:** table_calendar
- **Local Storage:** shared_preferences

## 📝 License

MIT License
