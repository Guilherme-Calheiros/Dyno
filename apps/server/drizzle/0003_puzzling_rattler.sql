ALTER TABLE "producoes" DROP CONSTRAINT "producoes_receita_id_receitas_id_fk";--> statement-breakpoint
ALTER TABLE "producoes" DROP COLUMN "receita_id";--> statement-breakpoint
DROP TABLE "instrucoes_receita";--> statement-breakpoint
DROP TABLE "partes_receita";--> statement-breakpoint
DROP TABLE "fotos_receita";--> statement-breakpoint
DROP TABLE "receitas_agulhas";--> statement-breakpoint
DROP TABLE "receitas_materiais";--> statement-breakpoint
DROP TABLE "receitas_novelo";--> statement-breakpoint
DROP TABLE "receitas";--> statement-breakpoint
DROP TABLE "instrucoes_producao";--> statement-breakpoint
DROP TABLE "partes_producao";
