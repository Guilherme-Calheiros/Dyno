import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import IconCircleButton from "@/components/ui/IconCircleButton";
import { colors, font } from "@/theme/tokens";
import { ProductionDetail } from "@artesaos/validation";

type Props = {
    production: ProductionDetail | null;
    loading: boolean;
    onSave: (descricao: string) => Promise<void>;
};

export default function ProductionDescriptionCard({
    production,
    loading,
    onSave,
}: Props) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState("");
    const inputRef = useRef<TextInput>(null);

    const commit = () => {
        const descricao = draft.trim();

        if (!production || descricao === (production.descricao ?? "")) {
            setEditing(false);
            setDraft(production?.descricao ?? "");
            return;
        }

        setEditing(false);
        void onSave(descricao);
    };

    const startEditing = () => {
        if (!production) return;
        setDraft(production.descricao ?? "");
        setEditing(true);
        requestAnimationFrame(() => inputRef.current?.focus());
    };

    return (
        <View style={styles.sobreCard}>
            <View style={styles.sobreHead}>
                <Text style={styles.sobreTitle}>Descrição</Text>
                {production &&
                    (editing ? (
                        <IconCircleButton
                            icon="check"
                            filled
                            onPress={commit}
                            label="Salvar descrição"
                        />
                    ) : (
                        <Pressable
                            onPress={startEditing}
                            accessibilityRole="button"
                            accessibilityLabel="Editar descrição"
                        >
                            <Text style={styles.sobreEdit}>Editar</Text>
                        </Pressable>
                    ))}
            </View>

            <View
                style={[styles.descField, editing && styles.descFieldEditing]}
            >
                {editing ? (
                    <TextInput
                        ref={inputRef}
                        style={styles.descInput}
                        value={draft}
                        onChangeText={setDraft}
                        multiline
                        autoFocus
                        maxLength={500}
                        selectionColor={colors.primary}
                        placeholder="Inserir descrição"
                        placeholderTextColor={colors.inkFaint}
                        onSubmitEditing={commit}
                        onBlur={commit}
                        accessibilityLabel="Descrição da produção"
                    />
                ) : (
                    <Text
                        style={[
                            styles.descValue,
                            !production?.descricao?.trim() &&
                                styles.descPlaceholder,
                        ]}
                    >
                        {loading
                            ? "Carregando…"
                            : production?.descricao?.trim()
                              ? production.descricao
                              : "Inserir descrição"}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sobreCard: {
        gap: 10,
    },
    sobreHead: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sobreTitle: {
        fontFamily: font.semiBold,
        fontSize: 19,
        color: colors.ink,
    },
    sobreEdit: {
        fontFamily: font.semiBold,
        fontSize: 13,
        color: colors.primary,
    },
    descField: {
        height: 104,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.bg,
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: "flex-start",
    },
    descFieldEditing: {
        borderColor: colors.primary,
        backgroundColor: colors.surface,
    },
    descInput: {
        flex: 1,
        fontFamily: font.regular,
        fontSize: 14,
        lineHeight: 20,
        color: colors.ink,
        padding: 0,
        textAlignVertical: "top",
    },
    descValue: {
        fontFamily: font.regular,
        fontSize: 14,
        lineHeight: 20,
        color: colors.inkSoft,
    },
    descPlaceholder: {
        color: colors.inkFaint,
    },
});