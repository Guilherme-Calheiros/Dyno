import { Pressable, StyleSheet, View } from "react-native";
import { ImageBackground } from "expo-image";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "@/theme/tokens";

type Props = {
    cover: string | null;
    topInset: number;
    onBack: () => void;
    onMore: () => void;
};

export default function DetailHero({
    cover,
    topInset,
    onBack,
    onMore,
}: Props) {
    const hasCover = !!cover;

    return (
        <View style={styles.hero}>
            {hasCover ? (
                <ImageBackground
                    source={{ uri: cover ?? undefined }}
                    style={styles.heroFill}
                    imageStyle={styles.heroImage}
                    contentFit="cover"
                    transition={200}
                />
            ) : (
                <View style={[styles.heroFill, styles.heroPlaceholder]} />
            )}

            <View style={[styles.heroTop, { paddingTop: topInset + 17 }]}>
                <Pressable
                    style={styles.heroBtn}
                    onPress={onBack}
                    accessibilityRole="button"
                    accessibilityLabel="Voltar"
                >
                    <FontAwesome5
                        name="arrow-left"
                        size={18}
                        color={colors.ink}
                    />
                </Pressable>

                <Pressable
                    style={styles.heroBtn}
                    onPress={onMore}
                    accessibilityRole="button"
                    accessibilityLabel="Mais opções"
                >
                    <FontAwesome5
                        name="ellipsis-h"
                        size={18}
                        color={colors.ink}
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    hero: {
        width: "100%",
        height: 250,
    },
    heroFill: {
        ...StyleSheet.absoluteFill,
    },
    heroImage: {
        width: "100%",
        height: "100%",
    },
    heroPlaceholder: {
        backgroundColor: colors.primary,
    },
    heroTop: {
        position: "absolute",
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    heroBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },
});