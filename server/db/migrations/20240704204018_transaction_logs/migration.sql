/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Transaction";

-- CreateTable
CREATE TABLE "TransactionLogs" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL,
    "receiver" TEXT NOT NULL,
    "sender" TEXT,

    CONSTRAINT "TransactionLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransactionLogs_receiver_idx" ON "TransactionLogs"("receiver");

-- CreateIndex
CREATE INDEX "TransactionLogs_sender_idx" ON "TransactionLogs"("sender");
