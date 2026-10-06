import { Pressable, StyleSheet, Text, View } from "react-native";
import Sheet from "@/components/ui/Sheet";
import SheetOption from "@/components/ui/SheetOption";
import sheetStyles from "@/components/ui/sheetStyles";

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
            <View style={[sheetStyles.content, styles.content]}>
                <Text style={sheetStyles.title}>Ações da produção</Text>

                {onReabrir ? (
                    <SheetOption
                        icon="undo"
                        label="Reabrir produção"
                        tone="neutral"
                        onPress={() => {
                            onClose();
                            onReabrir();
                        }}
                    />
                ) : null}

                <SheetOption
                    icon="trash-alt"
                    label="Excluir produção"
                    onPress={() => {
                        onClose();
                        onDelete();
                    }}
                />

                <Pressable onPress={onClose}>
                    <Text style={sheetStyles.cancel}>Cancelar</Text>
                </Pressable>
            </View>
        </Sheet>
    );
}

const styles = StyleSheet.create({
    content: {
        alignItems: "center",
        gap: 6,
    },
});