CREATE TYPE "public"."status" AS ENUM('andamento', 'concluido');--> statement-breakpoint
CREATE TYPE "public"."unidade" AS ENUM('peso', 'unidade');--> statement-breakpoint
CREATE TABLE "agulhas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	CONSTRAINT "agulhas_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "fotos_producao" (
	"id" serial PRIMARY KEY NOT NULL,
	"producao_id" integer NOT NULL,
	"caminho" text NOT NULL,
	"posicao" integer NOT NULL,
	"capa" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fotos_receita" (
	"id" serial PRIMARY KEY NOT NULL,
	"receita_id" integer NOT NULL,
	"caminho" text NOT NULL,
	"posicao" integer NOT NULL,
	"capa" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instrucoes_producao" (
	"id" serial PRIMARY KEY NOT NULL,
	"producao_id" integer NOT NULL,
	"parte_id" integer,
	"posicao" integer NOT NULL,
	"conteudo" text NOT NULL,
	"quantidade_repeticoes" integer DEFAULT 0 NOT NULL,
	"concluida" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instrucoes_receita" (
	"id" serial PRIMARY KEY NOT NULL,
	"receita_id" integer NOT NULL,
	"parte_id" integer,
	"posicao" integer NOT NULL,
	"conteudo" text NOT NULL,
	"quantidade_repeticoes" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partes_producao" (
	"id" serial PRIMARY KEY NOT NULL,
	"producao_id" integer NOT NULL,
	"nome" text NOT NULL,
	"posicao" integer NOT NULL,
	"concluida" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partes_receita" (
	"id" serial PRIMARY KEY NOT NULL,
	"receita_id" integer NOT NULL,
	"nome" text NOT NULL,
	"posicao" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "producoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"receita_id" integer,
	"user_id" text NOT NULL,
	"status" "status" DEFAULT 'andamento' NOT NULL,
	"tempo_real" integer DEFAULT 0 NOT NULL,
	"iniciado_em" timestamp,
	"finalizado_em" timestamp,
	"custo_materiais" numeric(10, 2) DEFAULT '0' NOT NULL,
	"valor_hora" numeric(10, 2),
	"custo_de_mao_obra" numeric(10, 2) DEFAULT '0' NOT NULL,
	"margem_lucro" numeric(5, 2),
	"preco_sugerido" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "producoes_agulhas" (
	"id" serial PRIMARY KEY NOT NULL,
	"producao_id" integer NOT NULL,
	"agulha_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "producoes_materiais" (
	"id" serial PRIMARY KEY NOT NULL,
	"producao_id" integer NOT NULL,
	"nome" text NOT NULL,
	"quantidade_utilizada" numeric(10, 3) NOT NULL,
	"quantidade_unidade" "unidade" NOT NULL,
	"custo_unidade" numeric(10, 2) NOT NULL,
	"custo_total" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "producoes_novelo" (
	"id" serial PRIMARY KEY NOT NULL,
	"producao_id" integer NOT NULL,
	"nome" text NOT NULL,
	"cor" text NOT NULL,
	"peso" numeric(10, 3) NOT NULL,
	"comprimento" numeric(10, 3) NOT NULL,
	"quantidade_utilizada" numeric(10, 3) NOT NULL,
	"quantidade_unidade" "unidade" NOT NULL,
	"custo_unidade" numeric(10, 2) NOT NULL,
	"custo_total" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receitas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"tempo_estimado_min" integer,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receitas_agulhas" (
	"id" serial PRIMARY KEY NOT NULL,
	"receita_id" integer NOT NULL,
	"agulha_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receitas_materiais" (
	"id" serial PRIMARY KEY NOT NULL,
	"receita_id" integer NOT NULL,
	"nome" text NOT NULL,
	"quantidade_utilizada" numeric(10, 3) NOT NULL,
	"quantidade_unidade" "unidade" NOT NULL,
	"custo_unidade" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receitas_novelo" (
	"id" serial PRIMARY KEY NOT NULL,
	"receita_id" integer NOT NULL,
	"nome" text NOT NULL,
	"cor" text NOT NULL,
	"peso" numeric(10, 3) NOT NULL,
	"comprimento" numeric(10, 3) NOT NULL,
	"quantidade_utilizada" numeric(10, 3) NOT NULL,
	"quantidade_unidade" "unidade" NOT NULL,
	"custo_unidade" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"issuer" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fotos_producao" ADD CONSTRAINT "fotos_producao_producao_id_producoes_id_fk" FOREIGN KEY ("producao_id") REFERENCES "public"."producoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fotos_receita" ADD CONSTRAINT "fotos_receita_receita_id_receitas_id_fk" FOREIGN KEY ("receita_id") REFERENCES "public"."receitas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instrucoes_producao" ADD CONSTRAINT "instrucoes_producao_producao_id_producoes_id_fk" FOREIGN KEY ("producao_id") REFERENCES "public"."producoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instrucoes_producao" ADD CONSTRAINT "instrucoes_producao_parte_id_partes_producao_id_fk" FOREIGN KEY ("parte_id") REFERENCES "public"."partes_producao"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instrucoes_receita" ADD CONSTRAINT "instrucoes_receita_receita_id_receitas_id_fk" FOREIGN KEY ("receita_id") REFERENCES "public"."receitas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instrucoes_receita" ADD CONSTRAINT "instrucoes_receita_parte_id_partes_receita_id_fk" FOREIGN KEY ("parte_id") REFERENCES "public"."partes_receita"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partes_producao" ADD CONSTRAINT "partes_producao_producao_id_producoes_id_fk" FOREIGN KEY ("producao_id") REFERENCES "public"."producoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partes_receita" ADD CONSTRAINT "partes_receita_receita_id_receitas_id_fk" FOREIGN KEY ("receita_id") REFERENCES "public"."receitas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producoes" ADD CONSTRAINT "producoes_receita_id_receitas_id_fk" FOREIGN KEY ("receita_id") REFERENCES "public"."receitas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producoes" ADD CONSTRAINT "producoes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producoes_agulhas" ADD CONSTRAINT "producoes_agulhas_producao_id_producoes_id_fk" FOREIGN KEY ("producao_id") REFERENCES "public"."producoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producoes_agulhas" ADD CONSTRAINT "producoes_agulhas_agulha_id_agulhas_id_fk" FOREIGN KEY ("agulha_id") REFERENCES "public"."agulhas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producoes_materiais" ADD CONSTRAINT "producoes_materiais_producao_id_producoes_id_fk" FOREIGN KEY ("producao_id") REFERENCES "public"."producoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producoes_novelo" ADD CONSTRAINT "producoes_novelo_producao_id_producoes_id_fk" FOREIGN KEY ("producao_id") REFERENCES "public"."producoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receitas" ADD CONSTRAINT "receitas_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receitas_agulhas" ADD CONSTRAINT "receitas_agulhas_receita_id_receitas_id_fk" FOREIGN KEY ("receita_id") REFERENCES "public"."receitas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receitas_agulhas" ADD CONSTRAINT "receitas_agulhas_agulha_id_agulhas_id_fk" FOREIGN KEY ("agulha_id") REFERENCES "public"."agulhas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receitas_materiais" ADD CONSTRAINT "receitas_materiais_receita_id_receitas_id_fk" FOREIGN KEY ("receita_id") REFERENCES "public"."receitas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receitas_novelo" ADD CONSTRAINT "receitas_novelo_receita_id_receitas_id_fk" FOREIGN KEY ("receita_id") REFERENCES "public"."receitas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "producoes_agulhas_unique" ON "producoes_agulhas" USING btree ("producao_id","agulha_id");--> statement-breakpoint
CREATE UNIQUE INDEX "receitas_agulhas_unique" ON "receitas_agulhas" USING btree ("receita_id","agulha_id");--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account" USING btree ("issuer","account_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");