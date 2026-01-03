import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, errorResponse, successResponse } from '@/lib/apiUtils';

export async function GET(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) return errorResponse('Unauthorized', 401);
    
    const entries = await prisma.dailyEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
    
    if (entries.length === 0) {
      return successResponse({
        streak: {
          currentStreak: 0,
          longestStreak: 0
        }
      });
    }
    
    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if there's an entry today or yesterday to start current streak
    const latestEntry = new Date(entries[0].date);
    latestEntry.setHours(0, 0, 0, 0);
    
    if (latestEntry.getTime() === today.getTime() || latestEntry.getTime() === yesterday.getTime()) {
      currentStreak = 1;
      tempStreak = 1;
      
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
    tempStreak = 1;
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
    
    return successResponse({
      streak: {
        currentStreak,
        longestStreak
      }
    });
  } catch (error) {
    console.error('Get streak error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}
