ALTER TYPE "unidade" ADD VALUE 'comprimento';
--> statement-breakpoint
ALTER TABLE "receitas_materiais" ADD COLUMN "quantidade_total" numeric(10, 3) NOT NULL DEFAULT '0';
--> statement-breakpoint
ALTER TABLE "receitas_materiais" ALTER COLUMN "quantidade_total" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "receitas_materiais" DROP COLUMN IF EXISTS "custo_unidade";
--> statement-breakpoint
ALTER TABLE "receitas_materiais" ADD COLUMN "custo_adquirido" numeric(10, 2) NOT NULL DEFAULT '0';
--> statement-breakpoint
ALTER TABLE "receitas_materiais" ALTER COLUMN "custo_adquirido" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "receitas_novelo" DROP COLUMN IF EXISTS "custo_unidade";
--> statement-breakpoint
ALTER TABLE "receitas_novelo" ADD COLUMN "custo_adquirido" numeric(10, 2) NOT NULL DEFAULT '0';
--> statement-breakpoint
ALTER TABLE "receitas_novelo" ALTER COLUMN "custo_adquirido" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "producoes_materiais" ADD COLUMN "quantidade_total" numeric(10, 3) NOT NULL DEFAULT '0';
--> statement-breakpoint
ALTER TABLE "producoes_materiais" ALTER COLUMN "quantidade_total" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "producoes_materiais" DROP COLUMN IF EXISTS "custo_unidade";
--> statement-breakpoint
ALTER TABLE "producoes_materiais" ADD COLUMN "custo_adquirido" numeric(10, 2) NOT NULL DEFAULT '0';
--> statement-breakpoint
ALTER TABLE "producoes_materiais" ALTER COLUMN "custo_adquirido" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "producoes_novelo" DROP COLUMN IF EXISTS "custo_unidade";
--> statement-breakpoint
ALTER TABLE "producoes_novelo" ADD COLUMN "custo_adquirido" numeric(10, 2) NOT NULL DEFAULT '0';
--> statement-breakpoint
ALTER TABLE "producoes_novelo" ALTER COLUMN "custo_adquirido" DROP DEFAULT;