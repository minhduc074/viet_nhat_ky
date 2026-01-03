import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, errorResponse, successResponse, getRequestBody } from '@/lib/apiUtils';

// GET /api/entries - Get entries by month
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
    
    // Calculate date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'desc' }
    });
    
    return successResponse({ entries });
  } catch (error) {
    console.error('Get entries error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}

// POST /api/entries - Create or update entry
export async function POST(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) return errorResponse('Unauthorized', 401);
    
    const body = await getRequestBody(request);
    if (!body || !body.content || !body.moodScore || !body.date) {
      return errorResponse('Content, moodScore và date là bắt buộc');
    }
    
    const { content, moodScore, tags, date } = body;
    
    // Validate moodScore
    if (moodScore < 1 || moodScore > 5) {
      return errorResponse('MoodScore phải từ 1 đến 5');
    }
    
    // Parse date
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);
    
    // Check for existing entry
    const existingEntry = await prisma.dailyEntry.findFirst({
      where: {
        userId,
        date: entryDate
      }
    });
    
    let entry;
    if (existingEntry) {
      // Update existing entry
      entry = await prisma.dailyEntry.update({
        where: { id: existingEntry.id },
        data: {
          content,
          moodScore,
          tags: tags || []
        }
      });
    } else {
      // Create new entry
      entry = await prisma.dailyEntry.create({
        data: {
          userId,
          content,
          moodScore,
          tags: tags || [],
          date: entryDate
        }
      });
    }
    
    return successResponse(
      {
        message: existingEntry ? 'Cập nhật nhật ký thành công' : 'Tạo nhật ký thành công',
        entry
      },
      existingEntry ? 200 : 201
    );
  } catch (error) {
    console.error('Create/Update entry error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}
