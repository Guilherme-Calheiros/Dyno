import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Sheet from "@/components/ui/Sheet";
import { colors, font } from "@/theme/tokens";

type NewProductionSheetProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: () => void;
};

export default function NewProductionSheet({
    isOpen,
    onClose,
    onCreate,
}: NewProductionSheetProps) {
    return (
        <Sheet isOpen={isOpen} onClose={onClose}>
            <View style={styles.sheetContent}>
                <Text style={styles.sheetTitle}>Nova produção</Text>
                <Text style={styles.sheetSubtitle}>Como você quer começar</Text>
                <Pressable
                    style={styles.sheetOption}
                    onPress={() => {
                        onClose();
                        onCreate();
                    }}
                >
                    <View style={styles.sheetOptionCircle}>
                        <FontAwesome5 name="plus" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.sheetOptionTextCol}>
                        <Text style={styles.sheetOptionTitle}>Criar do zero</Text>
                        <Text style={styles.sheetOptionDesc}>
                            Comece uma produção completa do início
                        </Text>
                    </View>
                </Pressable>
                <Pressable onPress={onClose}>
                    <Text style={styles.sheetCancel}>Cancelar</Text>
                </Pressable>
            </View>
        </Sheet>
    );
}

const styles = StyleSheet.create({
    sheetContent: {
        alignItems: "center",
        gap: 6,
        paddingTop: 22,
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    sheetTitle: {
        fontFamily: font.bold,
        fontSize: 22,
        color: colors.ink,
        textAlign: "center",
    },
    sheetSubtitle: {
        fontFamily: font.regular,
        fontSize: 14,
        color: colors.inkSoft,
        textAlign: "center",
        marginBottom: 6,
    },
    sheetOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        alignSelf: "stretch",
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.line,
        padding: 14,
    },
    sheetOptionCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.tint,
        alignItems: "center",
        justifyContent: "center",
    },
    sheetOptionTextCol: {
        flex: 1,
        gap: 2,
    },
    sheetOptionTitle: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.ink,
    },
    sheetOptionDesc: {
        fontFamily: font.regular,
        fontSize: 13,
        color: colors.inkSoft,
    },
    sheetCancel: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.inkSoft,
        textAlign: "center",
        paddingVertical: 8,
    },
});