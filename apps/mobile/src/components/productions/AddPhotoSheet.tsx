import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Sheet from "@/components/ui/Sheet";
import Button from "@/components/ui/Button";
import sheetStyles from "@/components/ui/sheetStyles";
import { colors, font } from "@/theme/tokens";

type GlyphName = keyof typeof FontAwesome5.glyphMap;

export type PhotoSource = "camera" | "library";

type Option = {
    key: PhotoSource;
    icon: GlyphName;
    title: string;
    description: string;
};

const options: Option[] = [
    {
        key: "camera",
        icon: "camera",
        title: "Tirar foto",
        description: "Use a câmera do aparelho",
    },
    {
        key: "library",
        icon: "image",
        title: "Escolher da galeria",
        description: "Selecione uma foto já salva",
    },
];

type AddPhotoSheetProps = {
    isOpen: boolean;
    onClose: () => void;
    onPick: (source: PhotoSource) => void;
    loading?: boolean;
};

export default function AddPhotoSheet({
    isOpen,
    onClose,
    onPick,
    loading = false,
}: AddPhotoSheetProps) {
    const [selected, setSelected] = useState<PhotoSource>("library");

    return (
        <Sheet isOpen={isOpen} onClose={onClose}>
            <View style={[sheetStyles.content, styles.content]}>
                <Text style={sheetStyles.title}>Nova foto</Text>
                <Text style={styles.sheetSubtitle}>
                    Escolha de onde adicionar a foto
                </Text>

                {options.map((option) => {
                    const active = selected === option.key;

                    return (
                        <Pressable
                            key={option.key}
                            onPress={() => setSelected(option.key)}
                            disabled={loading}
                            accessibilityRole="radio"
                            accessibilityState={{ selected: active }}
                            style={[
                                styles.option,
                                active && styles.optionActive,
                            ]}
                        >
                            <View style={styles.iconCircle}>
                                <FontAwesome5
                                    name={option.icon}
                                    size={20}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>
                                    {option.title}
                                </Text>
                                <Text style={styles.optionDescription}>
                                    {option.description}
                                </Text>
                            </View>

                            <FontAwesome5
                                name={active ? "check-circle" : "circle"}
                                size={18}
                                color={active ? colors.primary : colors.border}
                            />
                        </Pressable>
                    );
                })}

                <Button
                    label="Adicionar foto"
                    variant="primary"
                    icon="plus"
                    disabled={loading}
                    onPress={() => {
                        onClose();
                        onPick(selected);
                    }}
                    style={styles.confirm}
                />

                <Pressable onPress={onClose} disabled={loading} hitSlop={8}>
                    <Text style={sheetStyles.cancel}>Cancelar</Text>
                </Pressable>
            </View>
        </Sheet>
    );
}

const styles = StyleSheet.create({
    content: {
        gap: 8,
    },

    sheetSubtitle: {
        fontFamily: font.regular,
        fontSize: 14,
        color: colors.inkSoft,
        textAlign: "center",
        marginBottom: 8,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    optionActive: {
        borderWidth: 2,
        borderColor: colors.primary,
    },

    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.tint,
        alignItems: "center",
        justifyContent: "center",
    },

    optionText: {
        flex: 1,
        gap: 2,
    },

    optionTitle: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.ink,
    },

    optionDescription: {
        fontFamily: font.regular,
        fontSize: 13,
        color: colors.inkSoft,
    },

    confirm: {
        marginTop: 8,
    },
});