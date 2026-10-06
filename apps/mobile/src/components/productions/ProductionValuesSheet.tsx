import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Sheet from "@/components/ui/Sheet";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { colors, font } from "@/theme/tokens";
import { formatBRL, parseDecimal } from "@/lib/format";
import { Production } from "@artesaos/validation";
import CurrencyInput from "react-native-currency-input"

type ValuesPatch = {
    valorHora: number;
    margemLucro: number;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    production: Production | null;
    onSave: (values: ValuesPatch) => Promise<void>;
};

export default function ProductionValuesSheet({
    isOpen,
    onClose,
    production,
    onSave,
}: Props) {
    const [valorHora, setValorHora] = useState<number | null>(0);
    const [margemLucro, setMargemLucro] = useState("");
    const [saving, setSaving] = useState(false);

    const formatPrefill = (value: string | null | undefined) => {
        if (!value) return "";
        const num = parseDecimal(value);
        return num > 0
            ? num.toLocaleString("pt-BR", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
              })
            : "";
    };

    useEffect(() => {
        if (isOpen) {
            const hora = parseDecimal(production?.valorHora);
            setValorHora(hora > 0 ? hora : null);
            setMargemLucro(formatPrefill(production?.margemLucro));
        }
    }, [isOpen, production]);

    const handleSave = async () => {
        if (saving) return;

        const hora = valorHora ?? 0;
        const margem = parseDecimal(margemLucro);

        setSaving(true);
        try {
            await onSave({ valorHora: hora, margemLucro: margem });
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <Sheet isOpen={isOpen} onClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Valores de preço</Text>
                    <Text style={styles.subtitle}>
                        Defina os valores usados no cálculo do preço sugerido
                    </Text>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Como é calculado</Text>
                        <Text style={styles.formulaText}>
                            Preço = (materiais + horas × preço/hora) + lucro sobre
                            o custo
                        </Text>
                    </View>

                    <Input
                        label="Preço dos materiais"
                        value={formatBRL(parseDecimal(production?.custoMateriais ?? "0"))}
                        editable={false}
                        rightIcon={
                            <FontAwesome5
                                name="lock"
                                size={14}
                                color={colors.inkFaint}
                            />
                        }
                    />

                    <CurrencyInput
                        value={valorHora}
                        onChangeValue={setValorHora}
                        delimiter="."
                        separator=","
                        precision={2}
                        minValue={0}
                        placeholder="0,00"
                        placeholderTextColor={colors.inkFaint}
                        renderTextInput={(textInputProps) => (
                            <Input
                                {...textInputProps}
                                label="Preço por hora"
                                prefix={
                                    <Text style={styles.currencyPrefix}>R$</Text>
                                }
                                rightIcon={
                                    <FontAwesome5
                                        name="clock"
                                        size={14}
                                        color={colors.inkFaint}
                                    />
                                }
                            />
                        )}
                    />
                    <Text style={styles.fieldHint}>
                        Quanto você cobra por hora de trabalho
                    </Text>

                    <Input
                        label="Lucro desejado (%)"
                        value={margemLucro}
                        onChangeText={setMargemLucro}
                        keyboardType="decimal-pad"
                        placeholder="0"
                        placeholderTextColor={colors.inkFaint}
                        rightIcon={
                            <FontAwesome5
                                name="percent"
                                size={14}
                                color={colors.inkFaint}
                            />
                        }
                    />
                    <Text style={styles.fieldHint}>
                        Margem de lucro sobre o custo total
                    </Text>

                    <View style={styles.actions}>
                        <Button
                            label="Salvar valores"
                            disabled={saving}
                            onPress={handleSave}
                        />
                        <Pressable
                            onPress={onClose}
                            disabled={saving}
                            accessibilityRole="button"
                            accessibilityLabel="Cancelar"
                        >
                            <Text style={styles.cancel}>Cancelar</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Sheet>
    );
}

const styles = StyleSheet.create({
    content: {
        gap: 6,
        paddingTop: 22,
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    title: {
        fontFamily: font.bold,
        fontSize: 22,
        color: colors.ink,
    },
    subtitle: {
        fontFamily: font.regular,
        fontSize: 14,
        lineHeight: 20,
        color: colors.inkSoft,
        marginBottom: 6,
    },
    formulaCard: {
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 12,
        gap: 4,
        marginBottom: 6,
    },
    formulaTitle: {
        fontFamily: font.semiBold,
        fontSize: 13,
        color: colors.ink,
    },
    formulaText: {
        fontFamily: font.regular,
        fontSize: 13,
        lineHeight: 19,
        color: colors.inkSoft,
    },
    fieldHint: {
        fontFamily: font.regular,
        fontSize: 12,
        lineHeight: 17,
        color: colors.inkFaint,
        marginBottom: 4,
    },
    currencyPrefix: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.inkSoft,
    },
    actions: {
        gap: 10,
        marginTop: 12,
    },
    cancel: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.inkSoft,
        textAlign: "center",
        paddingVertical: 8,
    },
});