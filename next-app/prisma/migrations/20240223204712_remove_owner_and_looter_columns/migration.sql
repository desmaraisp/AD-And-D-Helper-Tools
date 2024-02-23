/*
  Warnings:

  - You are about to drop the column `lootedBy` on the `InventoryItemOwnership` table. All the data in the column will be lost.
  - You are about to drop the column `ownedBy` on the `InventoryItemOwnership` table. All the data in the column will be lost.
  - You are about to drop the column `lootedBy` on the `Transaction` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InventoryItemOwnership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "dateObtained" DATETIME NOT NULL,
    CONSTRAINT "InventoryItemOwnership_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InventoryItemOwnership" ("count", "dateObtained", "id", "itemId") SELECT "count", "dateObtained", "id", "itemId" FROM "InventoryItemOwnership";
DROP TABLE "InventoryItemOwnership";
ALTER TABLE "new_InventoryItemOwnership" RENAME TO "InventoryItemOwnership";
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "label" TEXT NOT NULL
);
INSERT INTO "new_Transaction" ("id", "label", "transactionDate") SELECT "id", "label", "transactionDate" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
