/*
  Warnings:

  - You are about to drop the column `stats` on the `monthly_insights` table. All the data in the column will be lost.
  - You are about to drop the column `totalEntries` on the `monthly_insights` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `monthly_insights` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "monthly_insights" DROP COLUMN "stats",
DROP COLUMN "totalEntries",
ADD COLUMN     "avg_mood" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "total_entries" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "monthly_insights_user_id_month_idx" ON "monthly_insights"("user_id", "month");
