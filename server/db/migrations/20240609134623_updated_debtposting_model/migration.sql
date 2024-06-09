-- AlterTable
ALTER TABLE "DebtPosting" ALTER COLUMN "isFulfilled" SET DEFAULT false,
ALTER COLUMN "isPaid" SET DEFAULT false,
ALTER COLUMN "isTradable" SET DEFAULT false,
ALTER COLUMN "tradePrice" SET DEFAULT 0.0;
