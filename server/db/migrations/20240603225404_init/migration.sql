-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("username");
