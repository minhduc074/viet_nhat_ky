import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/utils';

// GET /api/stats - Get mood statistics for current user
export async function GET(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request);
    if (!payload) {
      return errorResponse('Chưa đăng nhập', 401);
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Format: YYYY-MM
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    // Build date range
    let startDate: Date;
    let endDate: Date;

    if (month) {
      const [y, m] = month.split('-').map(Number);
      startDate = new Date(Date.UTC(y, m - 1, 1));
      endDate = new Date(Date.UTC(y, m, 0));
    } else {
      const y = parseInt(year);
      startDate = new Date(Date.UTC(y, 0, 1));
      endDate = new Date(Date.UTC(y, 11, 31));
    }

    // Get all entries in range
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId: payload.userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        moodScore: true,
        date: true,
        tags: true,
      },
    });

    // Calculate statistics
    const totalEntries = entries.length;
    
    // Mood distribution
    const moodDistribution = {
      1: 0, // Tệ
      2: 0, // Không tốt
      3: 0, // Bình thường
      4: 0, // Tốt
      5: 0, // Tuyệt vời
    };

    let totalMoodScore = 0;
    entries.forEach(entry => {
      moodDistribution[entry.moodScore as keyof typeof moodDistribution]++;
      totalMoodScore += entry.moodScore;
    });

    // Average mood
    const averageMood = totalEntries > 0 
      ? Math.round((totalMoodScore / totalEntries) * 10) / 10 
      : 0;

    // Tag frequency
    const tagFrequency: Record<string, number> = {};
    entries.forEach(entry => {
      entry.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    // Top tags
    const topTags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Current streak (consecutive days)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    let streak = 0;
    const sortedEntries = entries
      .map(e => new Date(e.date).getTime())
      .sort((a, b) => b - a);

    if (sortedEntries.length > 0) {
      let checkDate = today.getTime();
      for (const entryTime of sortedEntries) {
        if (entryTime === checkDate) {
          streak++;
          checkDate -= 24 * 60 * 60 * 1000; // Go back one day
        } else if (entryTime < checkDate) {
          break;
        }
      }
    }

    // Mood labels in Vietnamese
    const moodLabels: Record<number, string> = {
      1: 'Tệ',
      2: 'Không tốt',
      3: 'Bình thường',
      4: 'Tốt',
      5: 'Tuyệt vời',
    };

    return successResponse({
      period: month || year,
      totalEntries,
      averageMood,
      currentStreak: streak,
      moodDistribution: Object.entries(moodDistribution).map(([score, count]) => ({
        score: parseInt(score),
        label: moodLabels[parseInt(score)],
        count,
        percentage: totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0,
      })),
      topTags,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return errorResponse('Đã xảy ra lỗi khi lấy thống kê', 500);
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
