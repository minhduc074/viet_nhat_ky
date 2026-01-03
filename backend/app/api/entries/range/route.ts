import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, errorResponse, successResponse } from '@/lib/apiUtils';

export async function GET(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) return errorResponse('Unauthorized', 401);
    
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (!startDate || !endDate) {
      return errorResponse('startDate và endDate là bắt buộc');
    }
    
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      orderBy: { date: 'desc' }
    });
    
    return successResponse({ entries });
  } catch (error) {
    console.error('Get entries by range error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}
