-- CreateTable
CREATE TABLE "Presente" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nomeRemetente" TEXT NOT NULL,
    "nomeDestinatario" TEXT NOT NULL,
    "ocasiao" TEXT NOT NULL,
    "dataEspecial" TIMESTAMP(3),
    "mensagem" TEXT NOT NULL,
    "musica" TEXT NOT NULL,
    "musicaUrl" TEXT,
    "tema" TEXT NOT NULL DEFAULT 'romantico',
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "email" TEXT,
    "paymentId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Presente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Foto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "presenteId" TEXT NOT NULL,

    CONSTRAINT "Foto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Presente_slug_key" ON "Presente"("slug");

-- AddForeignKey
ALTER TABLE "Foto" ADD CONSTRAINT "Foto_presenteId_fkey" FOREIGN KEY ("presenteId") REFERENCES "Presente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
