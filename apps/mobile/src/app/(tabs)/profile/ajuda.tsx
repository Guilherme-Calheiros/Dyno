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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { colors, font } from "@/theme/tokens";

// TODO: revisar contatos de suporte (placeholder) e implementar ações
// de contato reais (e-mail, WhatsApp, Instagram).
type GlyphName = keyof typeof FontAwesome5.glyphMap;

type HelpItem = {
    key: string;
    icon: GlyphName;
    label: string;
    value?: string;
    chevron?: boolean;
    onPress?: () => void;
};

export default function Ajuda() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const appVersion = Constants.expoConfig?.version ?? "1.0.0";

    const items: HelpItem[] = [
        {
            key: "termos",
            icon: "file-contract",
            label: "Termos de uso",
            chevron: true,
            onPress: () => router.push("/profile/termos"),
        },
        {
            key: "privacidade",
            icon: "shield-alt",
            label: "Política de privacidade",
            chevron: true,
            onPress: () => router.push("/profile/privacidade"),
        },
        {
            key: "versao",
            icon: "info-circle",
            label: "Versão do app",
            value: `v${appVersion}`,
        },
    ];

    const contacts = [
        {
            key: "email",
            icon: "envelope",
            label: "E-mail",
            value: "suporte@dyno.app",
        },
        {
            key: "whatsapp",
            icon: "whatsapp",
            label: "WhatsApp",
            value: "(00) 00000-0000",
        },
        {
            key: "instagram",
            icon: "instagram",
            label: "Instagram",
            value: "@dyno.app",
        },
    ];

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
                        <Text style={styles.headerTitle}>Ajuda e suporte</Text>
                    </View>

                    <Text style={styles.sectionLabel}>Legal</Text>
                    <View style={styles.card}>
                        {items.map((item, index) => (
                            <Pressable
                                key={item.key}
                                onPress={item.onPress}
                                disabled={!item.onPress}
                                style={[
                                    styles.row,
                                    index < items.length - 1 && styles.rowDelimiter,
                                ]}
                            >
                                <View style={styles.iconBox}>
                                    <FontAwesome5
                                        name={item.icon}
                                        size={14}
                                        color={colors.inkSoft}
                                    />
                                </View>
                                <Text style={styles.rowLabel}>{item.label}</Text>
                                {item.value ? (
                                    <Text style={styles.rowValue}>{item.value}</Text>
                                ) : null}
                                {item.chevron ? (
                                    <FontAwesome5
                                        name="chevron-right"
                                        size={14}
                                        color={colors.inkFaint}
                                    />
                                ) : null}
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.sectionLabel}>Contatos</Text>
                    <View style={styles.card}>
                        {contacts.map((item, index) => (
                            <View
                                key={item.key}
                                style={[
                                    styles.row,
                                    index < contacts.length - 1 && styles.rowDelimiter,
                                ]}
                            >
                                <View style={styles.iconBox}>
                                    <FontAwesome5
                                        name={item.icon}
                                        size={14}
                                        color={colors.inkSoft}
                                    />
                                </View>
                                
                                <Text style={styles.rowLabel}>{item.label}</Text>
                                
                                <Text style={styles.rowValue}>{item.value}</Text>
                            </View>
                        ))}
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
    rowDelimiter: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
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
    },
    rowLabel: {
        flex: 1,
        fontFamily: font.semiBold,
        fontSize: 15,
        color: colors.ink,
    },
    rowValue: {
        fontFamily: font.medium,
        fontSize: 13,
        color: colors.inkFaint,
    },
});
