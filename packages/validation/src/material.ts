import {z} from "zod";

const unidadeSchema = z.enum(["unidade", "peso", "comprimento"]);

const materialSchema = z.object({
    type: z.literal("material"),
    nome: z.string().trim().min(1),
    quantidadeTotal: z.number().positive(),
    quantidadeUnidade: unidadeSchema,
    quantidadeUtilizada: z.number().positive(),
    custoAdquirido: z.number().nonnegative(),
})

const noveloSchema = z.object({
    type: z.literal("novelo"),
    nome: z.string().trim().min(1),
    cor: z.string().trim().min(1),
    peso: z.number().positive(),
    comprimento: z.number().positive(),
    quantidadeUtilizada: z.number().positive(),
    quantidadeUnidade: z.enum(["peso", "comprimento"]),
    custoAdquirido: z.number().nonnegative(),
})

const agulhaSchema = z.object({
    type: z.literal("agulha"),
    agulhaId: z.number().int().positive(),
})

export const materialInputSchema = z.discriminatedUnion("type", [
    materialSchema,
    noveloSchema,
    agulhaSchema,
]);

export type MaterialInput = z.infer<typeof materialInputSchema>;