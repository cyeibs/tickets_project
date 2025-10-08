-- Alter Purchase: add orderNumber (nullable, unique) and quantity (default 1)
ALTER TABLE "Purchase"
  ADD COLUMN "orderNumber" TEXT,
  ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;

-- Unique index for orderNumber (allows multiple NULLs depending on DB, acceptable)
CREATE UNIQUE INDEX IF NOT EXISTS "Purchase_orderNumber_key" ON "Purchase"("orderNumber");

-- Create Ticket table
CREATE TABLE "Ticket" (
  "id" TEXT NOT NULL,
  "purchaseId" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- Unique index for ticket short code
CREATE UNIQUE INDEX "Ticket_code_key" ON "Ticket"("code");

-- FKs
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


