import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, errorResponse, successResponse } from '@/lib/apiUtils';

export async function GET(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) return errorResponse('Unauthorized', 401);
    
    // Get all entries
    const entries = await prisma.dailyEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
    
    const totalEntries = entries.length;
    const averageMood = totalEntries > 0
      ? entries.reduce((sum, e) => sum + e.moodScore, 0) / totalEntries
      : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    
    if (entries.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const latestEntry = new Date(entries[0].date);
      latestEntry.setHours(0, 0, 0, 0);
      
      if (latestEntry.getTime() === today.getTime() || latestEntry.getTime() === yesterday.getTime()) {
        currentStreak = 1;
        let tempStreak = 1;
        
        for (let i = 1; i < entries.length; i++) {
          const prevDate = new Date(entries[i - 1].date);
          prevDate.setHours(0, 0, 0, 0);
          
          const currDate = new Date(entries[i].date);
          currDate.setHours(0, 0, 0, 0);
          
          const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            currentStreak++;
            tempStreak++;
          } else {
            break;
          }
        }
      }
      
      // Calculate longest streak
      let tempStreak = 1;
      for (let i = 1; i < entries.length; i++) {
        const prevDate = new Date(entries[i - 1].date);
        prevDate.setHours(0, 0, 0, 0);
        
        const currDate = new Date(entries[i].date);
        currDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, currentStreak, 1);
    }
    
    return successResponse({
      stats: {
        totalEntries,
        averageMood: parseFloat(averageMood.toFixed(2)),
        currentStreak,
        longestStreak
      }
    });
  } catch (error) {
    console.error('Get overview error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}
