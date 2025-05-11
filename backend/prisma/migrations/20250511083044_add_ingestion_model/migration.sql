-- CreateTable
CREATE TABLE "Ingestion" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "vendor" TEXT,
    "invoiceDate" TIMESTAMP(3),
    "amount" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ingestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ingestion_documentId_key" ON "Ingestion"("documentId");

-- AddForeignKey
ALTER TABLE "Ingestion" ADD CONSTRAINT "Ingestion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
