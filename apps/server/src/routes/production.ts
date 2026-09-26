import { Router } from "express";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "../db";
import { fotosProducao, producoes, producoesAgulhas, producoesMateriais, producoesNovelo, receitas } from "../db/schema/app";
import { and, eq, sql } from "drizzle-orm";
import { deleteObject, getObjectKeyFromUrl, isOurObject } from "../storage/r2.js";
import { materialInputSchema, updateProductionSchema } from "@artesaos/validation";

const router = Router();

router.get("/", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    })

    if (!session?.user){
        return res.status(401).json({ error: "Não autorizado" });
    }

    const productionData = await db
        .select({
            id: producoes.id,
            nome: producoes.nome,
            status: producoes.status,
            tempoReal: producoes.tempoReal,
            iniciadoEm: producoes.iniciadoEm,
            finalizadoEm: producoes.finalizadoEm,
            capa: fotosProducao.caminho,
        })
        .from(producoes)
        .leftJoin(
            fotosProducao,
            and(
                eq(fotosProducao.producaoId, producoes.id),
                eq(fotosProducao.capa, true)
            )
        )
        .where(eq(producoes.userId, session.user.id));

    return res.json({ producoes: productionData })
})

router.post("/", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    })

    if (!session?.user){
        return res.status(401).json({ error: "Não autorizado" });
    }

    try {
        const existingProductions = await db
            .select({
                nome: producoes.nome,
            })
            .from(producoes)
            .where(eq(producoes.userId, session.user.id));

        const baseName = "Nova produção";

        const numbers = existingProductions
            .map((producao) => {
                const match = producao.nome.match(
                    /^Nova produção(?: \((\d+)\))?$/
                );

                return match ? Number(match[1] ?? 0) : null;
            })
            .filter((number): number is number => number !== null);

        const nextNumber =
            numbers.length > 0 ? Math.max(...numbers) + 1 : 0;

        const nome =
            nextNumber === 0
                ? baseName
                : `${baseName} (${nextNumber})`;

        const [producao] = await db
            .insert(producoes)
            .values({
                nome,
                userId: session.user.id,
                status: "andamento",
                tempoReal: 0,
                iniciadoEm: new Date(),
            })
            .returning();

        return res.status(201).json({
            producao: producao,
        });
    } catch (error) {
        console.error("Erro ao criar produção:", error);

        return res.status(500).json({
            error: "Erro ao criar produção",
        });
    }
})

router.get("/:id", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    })

    if (!session?.user){
        return res.status(401).json({ error: "Não autorizado" });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const [producao] = await db
            .select({
                producao: producoes,
                receitaNome: receitas.nome,
                capa: fotosProducao.caminho,
            })
            .from(producoes)
            .leftJoin(
                fotosProducao,
                and(
                    eq(fotosProducao.producaoId, producoes.id),
                    eq(fotosProducao.capa, true)
                )
            )
            .leftJoin(receitas, eq(receitas.id, producoes.receitaId))
            .where(
                and(
                    eq(producoes.id, id),
                    eq(producoes.userId, session.user.id)
                )
            );

        if (!producao) {
            return res.status(404).json({ error: "Produção não encontrada" });
        }

        const [materiais, novelos, agulhas] = await Promise.all([
            db
                .select()
                .from(producoesMateriais)
                .where(eq(producoesMateriais.producaoId, id)),

            db
                .select()
                .from(producoesNovelo)
                .where(eq(producoesNovelo.producaoId, id)),

            db
                .select()
                .from(producoesAgulhas)
                .where(eq(producoesAgulhas.producaoId, id)),
        ])

        return res.json({
            producao: {
                ...producao.producao,
                receitaNome: producao.receitaNome,
                capa: producao.capa,
                materiais,
                novelos,
                agulhas,
            },
        })
    } catch (error) {
        console.error("Erro ao buscar produção:", error)

        return res.status(500).json({
            error: "Erro ao buscar produção",
        });
    }
})

router.patch("/:id", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    })

    if (!session?.user){
        return res.status(401).json({ error: "Não autorizado" });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID inválido" });
    }

    const data = req.body

    const result = updateProductionSchema.safeParse(data);

    if (!result.success) {
        const msg = result.error.issues[0]?.message ?? "Dados da produção inválidos";
        return res.status(400).json({ error: msg });
    }

    const { nome, descricao, valorHora, margemLucro } = result.data;

    try {
        const [producao] = await db
            .update(producoes)
            .set({
                nome,
                descricao,
                valorHora: valorHora?.toString(),
                margemLucro: margemLucro?.toString(),
            })
            .where(
                and(
                    eq(producoes.id, id),
                    eq(producoes.userId, session.user.id)
                )
            )
            .returning()

        if (!producao) {
            return res.status(404).json({ error: "Produção não encontrada" });
        }

        return res.json({
            producao,
        })
    } catch (error) {
        console.error("Erro ao atualizar produção:", error)

        return res.status(500).json({
            error: "Erro ao atualizar produção",
        });
    }
})

