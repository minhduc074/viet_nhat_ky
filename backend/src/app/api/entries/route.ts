import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, errorResponse, successResponse, getTodayDate, parseDate } from '@/lib/utils';
import { z } from 'zod';

// Validation schema for creating/updating entry
const entrySchema = z.object({
  moodScore: z.number().min(1).max(5, 'Mood score phải từ 1 đến 5'),
  note: z.string().max(500, 'Ghi chú không quá 500 ký tự').optional(),
  tags: z.array(z.string()).optional(),
  date: z.string().optional(), // Optional: defaults to today
});

// GET /api/entries - Get all entries for current user (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request);
    if (!payload) {
      return errorResponse('Chưa đăng nhập', 401);
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Format: YYYY-MM
    const year = searchParams.get('year'); // Format: YYYY
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const whereClause: {
      userId: string;
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      userId: payload.userId,
    };

    // Filter by month if provided
    if (month) {
      const [y, m] = month.split('-').map(Number);
      const startDate = new Date(Date.UTC(y, m - 1, 1));
      const endDate = new Date(Date.UTC(y, m, 0)); // Last day of month
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (year) {
      const y = parseInt(year);
      const startDate = new Date(Date.UTC(y, 0, 1));
      const endDate = new Date(Date.UTC(y, 11, 31));
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const entries = await prisma.dailyEntry.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.dailyEntry.count({
      where: whereClause,
    });

    return successResponse({
      entries,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + entries.length < total,
      },
    });
  } catch (error) {
    console.error('Get entries error:', error);
    return errorResponse('Đã xảy ra lỗi khi lấy danh sách', 500);
  }
}

// POST /api/entries - Create or update today's entry
export async function POST(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request);
    if (!payload) {
      return errorResponse('Chưa đăng nhập', 401);
    }

    const body = await request.json();
    
    // Validate input
    const validation = entrySchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { moodScore, note, tags, date: dateString } = validation.data;
    
    // Use provided date or today
    const entryDate = dateString ? parseDate(dateString) : getTodayDate();

    // Upsert: Create if not exists, update if exists
    const entry = await prisma.dailyEntry.upsert({
      where: {
        userId_date: {
          userId: payload.userId,
          date: entryDate,
        },
      },
      update: {
        moodScore,
        note: note || null,
        tags: tags || [],
      },
      create: {
        userId: payload.userId,
        date: entryDate,
        moodScore,
        note: note || null,
        tags: tags || [],
      },
    });

    return successResponse({ entry }, 'Đã lưu cảm xúc của bạn');
  } catch (error: any) {
    console.error('Create entry error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2003') {
      return errorResponse('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại', 401);
    }
    
    return errorResponse('Đã xảy ra lỗi khi lưu', 500);
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
