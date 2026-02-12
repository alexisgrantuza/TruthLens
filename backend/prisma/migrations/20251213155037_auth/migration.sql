/*
  Warnings:

  - You are about to drop the column `created_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nonce` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `ai_analysis` on the `verifications` table. All the data in the column will be lost.
  - You are about to drop the column `blockchain_tx_hash` on the `verifications` table. All the data in the column will be lost.
  - You are about to drop the column `image_hash` on the `verifications` table. All the data in the column will be lost.
  - You are about to drop the column `ipfs_cid` on the `verifications` table. All the data in the column will be lost.
  - You are about to drop the column `is_private` on the `verifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `verifications` table. All the data in the column will be lost.
  - You are about to drop the column `verification_id` on the `verifications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionToken]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageHash]` on the table `verifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verificationId]` on the table `verifications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionToken` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageHash` to the `verifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `verifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "verifications" DROP CONSTRAINT "verifications_user_id_fkey";

-- DropIndex
DROP INDEX "sessions_token_idx";

-- DropIndex
DROP INDEX "sessions_token_key";

-- DropIndex
DROP INDEX "sessions_user_id_idx";

-- DropIndex
DROP INDEX "users_wallet_address_key";

-- DropIndex
DROP INDEX "verifications_image_hash_idx";

-- DropIndex
DROP INDEX "verifications_user_id_idx";

-- DropIndex
DROP INDEX "verifications_verification_id_idx";

-- DropIndex
DROP INDEX "verifications_verification_id_key";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "created_at",
DROP COLUMN "expires_at",
DROP COLUMN "token",
DROP COLUMN "user_id",
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sessionToken" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "nonce",
DROP COLUMN "updated_at",
DROP COLUMN "wallet_address",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "verifications" DROP COLUMN "ai_analysis",
DROP COLUMN "blockchain_tx_hash",
DROP COLUMN "image_hash",
DROP COLUMN "ipfs_cid",
DROP COLUMN "is_private",
DROP COLUMN "user_id",
DROP COLUMN "verification_id",
ADD COLUMN     "aiAnalysis" JSONB,
ADD COLUMN     "blockchainTxHash" TEXT,
ADD COLUMN     "imageHash" TEXT NOT NULL,
ADD COLUMN     "ipfsCid" TEXT,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "verificationId" TEXT;

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_address_key" ON "wallets"("address");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_imageHash_key" ON "verifications"("imageHash");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_verificationId_key" ON "verifications"("verificationId");

-- CreateIndex
CREATE INDEX "verifications_userId_idx" ON "verifications"("userId");

-- CreateIndex
CREATE INDEX "verifications_imageHash_idx" ON "verifications"("imageHash");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
