import { StyleSheet } from "react-native";
import { colors, font } from "@/theme/tokens";

export const sheetStyles = StyleSheet.create({
    content: {
        paddingTop: 22,
        paddingHorizontal: 20,
        paddingBottom: 24,
    },

    title: {
        fontFamily: font.bold,
        fontSize: 22,
        color: colors.ink,
        textAlign: "center",
        marginBottom: 6,
    },

    cancel: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.inkSoft,
        textAlign: "center",
        paddingVertical: 8,
    },
});

export default sheetStyles;