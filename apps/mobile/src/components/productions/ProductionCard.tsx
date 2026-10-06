import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { colors, font } from "@/theme/tokens";
import { formatTime, formatDate } from "@/lib/format";
import { Production } from "@artesaos/validation";

type ProductionCardProps = {
    production: Production;
    onPress: () => void;
};

export default function ProductionCard({
    production,
    onPress,
}: ProductionCardProps) {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            {production.capa ? (
                <Image
                    source={{ uri: production.capa }}
                    style={styles.cardImage}
                    contentFit="cover"
                    transition={200}
                />
            ) : null}
            <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {production.nome}
                    </Text>
                    <FontAwesome5
                        name="chevron-right"
                        size={14}
                        color={colors.inkFaint}
                    />
                </View>
                <View style={styles.statusRow}>
                    <View
                        style={[
                            styles.statusDot,
                            production.status === "concluido"
                                ? styles.statusDotDone
                                : styles.statusDotActive,
                        ]}
                    />
                    <Text style={styles.statusText}>
                        {production.status === "concluido"
                            ? "Concluída"
                            : "Em andamento"}
                    </Text>
                </View>
                <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                        <FontAwesome5
                            name="clock"
                            size={12}
                            color={colors.inkFaint}
                        />
                        <Text style={styles.metaText}>
                            {formatTime(production.tempoReal)}
                        </Text>
                    </View>
                    <View style={styles.metaItem}>
                        <FontAwesome5
                            name="calendar-alt"
                            size={12}
                            color={colors.inkFaint}
                        />
                        <Text style={styles.metaText}>
                            {production.status === "concluido" &&
                            production.finalizadoEm
                                ? formatDate(production.finalizadoEm)
                                : formatDate(production.iniciadoEm)}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.line,
        padding: 16,
        gap: 12,
    },
    cardImage: {
        width: 96,
        height: 96,
        borderRadius: 10,
    },
    cardContent: {
        flex: 1,
        gap: 8,
    },
    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        fontFamily: font.semiBold,
        fontSize: 17,
        color: colors.ink,
        flex: 1,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 999,
    },
    statusDotActive: {
        backgroundColor: colors.primary,
    },
    statusDotDone: {
        backgroundColor: "#5f7a54",
    },
    statusText: {
        fontFamily: font.semiBold,
        fontSize: 13,
        color: colors.inkSoft,
    },
    cardMeta: {
        flexDirection: "row",
        gap: 16,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    metaText: {
        fontFamily: font.bold,
        fontSize: 12,
        color: colors.inkSoft,
    },
});