import { useState } from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, control, font, radius } from "@/theme/tokens";

export type SelectOption = {
    key: string;
    label: string;
};

type SelectProps = {
    options: SelectOption[];
    value: string;
    onChange: (key: string) => void;
    label?: string;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
};

export default function Select({
    options,
    value,
    onChange,
    label,
    placeholder = "Selecione",
    style,
}: SelectProps) {
    const [open, setOpen] = useState(false);

    const selected = options.find((opt) => opt.key === value);

    const handleSelect = (key: string) => {
        onChange(key);
        setOpen(false);
    };

    return (
        <View style={[styles.wrapper, style]}>
            {label ? <Text style={styles.label}>{label}</Text> : null}

            <Pressable
                accessibilityRole="button"
                accessibilityLabel={label ?? "Selecionar"}
                style={({ pressed }) => [
                    styles.field,
                    open && styles.fieldOpen,
                    pressed && styles.fieldPressed,
                ]}
                onPress={() => setOpen((prev) => !prev)}
            >
                <Text
                    style={[
                        styles.value,
                        !selected && styles.placeholder,
                    ]}
                    numberOfLines={1}
                >
                    {selected ? selected.label : placeholder}
                </Text>
                <FontAwesome5
                    name="chevron-down"
                    size={14}
                    color={colors.inkSoft}
                    style={[styles.chevron, open && styles.chevronOpen]}
                />
            </Pressable>

            {open && (
                <View style={styles.options}>
                    {options.map((opt) => {
                        const isSelected = opt.key === value;
                        return (
                            <Pressable
                                key={opt.key}
                                accessibilityRole="button"
                                style={[
                                    styles.option,
                                    isSelected && styles.optionSelected,
                                ]}
                                onPress={() => handleSelect(opt.key)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        isSelected && styles.optionTextSelected,
                                    ]}
                                >
                                    {opt.label}
                                </Text>
                                {isSelected ? (
                                    <FontAwesome5
                                        name="check"
                                        size={12}
                                        color={colors.primary}
                                    />
                                ) : null}
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 6,
        flexShrink: 0,
    },
    label: {
        fontFamily: font.regular,
        fontSize: 14,
        color: colors.inkSoft,
    },
    field: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        height: control.inputHeight,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: 12,
        backgroundColor: colors.surface,
    },
    fieldOpen: {
        borderColor: colors.line,
    },
    fieldPressed: {
        opacity: 0.8,
    },
    value: {
        flex: 1,
        fontFamily: font.regular,
        fontSize: 16,
        color: colors.ink,
    },
    placeholder: {
        color: colors.inkFaint,
    },
    chevron: {
        transform: [{ rotate: "0deg" }],
    },
    chevronOpen: {
        transform: [{ rotate: "180deg" }],
    },
    options: {
        width: "100%",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        overflow: "hidden",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    optionSelected: {
        backgroundColor: colors.tint,
    },
    optionText: {
        fontFamily: font.regular,
        fontSize: 15,
        color: colors.ink,
    },
    optionTextSelected: {
        fontFamily: font.semiBold,
        color: colors.primaryDeep,
    },
});