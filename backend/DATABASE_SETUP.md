# 📦 Hướng dẫn cài đặt PostgreSQL Database

## Bước 1: Chọn nhà cung cấp Database (Miễn phí)

### Option A: Neon (Khuyến nghị cho development)
1. Truy cập [https://neon.tech](https://neon.tech)
2. Đăng ký tài khoản miễn phí
3. Tạo project mới
4. Copy connection string từ Dashboard

### Option B: Supabase
1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng ký tài khoản miễn phí
3. Tạo project mới → Settings → Database
4. Copy connection string

### Option C: Vercel Postgres (Khi deploy)
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Storage → Create Database → Postgres
3. Copy connection string

---

## Bước 2: Cập nhật file `.env`

Thay đổi 2 dòng sau trong file `.env`:

```env
# Connection pooling URL (dùng cho app)
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# Direct URL (dùng cho migrations - thường giống DATABASE_URL với Neon)
DIRECT_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

**Ví dụ với Neon:**
```env
DATABASE_URL="postgresql://neondb_owner:abc123@ep-cool-river-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:abc123@ep-cool-river-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

---

## Bước 3: Tạo Tables trong Database

```bash
# Chạy lệnh này để sync schema với database
npm run db:push
```

Hoặc nếu muốn dùng migrations (khuyến nghị cho production):
```bash
npm run db:migrate
```

---

## Bước 4: Kiểm tra Database (Optional)

```bash
# Mở Prisma Studio để xem dữ liệu
npm run db:studio
```

---

## Bước 5: Chạy Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

---

## 🔧 Troubleshooting

### Lỗi "Connection refused"
- Kiểm tra DATABASE_URL đã đúng chưa
- Đảm bảo đã thêm IP của bạn vào whitelist (nếu dùng Supabase)

### Lỗi "SSL required"
- Thêm `?sslmode=require` vào cuối connection string

### Lỗi "Table does not exist"
- Chạy `npm run db:push` để tạo tables

---

## 📝 Schema Database

```
User
├── id (UUID)
├── email (unique)
├── password (hashed)
├── name
├── createdAt
├── updatedAt
└── dailyEntries[]

DailyEntry
├── id (UUID)
├── userId (FK → User)
├── date
├── moodScore (1-5)
├── note
├── tags[]
├── createdAt
└── updatedAt
└── UNIQUE(userId, date) - Mỗi user chỉ 1 entry/ngày
```
