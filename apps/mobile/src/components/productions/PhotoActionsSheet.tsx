import { Pressable, StyleSheet, Text, View } from "react-native";
import Sheet from "@/components/ui/Sheet";
import SheetOption from "@/components/ui/SheetOption";
import sheetStyles from "@/components/ui/sheetStyles";

type PhotoActionsSheetProps = {
    isOpen: boolean;
    onClose: () => void;
    onSetCover: () => void;
    onDelete: () => void;
    isCover?: boolean;
};

export default function PhotoActionsSheet({
    isOpen,
    onClose,
    onSetCover,
    onDelete,
    isCover = false,
}: PhotoActionsSheetProps) {
    return (
        <Sheet isOpen={isOpen} onClose={onClose}>
            <View style={[sheetStyles.content, styles.content]}>
                <Text style={sheetStyles.title}>Ações da foto</Text>

                {isCover ? null : (
                    <SheetOption
                        icon="star"
                        label="Tornar capa"
                        tone="neutral"
                        onPress={() => {
                            onClose();
                            onSetCover();
                        }}
                    />
                )}

                <SheetOption
                    icon="trash-alt"
                    label="Excluir foto"
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