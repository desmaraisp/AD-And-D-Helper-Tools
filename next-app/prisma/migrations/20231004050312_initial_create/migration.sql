-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "InventoryItemOwnership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "dateObtained" DATETIME NOT NULL,
    "dateDiscarded" DATETIME,
    "lootedBy" TEXT,
    "ownedBy" TEXT NOT NULL,
    CONSTRAINT "InventoryItemOwnership_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    CONSTRAINT "ItemValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemValue_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownedBy" TEXT NOT NULL,
    "transactionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lootedBy" TEXT
);

-- CreateTable
CREATE TABLE "TransactionValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    CONSTRAINT "TransactionValue_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransactionValue_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currencyName" TEXT NOT NULL,
    "currencyValue" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_name_key" ON "InventoryItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ItemValue_itemId_currencyId_key" ON "ItemValue"("itemId", "currencyId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionValue_transactionId_currencyId_key" ON "TransactionValue"("transactionId", "currencyId");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_currencyName_key" ON "Currency"("currencyName");
