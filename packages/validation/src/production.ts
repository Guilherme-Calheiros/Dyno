import { z } from "zod";

export type ProductionStatus = "andamento" | "concluido";

export type QuantidadeUnidade = "unidade" | "peso" | "comprimento";

export const updateProductionSchema = z
    .object({
        nome: z
            .string()
            .trim()
            .min(1, "Nome é obrigatório")
            .max(100, "Nome deve ter no máximo 100 caracteres")
            .optional(),

        descricao: z
            .string()
            .trim()
            .max(1000, "Descrição deve ter no máximo 1000 caracteres")
            .nullable()
            .optional(),

        valorHora: z
            .number()
            .min(0, "Valor da hora não pode ser negativo")
            .nullable()
            .optional(),

        margemLucro: z
            .number()
            .min(0, "Margem de lucro não pode ser negativa")
            .nullable()
            .optional(),

        status: z.enum(["andamento", "concluido"]).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Nenhum campo para atualizar",
    });

export type UpdateProductionInput = z.infer<typeof updateProductionSchema>;

export type Production = {
    id: number;
    nome: string;
    status: ProductionStatus;
    tempoReal: number;
    iniciadoEm: string;
    finalizadoEm: string | null;
    capa: string | null;
    descricao: string | null;
    custoMateriais: string;
    valorHora: string | null;
    custoDeMaoObra: string;
    margemLucro: string | null;
    precoSugerido: string | null;
};

export type ProductionMaterial = {
    id: number;
    producaoId: number;
    nome: string;
    quantidadeTotal: string;
    quantidadeUnidade: QuantidadeUnidade;
    quantidadeUtilizada: string;
    custoAdquirido: string;
    custoTotal: string;
};

export type ProductionNovelo = {
    id: number;
    producaoId: number;
    nome: string;
    cor: string;
    peso: string;
    comprimento: string;
    quantidadeUtilizada: string;
    quantidadeUnidade: QuantidadeUnidade;
    custoAdquirido: string;
    custoTotal: string;
};

export type ProductionAgulha = {
    id: number;
    producaoId: number;
    agulhaId: number;
};

export type ProductionDetail = Production & {
    materiais: ProductionMaterial[];
    novelos: ProductionNovelo[];
    agulhas: ProductionAgulha[];
};