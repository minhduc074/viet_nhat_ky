import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/utils';
import { generateMonthlyInsights } from '@/lib/ai';

const BATCH_SIZE = 5; // Process 5 users in parallel

// GET /api/cron/generate-insights
// This endpoint should be called by a cron job on the 1st of each month
// to generate AI insights for all users for the previous month
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (optional but recommended for security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return errorResponse('Unauthorized', 401);
    }

    // Calculate previous month
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const monthString = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
    const monthName = `Tháng ${prevMonth.getMonth() + 1}/${prevMonth.getFullYear()}`;

    console.log(`[CRON] Generating insights for ${monthString}`);

    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true },
    });

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Process users in batches for better performance
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      console.log(`[CRON] Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} users)`);

      // Process batch in parallel
      await Promise.all(
        batch.map(async (user) => {
          try {
            // Check if insight already exists
            const existing = await prisma.monthlyInsight.findUnique({
              where: {
                userId_month: {
                  userId: user.id,
                  month: monthString,
                },
              },
            });

            if (existing) {
              console.log(`[CRON] Skipping ${user.email}: Insight already exists`);
              results.skipped++;
              return;
            }

            // Get entries for the month
            const [year, month] = monthString.split('-').map(Number);
            const startDate = new Date(Date.UTC(year, month - 1, 1));
            const endDate = new Date(Date.UTC(year, month, 0));

            const entries = await prisma.dailyEntry.findMany({
              where: {
                userId: user.id,
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              },
              orderBy: { date: 'asc' },
            });

            // Skip if no entries
            if (entries.length === 0) {
              console.log(`[CRON] Skipping ${user.email}: No entries in ${monthString}`);
              results.skipped++;
              return;
            }

            // Generate AI insights
            const insight = await generateMonthlyInsights(entries, monthName);

            // Calculate stats
            const avgMood = entries.reduce((sum, e) => sum + e.moodScore, 0) / entries.length;

            // Save to database
            await prisma.monthlyInsight.create({
              data: {
                userId: user.id,
                month: monthString,
                insight,
                totalEntries: entries.length,
                avgMood: parseFloat(avgMood.toFixed(2)),
              },
            });

            console.log(`[CRON] Generated insight for ${user.email}: ${entries.length} entries`);
            results.success++;
          } catch (error: any) {
            console.error(`[CRON] Error for user ${user.email}:`, error);
            results.failed++;
            results.errors.push(`${user.email}: ${error.message}`);
          }
        })
      );

      // Add delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < users.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
      }
    }

    console.log(`[CRON] Complete:`, results);

    return successResponse({
      month: monthString,
      ...results,
    }, `Generated insights: ${results.success} success, ${results.failed} failed, ${results.skipped} skipped`);
  } catch (error: any) {
    console.error('[CRON] Fatal error:', error);
    return errorResponse(error.message || 'Đã xảy ra lỗi', 500);
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
