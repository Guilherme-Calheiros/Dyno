import { Text, View, StyleSheet } from "react-native";
import { colors, font } from "@/theme/tokens";

export default function Recipes() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.eyebrow}>Biblioteca</Text>
                <Text style={styles.title}>Receitas</Text>
                <Text style={styles.subtitle}>Suas receitas aparecerão aqui</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 48,
        backgroundColor: colors.bg,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        gap: 8,
    },
    eyebrow: {
        fontFamily: font.bold,
        fontSize: 12,
        color: colors.primary,
        textTransform: "uppercase",
    },
    title: {
        fontFamily: font.semiBold,
        fontSize: 24,
        color: colors.ink,
    },
    subtitle: {
        fontFamily: font.medium,
        fontSize: 14,
        color: colors.inkSoft,
    },
});
