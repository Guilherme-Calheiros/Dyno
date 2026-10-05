import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  decimal,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth.js";

export const statusEnum = pgEnum("status", ["andamento", "concluido"]);
export const unidadeEnum = pgEnum("unidade", ["unidade", "peso", "comprimento"]);

// ── Agulhas ───────────────────────────────────────────

export const agulhas = pgTable("agulhas", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull().unique(),
});

// ── Produções ─────────────────────────────────────────

export const producoes = pgTable("producoes", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: statusEnum("status").notNull().default("andamento"),
  tempoReal: integer("tempo_real").notNull().default(0),
  iniciadoEm: timestamp("iniciado_em"),
  finalizadoEm: timestamp("finalizado_em"),
  custoMateriais: decimal("custo_materiais", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  valorHora: decimal("valor_hora", { precision: 10, scale: 2 }),
  custoDeMaoObra: decimal("custo_de_mao_obra", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  margemLucro: decimal("margem_lucro", { precision: 5, scale: 2 }),
  precoSugerido: decimal("preco_sugerido", { precision: 10, scale: 2 }),
});

export const fotosProducao = pgTable("fotos_producao", {
  id: serial("id").primaryKey(),
  producaoId: integer("producao_id")
    .notNull()
    .references(() => producoes.id, { onDelete: "cascade" }),
  caminho: text("caminho").notNull(),
  posicao: integer("posicao").notNull(),
  capa: boolean("capa").notNull().default(false),
});

export const producoesMateriais = pgTable("producoes_materiais", {
  id: serial("id").primaryKey(),
  producaoId: integer("producao_id")
    .notNull()
    .references(() => producoes.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  quantidadeTotal: decimal("quantidade_total", {
    precision: 10,
    scale: 3,
  }).notNull(),
  quantidadeUnidade: unidadeEnum("quantidade_unidade").notNull(),
  quantidadeUtilizada: decimal("quantidade_utilizada", {
    precision: 10,
    scale: 3,
  }).notNull(),
  custoAdquirido: decimal("custo_adquirido", {
    precision: 10,
    scale: 2,
  }).notNull(),
  custoTotal: decimal("custo_total", { precision: 10, scale: 2 }).notNull(),
});

export const producoesNovelo = pgTable("producoes_novelo", {
  id: serial("id").primaryKey(),
  producaoId: integer("producao_id")
    .notNull()
    .references(() => producoes.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  cor: text("cor").notNull(),
  peso: decimal("peso", { precision: 10, scale: 3 }).notNull(),
  comprimento: decimal("comprimento", { precision: 10, scale: 3 }).notNull(),
  quantidadeUtilizada: decimal("quantidade_utilizada", {
    precision: 10,
    scale: 3,
  }).notNull(),
  quantidadeUnidade: unidadeEnum("quantidade_unidade").notNull(),
  custoAdquirido: decimal("custo_adquirido", {
    precision: 10,
    scale: 2,
  }).notNull(),
  custoTotal: decimal("custo_total", { precision: 10, scale: 2 }).notNull(),
});

export const producoesAgulhas = pgTable(
  "producoes_agulhas",
  {
    id: serial("id").primaryKey(),
    producaoId: integer("producao_id")
      .notNull()
      .references(() => producoes.id, { onDelete: "cascade" }),
    agulhaId: integer("agulha_id")
      .notNull()
      .references(() => agulhas.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("producoes_agulhas_unique").on(t.producaoId, t.agulhaId)]
);

// ── Relations ─────────────────────────────────────────

export const agulhasRelations = relations(agulhas, ({ many }) => ({
  producoes: many(producoesAgulhas),
}));

export const producoesRelations = relations(producoes, ({ one, many }) => ({
  user: one(user, {
    fields: [producoes.userId],
    references: [user.id],
  }),
  fotos: many(fotosProducao),
  materiais: many(producoesMateriais),
  novelo: many(producoesNovelo),
  agulhas: many(producoesAgulhas),
}));

export const fotosProducaoRelations = relations(fotosProducao, ({ one }) => ({
  producao: one(producoes, {
    fields: [fotosProducao.producaoId],
    references: [producoes.id],
  }),
}));

export const producoesMateriaisRelations = relations(
  producoesMateriais,
  ({ one }) => ({
    producao: one(producoes, {
      fields: [producoesMateriais.producaoId],
      references: [producoes.id],
    }),
  })
);

export const producoesNoveloRelations = relations(
  producoesNovelo,
  ({ one }) => ({
    producao: one(producoes, {
      fields: [producoesNovelo.producaoId],
      references: [producoes.id],
    }),
  })
);

export const producoesAgulhasRelations = relations(
  producoesAgulhas,
  ({ one }) => ({
    producao: one(producoes, {
      fields: [producoesAgulhas.producaoId],
      references: [producoes.id],
    }),
    agulha: one(agulhas, {
      fields: [producoesAgulhas.agulhaId],
      references: [agulhas.id],
    }),
  })
);
