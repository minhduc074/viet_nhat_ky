# Viết Nhật Ký - User UI (Web)

Phiên bản web của ứng dụng ghi chép cảm xúc Viết Nhật Ký, tương tự với mobile app.

## Tính năng

- **Trang chủ**: Greeting, ghi nhận cảm xúc hôm nay, thống kê nhanh
- **Lịch**: Xem lịch cảm xúc theo tháng với mood markers
- **Thống kê**: Biểu đồ phân bố cảm xúc, AI insights, tags phổ biến
- **Cài đặt**: Quản lý tài khoản

## Cài đặt

```bash
cd user-ui
npm install
```

## Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3002](http://localhost:3002) trong trình duyệt.

## Production URL

🚀 **User App**: [https://viet-nhat-ky-sw6o.vercel.app/](https://viet-nhat-ky-sw6o.vercel.app/)

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
- date-fns (xử lý ngày tháng)
- Lucide React (icons)

## Cấu trúc thư mục

```
src/
├── app/
│   ├── context/        # Auth & Entry contexts
│   ├── lib/            # Config và utilities
│   ├── app/            # Protected app pages
│   │   ├── page.tsx    # Home page
│   │   ├── calendar/   # Calendar page
│   │   ├── stats/      # Statistics page
│   │   └── settings/   # Settings page
│   ├── login/          # Login page
│   └── register/       # Register page
└── ...
```

## Mood Scale

| Score | Label | Emoji |
|-------|-------|-------|
| 1 | Tệ | 😢 |
| 2 | Không tốt | 😕 |
| 3 | Bình thường | 😐 |
| 4 | Tốt | 😊 |
| 5 | Tuyệt vời | 😄 |

## Screenshots

- Trang chủ với greeting và check-in
- Lịch cảm xúc với color coding
- Biểu đồ thống kê và AI insights
