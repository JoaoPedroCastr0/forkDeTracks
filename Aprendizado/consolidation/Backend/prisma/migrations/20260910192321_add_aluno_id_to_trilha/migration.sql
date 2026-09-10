-- AlterTable
ALTER TABLE "trilhas" ADD COLUMN     "aluno_id" TEXT;

-- CreateIndex
CREATE INDEX "trilhas_aluno_id_idx" ON "trilhas"("aluno_id");

-- AddForeignKey
ALTER TABLE "trilhas" ADD CONSTRAINT "trilhas_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
