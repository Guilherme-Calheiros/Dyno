import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { authedFetch } from "../../lib/authed-fetch";
import { parseDecimal } from "@/lib/format";
import { MaterialInput, ProductionAgulha, ProductionDetail, ProductionMaterial, ProductionNovelo, UpdateProductionInput, updateProductionSchema } from "@artesaos/validation";


function toErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
}

function addCost(current: string, added: string): string {
    const total = parseDecimal(current) + parseDecimal(added);
    return (Math.round(total * 100) / 100).toFixed(2);
}

function removeCost(current: string, removed: string): string {
    const total = parseDecimal(current) - parseDecimal(removed);
    return Math.max(0, Math.round(total * 100) / 100).toFixed(2);
}

export function useProduction(id: string) {
    const toast = useToast();
    const [production, setProduction] = useState<ProductionDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const fetchProduction = async () => {
            try {
                const response = await authedFetch(`/api/productions/${id}`);

                if (!response.ok) {
                    throw new Error(
                        response.status === 404
                            ? "Produção não encontrada"
                            : "Erro ao buscar produção"
                    );
                }

                const data = await response.json();

                if (active) {
                    setProduction(data.producao);
                }
            } catch (error) {
                toast.error(
                    toErrorMessage(error, "Erro ao buscar produção")
                );
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchProduction();

        return () => {
            active = false;
        };
    }, [id]);

    const save = useCallback(
        async (patch: UpdateProductionInput) => {
            const parsed = updateProductionSchema.safeParse(patch);

            if (!parsed.success) {
                throw new Error("Dados inválidos para salvar");
            }

            const response = await authedFetch(`/api/productions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar alterações");
            }

            return (await response.json()).producao;
        },
        [id]
    );

    const rename = useCallback(
        async (nome: string) => {
            if (!production) return;

            const previous = production.nome;
            const next = nome.trim();

            setProduction((prev) => (prev ? { ...prev, nome: next } : prev));

            try {
                await save({ nome: next });
                toast.success("Nome atualizado");
            } catch (error) {
                setProduction((prev) =>
                    prev ? { ...prev, nome: previous } : prev
                );
                toast.error(toErrorMessage(error, "Erro ao salvar alterações"));
            }
        },
        [production, save, toast]
    );

    const saveDescription = useCallback(
        async (descricao: string) => {
            if (!production) return;

            const previous = production.descricao;
            const next = descricao.trim();

            setProduction((prev) =>
                prev ? { ...prev, descricao: next } : prev
            );

            try {
                await save({ descricao: next });
                toast.success("Descrição atualizada");
            } catch (error) {
                setProduction((prev) =>
                    prev ? { ...prev, descricao: previous } : prev
                );
                toast.error(toErrorMessage(error, "Erro ao salvar alterações"));
            }
        },
        [production, save, toast]
    );

    const saveValues = useCallback(
        async (values: { valorHora: number; margemLucro: number }) => {
            if (!production) return;

            const previous = {
                valorHora: production.valorHora,
                margemLucro: production.margemLucro,
            };

            const patch: UpdateProductionInput = {
                valorHora: values.valorHora,
                margemLucro: values.margemLucro,
            };

            setProduction((prev) =>
                prev
                    ? {
                          ...prev,
                          valorHora: String(values.valorHora),
                          margemLucro: String(values.margemLucro),
                      }
                    : prev
            );

            try {
                await save(patch);
                toast.success("Valores atualizados");
            } catch (error) {
                setProduction((prev) =>
                    prev ? { ...prev, ...previous } : prev
                );
                toast.error(toErrorMessage(error, "Erro ao salvar alterações"));
            }
        },
        [production, save, toast]
    );

    const addMaterial = useCallback(
        async (material: MaterialInput) => {
            const response = await authedFetch(`/api/productions/${id}/materiais`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json",},
                    body: JSON.stringify(material)
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao adicionar material");
            }

            const data = await response.json();
            
            setProduction((prev) => {
                if(!prev) return prev

                switch (material.type) {
                    case "material": {
                        const item = data as ProductionMaterial;
                        return {
                            ...prev,
                            materiais: [...prev.materiais, item],
                            custoMateriais: addCost(prev.custoMateriais, item.custoTotal),
                        }
                    }

                    case "agulha": return {
                        ...prev,
                        agulhas: [...prev.agulhas, data as ProductionAgulha]
                    }

                    case "novelo": {
                        const item = data as ProductionNovelo;
                        return {
                            ...prev,
                            novelos: [...prev.novelos, item],
                            custoMateriais: addCost(prev.custoMateriais, item.custoTotal),
                        }
                    }
                }
            })
        }, [id]
    )
    
    const editMaterial = useCallback(
        async (
            materialId: number,
            type: "material" | "novelo" | "agulha",
            data: MaterialInput
        ) => {
            const response = await authedFetch(`/api/productions/${id}/materiais`,{
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        id: materialId,
                        ...data,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao editar material");
            }

            const updated = await response.json();

            setProduction((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    custoMateriais: updated.custoMateriais ?? prev.custoMateriais,
                    ...(type === "material" && {
                        materiais: prev.materiais.map((item) =>
                            item.id === materialId ? updated.material : item
                        ),
                    }),
                    ...(type === "novelo" && {
                        novelos: prev.novelos.map((item) =>
                            item.id === materialId ? updated.material : item
                        ),
                    }),
                    ...(type === "agulha" && {
                        agulhas: prev.agulhas.map((item) =>
                            item.id === materialId ? updated.material : item
                        ),
                    }),
                };
            });

            toast.success("Material atualizado");
        },
        [id, toast]
    );

    const removeMaterial = useCallback(
        async (material: {
            id: number;
            type: "material" | "novelo" | "agulha";
        }) => {
            const response = await authedFetch(`/api/productions/${id}/materiais`,{
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(material),
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao excluir material");
            }

            setProduction((prev) => {
                if (!prev) return prev;

                switch (material.type) {
                    case "material": {
                        const item = prev.materiais.find(
                            (item) => item.id === material.id
                        );

                        if (!item) return prev;

                        return {
                            ...prev,
                            materiais: prev.materiais.filter(
                                (item) => item.id !== material.id
                            ),
                            custoMateriais: removeCost(prev.custoMateriais, item.custoTotal),
                        };
                    }

                    case "novelo": {
                        const item = prev.novelos.find(
                            (item) => item.id === material.id
                        );

                        if (!item) return prev;

                        return {
                            ...prev,
                            novelos: prev.novelos.filter(
                                (item) => item.id !== material.id
                            ),
                            custoMateriais: removeCost(prev.custoMateriais, item.custoTotal),
                        };
                    }

                    case "agulha":
                        return {
                            ...prev,
                            agulhas: prev.agulhas.filter(
                                (item) => item.id !== material.id
                            ),
                        };
                }
            });

            toast.success("Material excluído");
        },
        [id, toast]
    );

    const pauseTimer = useCallback(
        async (tempoSessao: number) => {
            if (tempoSessao <= 0) {
                return;
            }

            const response = await authedFetch(
                `/api/productions/${id}/timer`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "add",
                        tempo: tempoSessao,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao salvar tempo");
            }

            const data = await response.json();

            setProduction((prev) =>
                prev
                    ? {
                        ...prev,
                        tempoReal: data.tempoReal,
                    }
                    : prev
            );
        },
        [id]
    );

    const resetTimer = useCallback(async () => {
        const response = await authedFetch(
            `/api/productions/${id}/timer`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "reset",
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao resetar cronômetro");
        }

        setProduction((prev) =>
            prev
                ? {
                    ...prev,
                    tempoReal: 0,
                }
                : prev
        );
    }, [id]);

    return {
        production,
        loading,
        rename,
        saveDescription,
        saveValues,
        addMaterial,
        editMaterial,
        removeMaterial,
        pauseTimer,
        resetTimer,
    };
}