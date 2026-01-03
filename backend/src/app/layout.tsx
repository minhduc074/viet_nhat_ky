import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Viết Nhật Ký - API',
  description: 'Backend API cho ứng dụng Micro-journaling theo dõi cảm xúc hàng ngày',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
