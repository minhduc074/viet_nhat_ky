import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, errorResponse, successResponse } from '@/lib/apiUtils';

export async function GET(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) return errorResponse('Unauthorized', 401);
    
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId,
        date: {
          gte: sevenDaysAgo
        }
      },
      orderBy: { date: 'asc' }
    });
    
    const totalEntries = entries.length;
    const averageMood = totalEntries > 0
      ? entries.reduce((sum, e) => sum + e.moodScore, 0) / totalEntries
      : 0;
    
    return successResponse({
      stats: {
        totalEntries,
        averageMood: parseFloat(averageMood.toFixed(2)),
        entries
      }
    });
  } catch (error) {
    console.error('Get weekly stats error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}
