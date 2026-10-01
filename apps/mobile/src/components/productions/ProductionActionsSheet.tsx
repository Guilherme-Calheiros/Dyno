import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Sheet from "@/components/ui/Sheet";
import { colors, font } from "@/theme/tokens";

type ProductionActionsSheetProps = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    onReabrir?: () => void;
};

export default function ProductionActionsSheet({
    isOpen,
    onClose,
    onDelete,
    onReabrir,
}: ProductionActionsSheetProps) {
    return (
        <Sheet isOpen={isOpen} onClose={onClose}>
            <View style={styles.sheetContent}>
                <Text style={styles.sheetTitle}>Ações da produção</Text>
                {onReabrir ? (
                    <Pressable
                        style={({ pressed }) => [
                            styles.sheetOption,
                            pressed && styles.sheetOptionPressed,
                        ]}
                        onPress={() => {
                            onClose();
                            onReabrir();
                        }}
                    >
                        <FontAwesome5
                            name="undo"
                            size={16}
                            color={colors.inkSoft}
                        />
                        <Text style={[styles.sheetOptionLabel, styles.sheetOptionLabelNeutral]}>
                            Reabrir produção
                        </Text>
                    </Pressable>
                ) : null}
                <Pressable
                    style={({ pressed }) => [
                        styles.sheetOption,
                        pressed && styles.sheetOptionPressed,
                    ]}
                    onPress={() => {
                        onClose();
                        onDelete();
                    }}
                >
                    <FontAwesome5 name="trash-alt" size={16} color={colors.danger} />
                    <Text style={styles.sheetOptionLabel}>Excluir produção</Text>
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
        marginBottom: 6,
    },
    sheetOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        alignSelf: "stretch",
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
    },
    sheetOptionPressed: {
        backgroundColor: colors.rose,
    },
    sheetOptionLabel: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.danger,
    },
    sheetOptionLabelNeutral: {
        color: colors.ink,
    },
    sheetCancel: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.inkSoft,
        textAlign: "center",
        paddingVertical: 8,
    },
});