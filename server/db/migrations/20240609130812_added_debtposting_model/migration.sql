-- CreateTable
CREATE TABLE "DebtPosting" (
    "id" TEXT NOT NULL,
    "borrowerUsername" TEXT NOT NULL,
    "lenderUsername" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "isFulfilled" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPaid" BOOLEAN NOT NULL,
    "isTradable" BOOLEAN NOT NULL,
    "tradePrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DebtPosting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DebtPosting_borrowerUsername_idx" ON "DebtPosting"("borrowerUsername");

-- CreateIndex
CREATE INDEX "DebtPosting_lenderUsername_idx" ON "DebtPosting"("lenderUsername");

-- AddForeignKey
ALTER TABLE "DebtPosting" ADD CONSTRAINT "DebtPosting_borrowerUsername_fkey" FOREIGN KEY ("borrowerUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebtPosting" ADD CONSTRAINT "DebtPosting_lenderUsername_fkey" FOREIGN KEY ("lenderUsername") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
