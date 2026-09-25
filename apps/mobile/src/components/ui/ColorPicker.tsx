import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Input from "@/components/ui/Input";
import { colors, font } from "@/theme/tokens";

const PRESET_COLORS = [
    "#ffffff",
    "#1c1917",
    "#9ca3af",
    "#e7d6bb",
    "#8c5a35",
    "#d64545",
    "#7a1f3d",
    "#f4a8c2",
    "#f27f3d",
    "#f4d03f",
    "#7eb356",
    "#58b2a5",
    "#4a90d9",
    "#5b6db8",
    "#8e5bd6",
];

type Props = {
    value: string;
    onChange: (color: string) => void;
};

export default function ColorPicker({ value, onChange }: Props) {
    const [customActive, setCustomActive] = useState(
        value.length > 0 && !PRESET_COLORS.includes(value.toLowerCase())
    );

    const handleCustomToggle = () => {
        const next = !customActive;
        setCustomActive(next);
        if (next && !value) {
            onChange("#8e5bd6");
        }
    };

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>Cor</Text>

            <View style={styles.grid}>
                {PRESET_COLORS.map((color) => {
                    const isActive =
                        !customActive &&
                        value.toLowerCase() === color.toLowerCase();
                    return (
                        <Pressable
                            key={color}
                            accessibilityRole="button"
                            accessibilityLabel={`Cor ${color}`}
                            style={[
                                styles.swatch,
                                { backgroundColor: color },
                                isActive && styles.swatchActive,
                            ]}
                            onPress={() => {
                                setCustomActive(false);
                                onChange(color);
                            }}
                        />
                    );
                })}

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Cor personalizada"
                    style={[
                        styles.swatch,
                        styles.customSwatch,
                        customActive && styles.swatchActive,
                    ]}
                    onPress={handleCustomToggle}
                >
                    <Text
                        style={[
                            styles.customPlus,
                            customActive && styles.customPlusActive,
                        ]}
                    >
                        +
                    </Text>
                </Pressable>
            </View>

            {customActive && (
                <Input
                    label="Cor personalizada (hex)"
                    value={value}
                    onChangeText={(text) => {
                        const normalized = text.trim();
                        onChange(
                            /^#/.test(normalized)
                                ? normalized
                                : `#${normalized}`
                        );
                    }}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    placeholder="#RRGGBB"
                    placeholderTextColor={colors.inkFaint}
                    rightIcon={
                        <View
                            style={[
                                styles.preview,
                                { backgroundColor: value },
                            ]}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 10,
    },
    label: {
        fontFamily: font.semiBold,
        fontSize: 13,
        color: colors.ink,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    swatch: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.border,
    },
    swatchActive: {
        borderColor: colors.primary,
        borderWidth: 3,
    },
    customSwatch: {
        backgroundColor: colors.bg,
        alignItems: "center",
        justifyContent: "center",
    },
    customPlus: {
        fontFamily: font.semiBold,
        fontSize: 20,
        color: colors.inkSoft,
    },
    customPlusActive: {
        color: colors.primary,
    },
    preview: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
});