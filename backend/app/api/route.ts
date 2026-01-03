import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: '🌟 Viết Nhật Ký API - Micro-journaling Backend (Next.js)',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      entries: '/api/entries',
      stats: '/api/stats',
      docs: '/api-docs'
    }
  });
}
