import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ColorPickerLib, {
    Panel1,
    HueSlider,
    Preview,
} from "reanimated-color-picker";
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

const isPresetColor = (color: string) =>
    PRESET_COLORS.includes(color.toLowerCase());

export default function ColorPicker({ value, onChange }: Props) {
    const [customActive, setCustomActive] = useState(
        () => value.length > 0 && !isPresetColor(value)
    );

    const pickedRef = useRef<string | null>(null);

    useEffect(() => {
        const picked = pickedRef.current;
        pickedRef.current = null;

        if (picked !== null && picked === value) {
            return;
        }

        setCustomActive(value.length > 0 && !isPresetColor(value));
    }, [value]);

    const commit = (color: string) => {
        pickedRef.current = color;
        onChange(color);
    };

    const handleCustomToggle = () => {
        const next = !customActive;

        setCustomActive(next);

        if (next && !value) {
            commit("#8e5bd6");
        }
    };

    const handleColorComplete = (result: { hex: string }) => {
        commit(result.hex);
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
                                commit(color);
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
                <View style={styles.customPicker}>
                    <ColorPickerLib
                        value={value || "#8e5bd6"}
                        onCompleteJS={handleColorComplete}
                        enableColorAnnouncements={false}
                    >
                        <Preview style={styles.preview} />

                        <Panel1 style={styles.panel} />

                        <HueSlider style={styles.hueSlider} />
                    </ColorPickerLib>
                </View>
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

    customPicker: {
        gap: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    preview: {
        height: 36,
        borderRadius: 8,
    },

    panel: {
        height: 180,
        borderRadius: 10,
    },

    hueSlider: {
        height: 24,
        borderRadius: 12,
    },
});