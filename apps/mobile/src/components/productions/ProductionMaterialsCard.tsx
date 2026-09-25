import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, font } from "@/theme/tokens";
import { formatBRL, parseDecimal } from "@/lib/format";
import { useAgulhas } from "@/hooks/useAgulhas";
import {
    ProductionDetail,
    QuantidadeUnidade,
} from "@artesaos/validation";
import MaterialIcon from "../material/MaterialIcon";

type Props = {
    production: ProductionDetail | null;
    loading: boolean;
    onAdd: () => void;
};

type MaterialType = "material" | "novelo" | "agulha";

type MaterialItem = {
    tipo: MaterialType;
    id: number;
    nome: string;
    detalhe: string | null;
    cor: string | null;
};

const unitSuffix: Record<QuantidadeUnidade, string> = {
    unidade: "un",
    peso: "g",
    comprimento: "m",
};

function formatQty(value: string, unidade: QuantidadeUnidade): string {
    const quantidade = parseDecimal(value).toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
    });

    return `${quantidade} ${unitSuffix[unidade]}`;
}

export default function ProductionMaterialsCard({
    production,
    loading,
    onAdd,
}: Props) {
    const materiais = production?.materiais ?? [];
    const novelos = production?.novelos ?? [];
    const agulhas = production?.agulhas ?? [];

    const { agulhas: agulhasList } = useAgulhas(agulhas.length > 0);

    const groups: { label: string; items: MaterialItem[] }[] = [
        {
            label: "Agulhas",
            items: agulhas.map((agulha) => ({
                tipo: "agulha" as const,
                id: agulha.id,
                nome:
                    agulhasList.find((item) => item.id === agulha.agulhaId)?.nome ??
                    `Agulha #${agulha.agulhaId}`,
                detalhe: null,
                cor: null,
            })),
        },
        {
            label: "Novelos",
            items: novelos.map((novelo) => ({
                tipo: "novelo" as const,
                id: novelo.id,
                nome: novelo.nome,
                detalhe: `${formatQty(novelo.quantidadeUtilizada, novelo.quantidadeUnidade)} · ${formatBRL(novelo.custoTotal)}`,
                cor: novelo.cor,
            })),
        },
        {
            label: "Outros",
            items: materiais.map((material) => ({
                tipo: "material" as const,
                id: material.id,
                nome: material.nome,
                detalhe: `${formatQty(material.quantidadeUtilizada, material.quantidadeUnidade)} · ${formatBRL(material.custoTotal)}`,
                cor: null,
            })),
        },
    ];

    const visibleGroups = groups.filter((group) => group.items.length > 0);
    const isEmpty = !loading && visibleGroups.length === 0;

    return (
        <View style={styles.section}>
            <View style={styles.head}>
                <Text style={styles.title}>Materiais</Text>
                <Pressable
                    onPress={onAdd}
                    accessibilityRole="button"
                    accessibilityLabel="Adicionar material"
                >
                    <Text style={styles.headAction}>Adicionar</Text>
                </Pressable>
            </View>

            {loading ? (
                <Text style={styles.message}>Carregando…</Text>
            ) : isEmpty ? (
                <Text style={styles.message}>
                    Nenhum material adicionado ainda
                </Text>
            ) : (
                visibleGroups.map((group) => (
                    <View key={group.label} style={styles.group}>
                        <Text style={styles.groupLabel}>{group.label}</Text>

                        {group.items.map((item, index) => (
                            <View key={`${item.tipo}-${item.id}`}>
                                {index > 0 && <View style={styles.divider} />}

                                <View style={styles.row}>
                                    <View style={styles.iconBox}>
                                        <MaterialIcon
                                            tipo={item.tipo}
                                            cor={item.cor}
                                        />
                                    </View>

                                    <View style={styles.rowCol}>
                                        <Text
                                            style={styles.rowName}
                                            numberOfLines={1}
                                        >
                                            {item.nome}
                                        </Text>
                                        {item.detalhe && (
                                            <Text
                                                style={styles.rowDetail}
                                                numberOfLines={1}
                                            >
                                                {item.detalhe}
                                            </Text>
                                        )}
                                    </View>

                                    <Pressable
                                        style={styles.rowAction}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Editar ${item.nome}`}
                                    >
                                        <FontAwesome5
                                            name="chevron-right"
                                            size={16}
                                            color={colors.inkFaint}
                                        />
                                    </Pressable>

                                    <Pressable
                                        style={styles.rowAction}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Excluir ${item.nome}`}
                                    >
                                        <FontAwesome5
                                            name="trash-alt"
                                            size={16}
                                            color={colors.danger}
                                        />
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 16,
    },
    head: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontFamily: font.semiBold,
        fontSize: 19,
        color: colors.ink,
    },
    headAction: {
        fontFamily: font.bold,
        fontSize: 13,
        color: colors.primary,
    },
    message: {
        fontFamily: font.regular,
        fontSize: 14,
        color: colors.inkFaint,
        textAlign: "center",
        paddingVertical: 20,
    },
    group: {
        gap: 8,
    },
    groupLabel: {
        fontFamily: font.bold,
        fontSize: 12,
        color: colors.inkFaint,
    },
    divider: {
        height: 1,
        marginLeft: 50,
        backgroundColor: colors.border,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 6,
    },
    iconBox: {
        width: 38,
        height: 38,
        alignItems: "center",
        justifyContent: "center",
    },
    rowCol: {
        flex: 1,
        gap: 2,
    },
    rowName: {
        fontFamily: font.bold,
        fontSize: 14,
        color: colors.ink,
    },
    rowDetail: {
        fontFamily: font.semiBold,
        fontSize: 13,
        color: colors.inkFaint,
    },
    rowAction: {
        padding: 6,
    },
});
