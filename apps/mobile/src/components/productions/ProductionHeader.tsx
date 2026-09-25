import { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import IconCircleButton from "@/components/ui/IconCircleButton";
import { colors, font, radius } from "@/theme/tokens";
import { ProductionDetail } from "@artesaos/validation";


type Props = {
    production: ProductionDetail | null;
    loading: boolean;
    onRename: (nome: string) => Promise<void>;
};

export default function ProductionHeader({
    production,
    loading,
    onRename,
}: Props) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState("");
    const inputRef = useRef<TextInput>(null);

    const commit = () => {
        const nome = draft.trim();

        if (!nome || !production || nome === production.nome) {
            setEditing(false);
            setDraft(production?.nome ?? "");
            return;
        }

        setEditing(false);
        void onRename(nome);
    };

    const startEditing = () => {
        if (!production) return;
        setDraft(production.nome);
        setEditing(true);
        requestAnimationFrame(() => inputRef.current?.focus());
    };

    return (
        <View style={styles.headCol}>
            <View style={styles.titleRow}>
                {editing ? (
                    <>
                        <View style={styles.nameField}>
                            <TextInput
                                ref={inputRef}
                                style={styles.nameInput}
                                value={draft}
                                onChangeText={setDraft}
                                autoFocus
                                maxLength={80}
                                returnKeyType="done"
                                selectionColor={colors.primary}
                                placeholder="Nome da produção"
                                placeholderTextColor={colors.inkFaint}
                                onSubmitEditing={commit}
                                onBlur={commit}
                                accessibilityLabel="Nome da produção"
                            />
                        </View>
                        <IconCircleButton
                            icon="check"
                            filled
                            onPress={commit}
                            label="Salvar nome"
                        />
                    </>
                ) : (
                    <>
                        <Text style={styles.headTitle} numberOfLines={1}>
                            {loading
                                ? "Carregando…"
                                : production?.nome ?? "Produção"}
                        </Text>
                        {production && (
                            <IconCircleButton
                                icon="pencil-alt"
                                onPress={startEditing}
                                label="Editar nome"
                            />
                        )}
                    </>
                )}
            </View>
            <Text style={styles.headSub}>
                {loading
                    ? "Receita: —"
                    : `Receita: ${production?.receitaNome ?? "Sem receita"}`}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headCol: {
        gap: 2,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    nameField: {
        flex: 1,
        height: 36,
        minWidth: 0,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.surface,
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    nameInput: {
        fontFamily: font.semiBold,
        fontSize: 18,
        color: colors.ink,
        padding: 0,
    },
    headTitle: {
        fontFamily: font.semiBold,
        fontSize: 22,
        color: colors.ink,
        flexShrink: 1,
    },
    headSub: {
        fontFamily: font.semiBold,
        fontSize: 12,
        color: colors.inkSoft,
    },
});