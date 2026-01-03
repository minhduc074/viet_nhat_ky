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

// GET /api/admin/ai-usage - Get AI usage statistics
export async function GET(request: NextRequest) {
  try {
    const adminId = verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const userId = searchParams.get('userId');
    const provider = searchParams.get('provider');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (userId) where.userId = userId;
    if (provider) where.provider = provider;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [usages, total] = await Promise.all([
      prisma.aIUsage.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.aIUsage.count({ where }),
    ]);

    // Calculate summary statistics
    const stats = await prisma.aIUsage.aggregate({
      where,
      _sum: {
        promptTokens: true,
        responseTokens: true,
        totalTokens: true,
        responseTimeMs: true,
      },
      _avg: {
        responseTimeMs: true,
      },
      _count: {
        success: true,
      },
    });

    const successCount = await prisma.aIUsage.count({
      where: { ...where, success: true },
    });

    const errorCount = await prisma.aIUsage.count({
      where: { ...where, success: false },
    });

    // Get usage by provider
    const providerStats = await prisma.aIUsage.groupBy({
      by: ['provider'],
      where,
      _sum: {
        totalTokens: true,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      usages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      statistics: {
        totalCalls: total,
        successfulCalls: successCount,
        failedCalls: errorCount,
        successRate: total > 0 ? (successCount / total) * 100 : 0,
        totalTokens: stats._sum.totalTokens || 0,
        totalPromptTokens: stats._sum.promptTokens || 0,
        totalResponseTokens: stats._sum.responseTokens || 0,
        avgResponseTime: stats._avg.responseTimeMs || 0,
        byProvider: providerStats.map((p) => ({
          provider: p.provider,
          calls: p._count.id,
          totalTokens: p._sum.totalTokens || 0,
        })),
      },
    });
  } catch (error) {
    console.error('AI usage stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ai-usage - Log AI usage (for internal use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      provider,
      endpoint,
      promptTokens = 0,
      responseTokens = 0,
      totalTokens = 0,
      success = true,
      errorMessage,
      responseTimeMs,
    } = body;

    if (!provider || !endpoint) {
      return NextResponse.json(
        { error: 'Provider and endpoint are required' },
        { status: 400 }
      );
    }

    const usage = await prisma.aIUsage.create({
      data: {
        userId,
        provider,
        endpoint,
        promptTokens,
        responseTokens,
        totalTokens,
        success,
        errorMessage,
        responseTimeMs,
      },
    });

    return NextResponse.json(usage, { status: 201 });
  } catch (error) {
    console.error('Log AI usage error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
