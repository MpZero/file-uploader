/*
  Warnings:

  - A unique constraint covering the columns `[folderId,filename]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- DropIndex
DROP INDEX "File_filename_key";

-- DropIndex
DROP INDEX "Folder_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "File_folderId_filename_key" ON "File"("folderId", "filename");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_userId_name_key" ON "Folder"("userId", "name");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
