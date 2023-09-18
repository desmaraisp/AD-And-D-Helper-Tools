-- DropIndex
DROP INDEX "TransactionValue_transactionId_currencyId_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lootedBy" TEXT
);
INSERT INTO "new_Transaction" ("id", "lootedBy", "transactionDate") SELECT "id", "lootedBy", "transactionDate" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;