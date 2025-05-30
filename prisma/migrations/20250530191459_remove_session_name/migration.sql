/*
  Warnings:

  - You are about to drop the column `name` on the `chats_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chats_sessions" DROP COLUMN "name",
ALTER COLUMN "is_group" DROP NOT NULL,
ALTER COLUMN "is_group" SET DEFAULT false;
