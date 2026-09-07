import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { colors, font } from "@/theme/tokens";

// TODO: implementar preferências reais (tema, notificações, idioma
// e persistência) em vez do placeholder atual.
export default function Preferencias() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [temaEscuro, setTemaEscuro] = useState(false);
    const [notificacoes, setNotificacoes] = useState(true);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
                    <View style={styles.header}>
                        <Pressable
                            style={styles.backBtn}
                            onPress={() => router.back()}
                        >
                            <FontAwesome5
                                name="arrow-left"
                                size={18}
                                color={colors.ink}
                            />
                        </Pressable>
                        <Text style={styles.headerTitle}>Preferências</Text>
                    </View>

                    <Text style={styles.sectionLabel}>Aparência</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.iconBox}>
                                <FontAwesome5
                                    name="moon"
                                    size={14}
                                    color={colors.inkSoft}
                                />
                            </View>
                            <View style={styles.rowText}>
                                <Text style={styles.rowLabel}>Tema escuro</Text>
                                <Text style={styles.rowHint}>Em breve</Text>
                            </View>
                            <Switch
                                value={temaEscuro}
                                onValueChange={setTemaEscuro}
                                disabled
                                trackColor={{
                                    false: colors.border,
                                    true: colors.lavanda,
                                }}
                                thumbColor={
                                    temaEscuro ? colors.primary : colors.inkFaint
                                }
                            />
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>Notificações</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.iconBox}>
                                <FontAwesome5
                                    name="bell"
                                    size={14}
                                    color={colors.inkSoft}
                                />
                            </View>
                            <View style={styles.rowText}>
                                <Text style={styles.rowLabel}>
                                    Notificações push
                                </Text>
                                <Text style={styles.rowHint}>Em breve</Text>
                            </View>
                            <Switch
                                value={notificacoes}
                                onValueChange={setNotificacoes}
                                disabled
                                trackColor={{
                                    false: colors.border,
                                    true: colors.lavanda,
                                }}
                                thumbColor={
                                    notificacoes ? colors.primary : colors.inkFaint
                                }
                            />
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>Idioma</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.iconBox}>
                                <FontAwesome5
                                    name="language"
                                    size={14}
                                    color={colors.inkSoft}
                                />
                            </View>
                            <View style={styles.rowText}>
                                <Text style={styles.rowLabel}>Idioma</Text>
                            </View>
                            <Text style={styles.rowValue}>
                                Português (Brasil)
                            </Text>
                        </View>
                    </View>

                    <View style={styles.wipBadge}>
                        <FontAwesome5
                            name="wrench"
                            size={12}
                            color={colors.inkFaint}
                        />
                        <Text style={styles.wipText}>
                            Esta tela está em construção
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 32,
        backgroundColor: "#faf7fb",
        gap: 14,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        height: 40,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontFamily: font.semiBold,
        fontSize: 22,
        color: colors.ink,
    },
    sectionLabel: {
        fontFamily: font.bold,
        fontSize: 13,
        color: colors.inkSoft,
        textTransform: "uppercase",
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        paddingHorizontal: 10,
    },
    row: {
        height: 52,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 4,
    },
    iconBox: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: colors.rose,
        alignItems: "center",
        justifyContent: "center",
    },
    rowText: {
        flex: 1,
        gap: 2,
    },
    rowLabel: {
        fontFamily: font.semiBold,
        fontSize: 15,
        color: colors.ink,
    },
    rowHint: {
        fontFamily: font.regular,
        fontSize: 12,
        color: colors.inkFaint,
    },
    rowValue: {
        fontFamily: font.medium,
        fontSize: 14,
        color: colors.inkFaint,
    },
    wipBadge: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 12,
    },
    wipText: {
        fontFamily: font.medium,
        fontSize: 13,
        color: colors.inkFaint,
    },
});
