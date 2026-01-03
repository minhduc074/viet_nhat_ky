import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyAdminToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role?: string };
    if (decoded.role !== 'admin') {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// GET /api/admin/dashboard - Get dashboard overview statistics
export async function GET(request: NextRequest) {
  try {
    const adminId = verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Get various statistics in parallel
    const [
      totalUsers,
      activeUsers,
      totalEntries,
      totalInsights,
      totalAIUsages,
      recentUsers,
      recentAIUsages,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.dailyEntry.count(),
      prisma.monthlyInsight.count(),
      prisma.aIUsage.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          isActive: true,
        },
      }),
      prisma.aIUsage.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      }),
    ]);

    // AI usage stats for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const aiUsageStats = await prisma.aIUsage.aggregate({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: {
        totalTokens: true,
        promptTokens: true,
        responseTokens: true,
      },
      _avg: {
        responseTimeMs: true,
      },
    });

    const successfulCalls = await prisma.aIUsage.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        success: true,
      },
    });

    const failedCalls = await prisma.aIUsage.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        success: false,
      },
    });

    // Get AI usage by provider
    const providerStats = await prisma.aIUsage.groupBy({
      by: ['provider'],
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: {
        totalTokens: true,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalEntries,
        totalInsights,
        totalAIUsages,
      },
      aiUsage: {
        last30Days: {
          totalCalls: successfulCalls + failedCalls,
          successfulCalls,
          failedCalls,
          successRate: successfulCalls + failedCalls > 0 
            ? (successfulCalls / (successfulCalls + failedCalls)) * 100 
            : 0,
          totalTokens: aiUsageStats._sum.totalTokens || 0,
          promptTokens: aiUsageStats._sum.promptTokens || 0,
          responseTokens: aiUsageStats._sum.responseTokens || 0,
          avgResponseTime: aiUsageStats._avg.responseTimeMs || 0,
          byProvider: providerStats.map((p) => ({
            provider: p.provider,
            calls: p._count.id,
            totalTokens: p._sum.totalTokens || 0,
          })),
        },
        recent: recentAIUsages,
      },
      recentUsers,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
