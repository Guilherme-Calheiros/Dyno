import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font } from "@/theme/tokens";

type SegmentedOption = {
    key: string;
    label: string;
};

type SegmentedControlProps = {
    options: SegmentedOption[];
    active: string;
    onChange: (key: string) => void;
};

export default function SegmentedControl({
    options,
    active,
    onChange,
}: SegmentedControlProps) {
    const activeIndex = Math.max(
        0,
        options.findIndex((opt) => opt.key === active)
    );

    return (
        <View style={styles.segmented}>
            {options.map((opt) => {
                const isActive = opt.key === active;
                return (
                    <Pressable
                        key={opt.key}
                        style={[styles.segBtn, isActive && styles.segBtnActive]}
                        onPress={() => onChange(opt.key)}
                    >
                        <Text
                            style={[
                                styles.segLabel,
                                isActive && styles.segLabelActive,
                            ]}
                        >
                            {opt.label}
                        </Text>
                    </Pressable>
                );
            })}
            <View style={styles.segDivider} />
            <View
                style={[
                    styles.segIndicator,
                    {
                        width: `${100 / options.length}%`,
                        left: `${(activeIndex * 100) / options.length}%`,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    segmented: {
        flexDirection: "row",
        position: "relative",
        height: 48,
    },
    segBtn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    segBtnActive: {},
    segLabel: {
        fontFamily: font.medium,
        fontSize: 13,
        color: colors.inkSoft,
    },
    segLabelActive: {
        fontFamily: font.semiBold,
        color: colors.primary,
    },
    segDivider: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: colors.line,
    },
    segIndicator: {
        position: "absolute",
        bottom: 0,
        left: 0,
        height: 2,
        backgroundColor: colors.primary,
    },
});