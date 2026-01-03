# Viết Nhật Ký - Admin UI

Admin dashboard để quản lý người dùng và theo dõi AI usage của ứng dụng Viết Nhật Ký.

## Tính năng

- **Dashboard**: Tổng quan về người dùng, entries, và AI usage
- **Quản lý người dùng**: Xem, tạo, sửa, xóa người dùng
- **AI Usage**: Theo dõi chi tiết các lượt gọi AI API

## Cài đặt

```bash
cd admin-ui
npm install
```

## Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3001](http://localhost:3001) trong trình duyệt.

## Production URL

🚀 **Admin Dashboard**: [https://viet-nhat-ky-cbz2.vercel.app/](https://viet-nhat-ky-cbz2.vercel.app/)

## Biến môi trường

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://viet-nhat-ky.vercel.app
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (biểu đồ)
- Lucide React (icons)

## Cấu trúc thư mục

```
src/
├── app/
│   ├── context/        # Auth context
│   ├── dashboard/      # Dashboard pages
│   │   ├── page.tsx    # Dashboard overview
│   │   ├── users/      # User management
│   │   └── ai-usage/   # AI usage tracking
│   ├── login/          # Login page
│   └── services/       # API service
└── ...
```

## Đăng nhập

Sử dụng tài khoản admin đã tạo từ backend:

```bash
cd ../backend
npm run create-admin
```

Sau đó đăng nhập với email và mật khẩu admin.

