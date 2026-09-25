import { StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, font } from "@/theme/tokens";
import { formatDate, formatTime } from "@/lib/format";
import { ProductionDetail } from "@artesaos/validation";


type Props = {
    production: ProductionDetail | null;
    loading: boolean;
};

export default function ProductionStatusCard({ production, loading }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.iconBox}>
                <FontAwesome5 name="play" size={20} color={colors.primary} />
            </View>
            {loading ? (
                <>
                    <Text style={styles.emptyTitle}>Carregando produção…</Text>
                    <Text style={styles.emptySub}>
                        Buscando os dados da produção.
                    </Text>
                </>
            ) : production ? (
                <>
                    <Text style={styles.emptyTitle}>
                        {production.status === "concluido"
                            ? "Produção concluída"
                            : "Produção em andamento"}
                    </Text>
                    <Text style={styles.emptySub}>
                        Tempo registrado: {formatTime(production.tempoReal)}
                    </Text>
                    <Text style={styles.emptySub}>
                        {production.status === "concluido" &&
                        production.finalizadoEm
                            ? `Concluída em ${formatDate(production.finalizadoEm)}`
                            : `Iniciada em ${formatDate(production.iniciadoEm)}`}
                    </Text>
                </>
            ) : (
                <>
                    <Text style={styles.emptyTitle}>
                        Produção não encontrada
                    </Text>
                    <Text style={styles.emptySub}>
                        Não foi possível carregar os dados desta produção.
                    </Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        alignItems: "center",
        gap: 10,
        padding: 26,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 999,
        backgroundColor: colors.tint,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyTitle: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.ink,
        textAlign: "center",
    },
    emptySub: {
        fontFamily: font.regular,
        fontSize: 13,
        lineHeight: 19,
        color: colors.inkSoft,
        textAlign: "center",
    },
});