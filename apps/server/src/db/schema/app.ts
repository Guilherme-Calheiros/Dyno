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
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth.js";

export const statusEnum = pgEnum("status", ["andamento", "concluido"]);
export const unidadeEnum = pgEnum("unidade", ["peso", "unidade"]);

// ── Receitas ──────────────────────────────────────────

export const receitas = pgTable("receitas", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  tempoEstimadoMin: integer("tempo_estimado_min"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const partesReceita = pgTable("partes_receita", {
  id: serial("id").primaryKey(),
  receitaId: integer("receita_id")
    .notNull()
    .references(() => receitas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  posicao: integer("posicao").notNull(),
});

export const instrucoesReceita = pgTable("instrucoes_receita", {
  id: serial("id").primaryKey(),
  receitaId: integer("receita_id")
    .notNull()
    .references(() => receitas.id, { onDelete: "cascade" }),
  parteId: integer("parte_id").references(() => partesReceita.id, {
    onDelete: "cascade",
  }),
  posicao: integer("posicao").notNull(),
  conteudo: text("conteudo").notNull(),
  quantidadeRepeticoes: integer("quantidade_repeticoes").notNull().default(0),
});

export const fotosReceita = pgTable("fotos_receita", {
  id: serial("id").primaryKey(),
  receitaId: integer("receita_id")
    .notNull()
    .references(() => receitas.id, { onDelete: "cascade" }),
  caminho: text("caminho").notNull(),
  posicao: integer("posicao").notNull(),
  capa: boolean("capa").notNull().default(false),
});

export const receitasMateriais = pgTable("receitas_materiais", {
  id: serial("id").primaryKey(),
  receitaId: integer("receita_id")
    .notNull()
    .references(() => receitas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  quantidadeUtilizada: decimal("quantidade_utilizada", {
    precision: 10,
    scale: 3,
  }).notNull(),
  quantidadeUnidade: unidadeEnum("quantidade_unidade").notNull(),
  custoUnidade: decimal("custo_unidade", { precision: 10, scale: 2 }).notNull(),
});

export const receitasNovelo = pgTable("receitas_novelo", {
  id: serial("id").primaryKey(),
  receitaId: integer("receita_id")
    .notNull()
    .references(() => receitas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  cor: text("cor").notNull(),
  peso: decimal("peso", { precision: 10, scale: 3 }).notNull(),
  comprimento: decimal("comprimento", { precision: 10, scale: 3 }).notNull(),
  quantidadeUtilizada: decimal("quantidade_utilizada", {
    precision: 10,
    scale: 3,
  }).notNull(),
  quantidadeUnidade: unidadeEnum("quantidade_unidade").notNull(),
  custoUnidade: decimal("custo_unidade", { precision: 10, scale: 2 }).notNull(),
});

// ── Agulhas ───────────────────────────────────────────

export const agulhas = pgTable("agulhas", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull().unique(),
});

export const receitasAgulhas = pgTable(
  "receitas_agulhas",
  {
    id: serial("id").primaryKey(),
    receitaId: integer("receita_id")
      .notNull()
      .references(() => receitas.id, { onDelete: "cascade" }),
    agulhaId: integer("agulha_id")
      .notNull()
      .references(() => agulhas.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("receitas_agulhas_unique").on(t.receitaId, t.agulhaId)]
);

// ── Produções ─────────────────────────────────────────

export const producoes = pgTable("producoes", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  receitaId: integer("receita_id").references(() => receitas.id, {
    onDelete: "set null",
  }),
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

export const partesProducao = pgTable("partes_producao", {
  id: serial("id").primaryKey(),
  producaoId: integer("producao_id")
    .notNull()
    .references(() => producoes.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  posicao: integer("posicao").notNull(),
  concluida: boolean("concluida").notNull().default(false),
});

export const instrucoesProducao = pgTable("instrucoes_producao", {
  id: serial("id").primaryKey(),
  producaoId: integer("producao_id")
    .notNull()
    .references(() => producoes.id, { onDelete: "cascade" }),
  parteId: integer("parte_id").references(() => partesProducao.id, {
    onDelete: "cascade",
  }),
  posicao: integer("posicao").notNull(),
  conteudo: text("conteudo").notNull(),
  quantidadeRepeticoes: integer("quantidade_repeticoes").notNull().default(0),
  concluida: boolean("concluida").notNull().default(false),
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
  quantidadeUtilizada: decimal("quantidade_utilizada", {
    precision: 10,
    scale: 3,
  }).notNull(),
  quantidadeUnidade: unidadeEnum("quantidade_unidade").notNull(),
  custoUnidade: decimal("custo_unidade", { precision: 10, scale: 2 }).notNull(),
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
  custoUnidade: decimal("custo_unidade", { precision: 10, scale: 2 }).notNull(),
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

export const receitasRelations = relations(receitas, ({ one, many }) => ({
  user: one(user, {
    fields: [receitas.userId],
    references: [user.id],
  }),
  partes: many(partesReceita),
  instrucoes: many(instrucoesReceita),
  fotos: many(fotosReceita),
  materiais: many(receitasMateriais),
  novelo: many(receitasNovelo),
  agulhas: many(receitasAgulhas),
}));

export const partesReceitaRelations = relations(
  partesReceita,
  ({ one, many }) => ({
    receita: one(receitas, {
      fields: [partesReceita.receitaId],
      references: [receitas.id],
    }),
    instrucoes: many(instrucoesReceita),
  })
);

export const instrucoesReceitaRelations = relations(
  instrucoesReceita,
  ({ one }) => ({
    receita: one(receitas, {
      fields: [instrucoesReceita.receitaId],
      references: [receitas.id],
    }),
    parte: one(partesReceita, {
      fields: [instrucoesReceita.parteId],
      references: [partesReceita.id],
    }),
  })
);

export const fotosReceitaRelations = relations(fotosReceita, ({ one }) => ({
  receita: one(receitas, {
    fields: [fotosReceita.receitaId],
    references: [receitas.id],
  }),
}));

export const receitasMateriaisRelations = relations(
  receitasMateriais,
  ({ one }) => ({
    receita: one(receitas, {
      fields: [receitasMateriais.receitaId],
      references: [receitas.id],
    }),
  })
);

export const receitasNoveloRelations = relations(
  receitasNovelo,
  ({ one }) => ({
    receita: one(receitas, {
      fields: [receitasNovelo.receitaId],
      references: [receitas.id],
    }),
  })
);

export const receitasAgulhasRelations = relations(
  receitasAgulhas,
  ({ one }) => ({
    receita: one(receitas, {
      fields: [receitasAgulhas.receitaId],
      references: [receitas.id],
    }),
    agulha: one(agulhas, {
      fields: [receitasAgulhas.agulhaId],
      references: [agulhas.id],
    }),
  })
);

export const agulhasRelations = relations(agulhas, ({ many }) => ({
  receitas: many(receitasAgulhas),
  producoes: many(producoesAgulhas),
}));

export const producoesRelations = relations(producoes, ({ one, many }) => ({
  user: one(user, {
    fields: [producoes.userId],
    references: [user.id],
  }),
  receita: one(receitas, {
    fields: [producoes.receitaId],
    references: [receitas.id],
  }),
  partes: many(partesProducao),
  instrucoes: many(instrucoesProducao),
  fotos: many(fotosProducao),
  materiais: many(producoesMateriais),
  novelo: many(producoesNovelo),
  agulhas: many(producoesAgulhas),
}));

export const partesProducaoRelations = relations(
  partesProducao,
  ({ one, many }) => ({
    producao: one(producoes, {
      fields: [partesProducao.producaoId],
      references: [producoes.id],
    }),
    instrucoes: many(instrucoesProducao),
  })
);

export const instrucoesProducaoRelations = relations(
  instrucoesProducao,
  ({ one }) => ({
    producao: one(producoes, {
      fields: [instrucoesProducao.producaoId],
      references: [producoes.id],
    }),
    parte: one(partesProducao, {
      fields: [instrucoesProducao.parteId],
      references: [partesProducao.id],
    }),
  })
);

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
