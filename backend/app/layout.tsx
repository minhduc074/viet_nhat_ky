import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Viết Nhật Ký API',
  description: 'Micro-journaling Backend API',
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
