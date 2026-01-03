import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, errorResponse, successResponse, getTodayDate } from '@/lib/utils';

// GET /api/entries/today - Get today's entry for current user
export async function GET(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request);
    if (!payload) {
      return errorResponse('Chưa đăng nhập', 401);
    }

    const today = getTodayDate();

    const entry = await prisma.dailyEntry.findUnique({
      where: {
        userId_date: {
          userId: payload.userId,
          date: today,
        },
      },
    });

    return successResponse({
      entry, // Will be null if no entry today
      hasEntryToday: entry !== null,
    });
  } catch (error) {
    console.error('Get today entry error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