router.delete("/:id", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    })

    if (!session?.user){
        return res.status(401).json({ error: "Não autorizado" });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const [producao] = await db
            .select({ id: producoes.id })
            .from(producoes)
            .where(
                and(
                    eq(producoes.id, id),
                    eq(producoes.userId, session.user.id)
                )
            );

        if (!producao) {
            return res.status(404).json({ error: "Produção não encontrada" });
        }

        const fotos = await db
            .select({ caminho: fotosProducao.caminho })
            .from(fotosProducao)
            .where(eq(fotosProducao.producaoId, id));

        await Promise.all(
            fotos.map(async ({ caminho }) => {
                if (!isOurObject(caminho)) return;

                const objectKey = getObjectKeyFromUrl(caminho);
                if (objectKey) {
                    await deleteObject(objectKey);
                }
            })
        );

        await db
            .delete(producoes)
            .where(
                and(
                    eq(producoes.id, id),
                    eq(producoes.userId, session.user.id)
                )
            );

        return res.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir produção:", error);

        return res.status(500).json({
            error: "Erro ao excluir produção",
        });
    }
})

router.post("/:id/materiais", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
        return res.status(401).json({ error: "Não autorizado" });
    }

    const producaoId = Number(req.params.id);

    if (!Number.isInteger(producaoId) || producaoId <= 0) {
        return res.status(400).json({ error: "ID inválido" });
    }

    const [producao] = await db
        .select()
        .from(producoes)
        .where(
            and(
                eq(producoes.id, producaoId),
                eq(producoes.userId, session.user.id),
            )
        )
        .limit(1);

    if (!producao) {
        return res.status(404).json({
            error: "Produção não encontrada",
        });
    }

    const result = materialInputSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: "Dados do material inválidos",
            details: result.error.flatten(),
        });
    }

    const data = result.data;

    const round2 = (value: number) => Math.round(value * 100) / 100;

    try {
        return await db.transaction(async (tx) => {
            switch (data.type) {
                case "material": {
                    const custoTotal = round2(
                        (data.quantidadeUtilizada / data.quantidadeTotal) *
                            data.custoAdquirido
                    );

                    const [material] = await tx
                        .insert(producoesMateriais)
                        .values({
                            nome: data.nome,
                            quantidadeTotal: data.quantidadeTotal.toString(),
                            quantidadeUnidade: data.quantidadeUnidade,
                            quantidadeUtilizada:
                                data.quantidadeUtilizada.toString(),
                            custoAdquirido: data.custoAdquirido.toString(),
                            custoTotal: custoTotal.toString(),
                            producaoId,
                        })
                        .returning();

                    await tx
                        .update(producoes)
                        .set({
                            custoMateriais: sql`${producoes.custoMateriais} + ${custoTotal}`,
                        })
                        .where(eq(producoes.id, producaoId));

                    return res.status(201).json(material);
                }

                case "novelo": {
                    const total =
                        data.quantidadeUnidade === "peso"
                            ? data.peso
                            : data.comprimento;

                    const custoTotal = round2(
                        (data.quantidadeUtilizada / total) *
                            data.custoAdquirido
                    );

                    const [novelo] = await tx
                        .insert(producoesNovelo)
                        .values({
                            nome: data.nome,
                            cor: data.cor,
                            peso: data.peso.toString(),
                            comprimento: data.comprimento.toString(),
                            quantidadeUtilizada:
                                data.quantidadeUtilizada.toString(),
                            quantidadeUnidade: data.quantidadeUnidade,
                            custoAdquirido: data.custoAdquirido.toString(),
                            custoTotal: custoTotal.toString(),
                            producaoId,
                        })
                        .returning();

                    await tx
                        .update(producoes)
                        .set({
                            custoMateriais: sql`${producoes.custoMateriais} + ${custoTotal}`,
                        })
                        .where(eq(producoes.id, producaoId));

                    return res.status(201).json(novelo);
                }

                case "agulha": {
                    const [agulha] = await tx
                        .insert(producoesAgulhas)
                        .values({
                            producaoId,
                            agulhaId: data.agulhaId,
                        })
                        .returning();

                    return res.status(201).json(agulha);
                }
            }
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message.includes(
                "producoes_agulhas_producao_id_agulha_id"
            )
        ) {
            return res.status(409).json({
                error: "Essa agulha já foi adicionada à produção",
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro ao adicionar material à produção",
        });
    }
});

export default router;