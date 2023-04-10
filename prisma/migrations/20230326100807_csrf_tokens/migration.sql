-- CreateTable
CREATE TABLE "csrf_tokens" (
    "userId" TEXT NOT NULL,
    "csrfToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "csrf_tokens_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "csrf_tokens_csrfToken_key" ON "csrf_tokens"("csrfToken");

-- AddForeignKey
ALTER TABLE "csrf_tokens" ADD CONSTRAINT "csrf_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
