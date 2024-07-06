-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL,
    "receiver" TEXT NOT NULL,
    "sender" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transaction_receiver_idx" ON "Transaction"("receiver");

-- CreateIndex
CREATE INDEX "Transaction_sender_idx" ON "Transaction"("sender");
