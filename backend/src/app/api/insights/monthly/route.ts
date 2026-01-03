import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/utils';
import { generateMonthlyInsights } from '@/lib/ai';

// GET /api/insights/monthly?month=YYYY-MM
export async function GET(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request);
    if (!payload) {
      return errorResponse('Chưa đăng nhập', 401);
    }

    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get('month'); // Format: YYYY-MM

    if (!monthParam) {
      return errorResponse('Thiếu tham số month (định dạng: YYYY-MM)', 400);
    }

    // Validate month format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(monthParam)) {
      return errorResponse('Định dạng month không hợp lệ (cần: YYYY-MM)', 400);
    }

    // Parse month
    const [year, month] = monthParam.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0)); // Last day of month

    // Fetch all entries for the month
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId: payload.userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    if (entries.length === 0) {
      return successResponse({
        insight: 'Bạn chưa có bản ghi nào trong tháng này. Hãy bắt đầu ghi chép cảm xúc để nhận được lời khuyên từ AI nhé! 💙',
        month: monthParam,
        totalEntries: 0,
      });
    }

    // Generate AI insights
    const monthName = `Tháng ${month}/${year}`;
    const insight = await generateMonthlyInsights(entries, monthName);

    // Calculate some basic stats to return
    const avgMood = entries.reduce((sum, e) => sum + e.moodScore, 0) / entries.length;
    const moodCounts = entries.reduce((acc, e) => {
      acc[e.moodScore] = (acc[e.moodScore] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return successResponse({
      insight,
      month: monthParam,
      totalEntries: entries.length,
      stats: {
        avgMood: parseFloat(avgMood.toFixed(2)),
        moodDistribution: moodCounts,
      },
    });
  } catch (error: any) {
    console.error('Generate insights error:', error);
    
    // Check if it's an AI-specific error
    if (error.message && error.message.includes('AI')) {
      return errorResponse(error.message, 503);
    }
    
    return errorResponse('Đã xảy ra lỗi khi tạo báo cáo', 500);
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
