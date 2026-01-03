import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, errorResponse, successResponse } from '@/lib/apiUtils';

export async function GET(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) return errorResponse('Unauthorized', 401);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const entry = await prisma.dailyEntry.findFirst({
      where: {
        userId,
        date: today
      }
    });
    
    return successResponse({ entry });
  } catch (error) {
    console.error('Get today entry error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}
