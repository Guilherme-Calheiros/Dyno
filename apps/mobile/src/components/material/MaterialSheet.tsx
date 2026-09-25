import { useState } from "react";
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
import Select from "@/components/ui/Select";
import ColorPicker from "@/components/ui/ColorPicker";

import { colors, font } from "@/theme/tokens";
import { parseDecimal } from "@/lib/format";

import { QuantidadeUnidade, type MaterialInput } from "@artesaos/validation";
import CurrencyInput from "react-native-currency-input";
import { useAgulhas } from "@/hooks/useAgulhas";
import YarnBallIcon from "../ui/YarnBallIcon";
import CrochetIcon from "../ui/CrochetIcon";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (material: MaterialInput) => Promise<void>;
};

type MaterialType = MaterialInput["type"]

const materialUnits = [
    { key: "unidade", label: "Unidade" },
    { key: "peso", label: "Peso (g)" },
    { key: "comprimento", label: "Comprimento (m)" },
];

const noveloUnits = [
    { key: "peso", label: "Peso (g)" },
    { key: "comprimento", label: "Comprimento (m)" },
];

export default function MaterialSheet({
    isOpen,
    onClose,
    onSubmit,
}: Props) {
    const [saving, setSaving] = useState(false);

    const [type, setType] = useState<MaterialType>("material");
    const [nome, setNome] = useState("");
    const [quantidadeTotal, setQuantidadeTotal] = useState("");
    const [quantidadeUnidade, setQuantidadeUnidade] = useState<QuantidadeUnidade>("unidade");
    const [quantidadeUtilizada, setQuantidadeUtilizada] = useState("");
    const [custoAdquirido, setCustoAdquirido] = useState<number | null>(null);

    const [cor, setCor] = useState("");
    const [peso, setPeso] = useState("");
    const [comprimento, setComprimento] = useState("");

    const [agulhaId, setAgulhaId] = useState<number | null>(null);

    const { agulhas, loading: loadingAgulhas } = useAgulhas(
        isOpen && type === "agulha"
    );

    const defaultUnidade = (next: MaterialType): QuantidadeUnidade =>
        next === "novelo" ? "peso" : "unidade";

    const resetForm = (forType: MaterialType = type) => {
        setNome("");
        setQuantidadeTotal("");
        setQuantidadeUnidade(defaultUnidade(forType));
        setQuantidadeUtilizada("");
        setCustoAdquirido(null);
        setCor("");
        setPeso("");
        setComprimento("");
        setAgulhaId(null);
    };

    const switchType = (next: MaterialType) => {
        if (next === type) return;
        resetForm(next);
        setType(next);
    };

    const handleSubmit = async () => {
        if (saving) return;

        setSaving(true);

        try {
            switch(type){
                case "material": {
                    const material: MaterialInput = {
                        type: "material",
                        nome: nome.trim(),
                        quantidadeTotal: parseDecimal(quantidadeTotal),
                        quantidadeUnidade,
                        quantidadeUtilizada: parseDecimal(quantidadeUtilizada),
                        custoAdquirido: custoAdquirido ?? 0,
                    }

                    await onSubmit(material);
                    onClose();
                    resetForm();
                    break
                }
    
                case "novelo":{
                    const novelo: MaterialInput = {
                        type: "novelo",
                        nome: nome.trim(),
                        cor: cor.trim(),
                        peso: parseDecimal(peso),
                        comprimento: parseDecimal(comprimento),
                        quantidadeUtilizada: parseDecimal(quantidadeUtilizada),
                        quantidadeUnidade: quantidadeUnidade as "peso" | "comprimento",
                        custoAdquirido: custoAdquirido ?? 0,
                    }

                    await onSubmit(novelo);
                    onClose();
                    resetForm();
                    break
                }
    
                case "agulha":{
                    if(agulhaId == null) return;

                    const agulha: MaterialInput = {
                        type: "agulha",
                        agulhaId: agulhaId
                    }

                    await onSubmit(agulha);
                    onClose();
                    resetForm();
                    break
                }
            }
        } finally {
            setSaving(false);
        }

    }

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
                    <Text style={styles.title}>Adicionar material</Text>

                    <Text style={styles.subtitle}>
                        Adicione um material utilizado nesta produção
                    </Text>

                    <View style={styles.typeSelector}>
                        <Pressable
                            style={[
                                styles.typeOption,
                                type === "material" && styles.typeOptionActive,
                            ]}
                            onPress={() => switchType("material")}
                        >
                            <FontAwesome5
                                name="box"
                                size={14}
                                color={type === "material" ? colors.primary : colors.inkSoft}
                            />
                            <Text
                                style={[
                                    styles.typeText,
                                    type === "material" && styles.typeTextActive,
                                ]}
                            >
                                Material
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.typeOption,
                                type === "novelo" && styles.typeOptionActive,
                            ]}
                            onPress={() => switchType("novelo")}
                        >
                            <YarnBallIcon
                                size={28}
                                color={type === "novelo" ? colors.primary : colors.inkSoft}
                            />
                            <Text
                                style={[
                                    styles.typeText,
                                    type === "novelo" && styles.typeTextActive,
                                ]}
                            >
                                Novelo
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.typeOption,
                                type === "agulha" && styles.typeOptionActive,
                            ]}
                            onPress={() => switchType("agulha")}
                        >
                            <CrochetIcon
                                size={22}
                                color={type === "agulha" ? colors.primary : colors.inkSoft}
                            />
                            <Text
                                style={[
                                    styles.typeText,
                                    type === "agulha" && styles.typeTextActive,
                                ]}
                            >
                                Agulha
                            </Text>
                        </Pressable>
                    </View>

                    {type === "material" || type === "novelo" ? (
                        <>
                            <Input
                                label="Nome"
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Nome do material"
                                placeholderTextColor={colors.inkFaint}
                            />

                            {type === "novelo" && (
                                <>
                                    <ColorPicker
                                        value={cor}
                                        onChange={setCor}
                                    />

                                    <View style={styles.row}>
                                        <View style={styles.rowItem}>
                                            <Input
                                                label="Peso"
                                                value={peso}
                                                onChangeText={setPeso}
                                                keyboardType="decimal-pad"
                                                placeholder="0"
                                                placeholderTextColor={colors.inkFaint}
                                                rightIcon={
                                                    <Text style={styles.suffix}>g</Text>
                                                }
                                            />
                                        </View>
                                        <View style={styles.rowItem}>
                                            <Input
                                                label="Comprimento"
                                                value={comprimento}
                                                onChangeText={setComprimento}
                                                keyboardType="decimal-pad"
                                                placeholder="0"
                                                placeholderTextColor={colors.inkFaint}
                                                rightIcon={
                                                    <Text style={styles.suffix}>m</Text>
                                                }
                                            />
                                        </View>
                                    </View>
                                </>
                            )}

                            {type === "material" && (
                                <>
                                    <View style={styles.row}>
                                        <View style={styles.rowItem}>
                                            <Input
                                                label="Quantidade no pacote"
                                                value={quantidadeTotal}
                                                onChangeText={setQuantidadeTotal}
                                                keyboardType="decimal-pad"
                                                placeholder="0"
                                                placeholderTextColor={colors.inkFaint}
                                                rightIcon={
                                                    quantidadeUnidade !== "unidade" ? (
                                                        <Text style={styles.suffix}>
                                                            {quantidadeUnidade === "peso"
                                                                ? "g"
                                                                : "m"}
                                                        </Text>
                                                    ) : undefined
                                                }
                                            />
                                        </View>
                                        <Select
                                            style={styles.unitSelect}
                                            label="Unidade"
                                            options={materialUnits}
                                            value={quantidadeUnidade}
                                            onChange={(key) =>
                                                setQuantidadeUnidade(key as QuantidadeUnidade)
                                            }
                                        />
                                    </View>
                                </>
                            )}

                            <CurrencyInput
                                value={custoAdquirido}
                                onChangeValue={setCustoAdquirido}
                                delimiter="."
                                separator=","
                                precision={2}
                                minValue={0}
                                placeholder="0,00"
                                placeholderTextColor={colors.inkFaint}
                                renderTextInput={(textInputProps) => (
                                    <Input
                                        {...textInputProps}
                                        label={
                                            type === "novelo"
                                                ? "Custo do novelo"
                                                : "Custo do pacote"
                                        }
                                        prefix={
                                            <Text style={styles.currencyPrefix}>R$</Text>
                                        }
                                    />
                                )}
                            />

                            {type === "novelo" && (
                                <View style={styles.row}>
                                    <View style={styles.rowItem}>
                                        <Input
                                            label="Quantidade utilizada"
                                            value={quantidadeUtilizada}
                                            onChangeText={setQuantidadeUtilizada}
                                            keyboardType="decimal-pad"
                                            placeholder="0"
                                            placeholderTextColor={colors.inkFaint}
                                            rightIcon={
                                                <Text style={styles.suffix}>
                                                    {quantidadeUnidade === "peso"
                                                        ? "g"
                                                        : "m"}
                                                </Text>
                                            }
                                        />
                                    </View>
                                    <Select
                                        style={styles.unitSelect}
                                        label="Unidade"
                                        options={noveloUnits}
                                        value={quantidadeUnidade}
                                        onChange={(key) =>
                                            setQuantidadeUnidade(key as QuantidadeUnidade)
                                        }
                                    />
                                </View>
                            )}

                            {type === "material" && (
                                <Input
                                    label="Quantidade utilizada"
                                    value={quantidadeUtilizada}
                                    onChangeText={setQuantidadeUtilizada}
                                    keyboardType="decimal-pad"
                                    placeholder="0"
                                    placeholderTextColor={colors.inkFaint}
                                    rightIcon={
                                        quantidadeUnidade !== "unidade" ? (
                                            <Text style={styles.suffix}>
                                                {quantidadeUnidade === "peso"
                                                    ? "g"
                                                    : "m"}
                                            </Text>
                                        ) : undefined
                                    }
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {loadingAgulhas ? (
                                <Text>Carregando...</Text>
                            ) : (
                                <ScrollView
                                    style={styles.agulhasList}
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator={false}
                                >
                                    {agulhas.map((agulha) => (
                                        <Pressable
                                            key={agulha.id}
                                            style={[
                                                styles.agulhaItem,
                                                agulhaId === agulha.id &&
                                                    styles.agulhaItemActive,
                                            ]}
                                            onPress={() => setAgulhaId(agulha.id)}
                                        >
                                            <Text
                                                style={[
                                                    styles.agulhaItemText,
                                                    agulhaId === agulha.id &&
                                                        styles.agulhaItemTextActive,
                                                ]}
                                            >
                                                {agulha.nome}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            )}
                        </>
                    )}

                    <View style={styles.actions}>
                        <Button
                            label="Adicionar material"
                            onPress={handleSubmit}
                            disabled={
                                saving ||
                                (type === "agulha" && agulhaId === null)
                            }
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
        marginBottom: 12,
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
    typeSelector: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },

    typeOption: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
    },

    typeOptionActive: {
        borderColor: colors.ink,
        backgroundColor: colors.bg,
    },

    typeText: {
        fontFamily: font.regular,
        fontSize: 13,
        color: colors.inkSoft,
    },

    typeTextActive: {
        fontFamily: font.semiBold,
        color: colors.ink,
    },

    row: {
        flexDirection: "row",
        gap: 10,
        alignItems: "flex-start",
    },

    rowItem: {
        flex: 1,
    },

    unitSelect: {
        width: 182,
    },

    currencyPrefix: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.inkSoft,
    },

    suffix: {
        fontFamily: font.semiBold,
        fontSize: 14,
        color: colors.inkSoft,
    },

    agulhasList: {
        maxHeight: 240,
        marginBottom: 4,
    },

    agulhaItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: colors.border,
    },

    agulhaItemActive: {
        borderColor: colors.lavanda,
        backgroundColor: colors.lavanda,
    },

    agulhaItemText: {
        fontFamily: font.regular,
        fontSize: 14,
        color: colors.ink,
    },

    agulhaItemTextActive: {
        fontFamily: font.semiBold,
        color: colors.surface,
    },
});