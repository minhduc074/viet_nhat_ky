import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, errorResponse, successResponse } from '@/lib/apiUtils';

export async function GET(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) return errorResponse('Unauthorized', 401);
    
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || '');
    const month = parseInt(searchParams.get('month') || '');
    
    if (!year || !month || month < 1 || month > 12) {
      return errorResponse('Year và month (1-12) là bắt buộc');
    }
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    
    // Calculate stats
    const totalEntries = entries.length;
    const averageMood = totalEntries > 0
      ? entries.reduce((sum, e) => sum + e.moodScore, 0) / totalEntries
      : 0;
    
    // Group by mood score
    const moodDistribution = entries.reduce((acc, entry) => {
      acc[entry.moodScore] = (acc[entry.moodScore] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    return successResponse({
      stats: {
        totalEntries,
        averageMood: parseFloat(averageMood.toFixed(2)),
        moodDistribution,
        year,
        month
      }
    });
  } catch (error) {
    console.error('Get monthly stats error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}
