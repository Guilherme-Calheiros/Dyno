import { StyleSheet, Text, View } from "react-native";
import IconCircleButton from "@/components/ui/IconCircleButton";
import { colors, font } from "@/theme/tokens";
import { formatBRL, parseDecimal } from "@/lib/format";
import { ProductionDetail } from "@artesaos/validation";


type Props = {
    production: ProductionDetail | null;
    loading: boolean;
    onEdit: () => void;
};

type Summary = {
    materiais: number;
    valorHora: number;
    horas: number;
    maoDeObra: number;
    margem: number;
    lucro: number;
    total: number;
};

function computeSummary(production: ProductionDetail): Summary {
    const materiais = parseDecimal(production.custoMateriais) || 0;
    const valorHora = parseDecimal(production.valorHora ?? "") || 0;
    const horas = production.tempoReal / 3600;
    const maoDeObra = horas * valorHora;
    const margem = parseDecimal(production.margemLucro ?? "") || 0;
    const custo = materiais + maoDeObra;
    const lucro = (custo * margem) / 100;
    const total = custo + lucro;
    return { materiais, valorHora, horas, maoDeObra, margem, lucro, total };
}

const formatHours = (h: number) =>
    h.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    });

export default function ProductionSummaryCard({
    production,
    loading,
    onEdit,
}: Props) {
    const summary = production ? computeSummary(production) : null;

    return (
        <View style={styles.section}>
            <View style={styles.head}>
                <Text style={styles.title}>Resumo da produção</Text>
                {production && (
                    <IconCircleButton
                        icon="pencil-alt"
                        onPress={onEdit}
                        label="Editar valores de preço"
                    />
                )}
            </View>

            <View style={styles.summaryCard}>
                <View style={styles.sumRow}>
                    <Text style={styles.sumLabel}>Materiais</Text>
                    <View style={styles.sumCol}>
                        <Text style={styles.sumValue}>
                            {summary
                                ? formatBRL(summary.materiais)
                                : "R$ 0,00"}
                        </Text>
                    </View>
                </View>

                <View style={styles.sumRow}>
                    <Text style={styles.sumLabel}>Valor da hora</Text>
                    <View style={styles.sumCol}>
                        <Text style={styles.sumValue}>
                            {summary
                                ? formatBRL(summary.valorHora)
                                : "R$ 0,00"}
                        </Text>
                    </View>
                </View>

                <View style={styles.sumRow}>
                    <Text style={styles.sumLabel}>Mão de obra</Text>
                    <View style={styles.sumCol}>
                        <Text style={styles.sumValue}>
                            {summary
                                ? formatBRL(summary.maoDeObra)
                                : "R$ 0,00"}
                        </Text>
                        <Text style={styles.sumHint}>
                            {summary
                                ? `${formatHours(summary.horas)} h × valor da hora`
                                : ""}
                        </Text>
                    </View>
                </View>

                <View style={styles.sumRow}>
                    <Text style={styles.sumLabel}>Lucro</Text>
                    <View style={styles.sumCol}>
                        <Text style={styles.sumValue}>
                            {summary ? formatBRL(summary.lucro) : "R$ 0,00"}
                        </Text>
                        <Text style={styles.sumHint}>
                            {summary
                                ? `${formatHours(summary.margem)}% do custo`
                                : ""}
                        </Text>
                    </View>
                </View>

                <View style={styles.sumDivider} />

                <View style={styles.sumRow}>
                    <Text style={styles.sumTotalLabel}>Total sugerido</Text>
                    <View style={styles.sumCol}>
                        <Text style={styles.sumTotalValue}>
                            {summary
                                ? formatBRL(summary.total)
                                : "R$ 0,00"}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 10,
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
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 16,
        gap: 10,
    },
    sumRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
    },
    sumLabel: {
        fontFamily: font.semiBold,
        fontSize: 13,
        color: colors.inkSoft,
    },
    sumCol: {
        alignItems: "flex-end",
        gap: 2,
    },
    sumValue: {
        fontFamily: font.semiBold,
        fontSize: 15,
        color: colors.ink,
    },
    sumHint: {
        fontFamily: font.regular,
        fontSize: 11,
        color: colors.inkFaint,
    },
    sumDivider: {
        height: 1,
        backgroundColor: colors.line,
    },
    sumTotalLabel: {
        fontFamily: font.bold,
        fontSize: 14,
        color: colors.ink,
    },
    sumTotalValue: {
        fontFamily: font.bold,
        fontSize: 18,
        color: colors.primaryDeep,
    },
});