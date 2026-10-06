import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { colors, font } from "@/theme/tokens";
import { MAX_FOTOS_PRODUCAO, ProductionFoto } from "@artesaos/validation";

const TILE_SIZE = 96;

type ProductionPhotosCardProps = {
    fotos: ProductionFoto[];
    loading?: boolean;
    onAdd: () => void;
    onPressPhoto: (index: number) => void;
};

export default function ProductionPhotosCard({
    fotos,
    loading = false,
    onAdd,
    onPressPhoto,
}: ProductionPhotosCardProps) {
    const atLimit = fotos.length >= MAX_FOTOS_PRODUCAO;

    return (
        <View style={styles.section}>
            <View style={styles.head}>
                <Text style={styles.title}>Fotos da peça</Text>

                <Pressable
                    onPress={onAdd}
                    disabled={loading}
                    accessibilityRole="button"
                    accessibilityLabel={
                        atLimit
                            ? `Limite de ${MAX_FOTOS_PRODUCAO} fotos atingido`
                            : "Adicionar foto"
                    }
                    hitSlop={8}
                >
                    <Text
                        style={[
                            styles.add,
                            atLimit && styles.addDisabled,
                        ]}
                    >
                        Adicionar
                    </Text>
                </Pressable>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
            >
                {fotos.map((foto, index) => (
                    <Pressable
                        key={foto.id}
                        onPress={() => onPressPhoto(index)}
                        disabled={loading}
                        accessibilityRole="imagebutton"
                        accessibilityLabel={
                            foto.capa
                                ? `Foto ${index + 1}, capa da produção`
                                : `Foto ${index + 1}`
                        }
                        style={({ pressed }) => [
                            styles.tile,
                            pressed && styles.tilePressed,
                        ]}
                    >
                        <Image
                            source={{ uri: foto.caminho }}
                            style={styles.image}
                            contentFit="cover"
                            transition={200}
                        />

                        {foto.capa ? (
                            <View style={styles.capaBadge}>
                                <Text style={styles.capaLabel}>Capa</Text>
                            </View>
                        ) : null}
                    </Pressable>
                ))}

                {!atLimit ? (
                    <Pressable
                        onPress={onAdd}
                        disabled={loading}
                        accessibilityRole="button"
                        accessibilityLabel="Adicionar foto"
                        style={({ pressed }) => [
                            styles.addTile,
                            pressed && styles.tilePressed,
                        ]}
                    >
                        <FontAwesome5
                            name="image"
                            size={20}
                            color={colors.primary}
                        />
                        <Text style={styles.addTileLabel}>Adicionar</Text>
                    </Pressable>
                ) : null}
            </ScrollView>
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

    add: {
        fontFamily: font.bold,
        fontSize: 13,
        color: colors.primary,
    },

    addDisabled: {
        color: colors.inkFaint,
    },

    row: {
        flexDirection: "row",
        gap: 10,
        paddingRight: 20,
    },

    tile: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: colors.tint,
    },

    tilePressed: {
        opacity: 0.75,
    },

    image: {
        width: TILE_SIZE,
        height: TILE_SIZE,
    },

    capaBadge: {
        position: "absolute",
        top: 6,
        left: 6,
        backgroundColor: colors.surface,
        borderRadius: 999,
        paddingVertical: 5,
        paddingHorizontal: 8,
        shadowColor: "#33291F",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.13,
        shadowRadius: 4,
        elevation: 2,
    },

    capaLabel: {
        fontFamily: font.bold,
        fontSize: 9,
        color: colors.primaryDeep,
    },

    addTile: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.line,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },

    addTileLabel: {
        fontFamily: font.semiBold,
        fontSize: 11,
        color: colors.primary,
    },
});