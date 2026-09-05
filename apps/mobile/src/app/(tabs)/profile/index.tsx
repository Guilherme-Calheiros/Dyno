import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { authClient } from "../../../../lib/auth-client";
import { useToast } from "@/components/ui/Toast";
import { colors, font } from "@/theme/tokens";

type GlyphName = keyof typeof FontAwesome5.glyphMap;

type MenuItem = {
    key: string;
    icon: GlyphName;
    label: string;
    danger?: boolean;
    chevron?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
    { key: "prefs", icon: "cog", label: "Preferências", chevron: true },
    { key: "help", icon: "question-circle", label: "Ajuda e suporte", chevron: true },
    { key: "seguranca", icon: "lock", label: "Segurança", chevron: true },
    { key: "logout", icon: "sign-out-alt", label: "Sair", danger: true },
    { key: "excluir", icon: "trash-alt", label: "Excluir conta", danger: true },
];

export default function Profile() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const { data: session } = authClient.useSession();
    const name = session?.user?.name ?? "Artesão";
    const email = session?.user?.email;

    async function logout() {
        setLoading(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.reload();
                    },
                },
            });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erro ao sair");
        } finally {
            setLoading(false);
        }
    }

    function onPress(item: MenuItem) {
        if (item.key === "logout") {
            logout();
            return;
        }
        if (item.key === "seguranca") {
            router.push("/profile/seguranca");
            return;
        }
        if (item.key === "excluir") {
            router.push("/profile/excluir-conta");
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
            <View style={styles.head}>
                <View style={styles.avatar}>
                    {session?.user?.image ? (
                        <Image
                            source={{ uri: session.user.image }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <Text style={styles.avatarLetter}>
                            {name.charAt(0).toUpperCase()}
                        </Text>
                    )}
                </View>
                <View style={styles.headCol}>
                    <Text style={styles.name} numberOfLines={1}>
                        {name}
                    </Text>
                    <Text style={styles.sub} numberOfLines={1}>
                        {email}
                    </Text>
                </View>
                <Pressable
                    style={styles.editBtn}
                    onPress={() => router.push("/profile/editar-perfil")}
                >
                    <FontAwesome5 name="user-edit" size={16} color={colors.inkSoft} />
                </Pressable>
            </View>

            <Text style={styles.menuLabel}>Minha conta</Text>

            <View style={styles.card}>
                {MENU_ITEMS.map((item, index) => (
                    <Pressable
                        key={item.key}
                        onPress={() => onPress(item)}
                        disabled={loading && item.key === "logout"}
                        style={[
                            styles.row,
                            index < MENU_ITEMS.length - 1 && styles.rowDelimiter,
                        ]}
                    >
                        <View style={styles.iconBox}>
                            <FontAwesome5
                                name={item.icon}
                                size={15}
                                color={item.danger ? colors.danger : colors.inkSoft}
                            />
                        </View>
                        <Text
                            style={[
                                styles.rowLabel,
                                item.danger && styles.rowLabelDanger,
                            ]}
                        >
                            {item.label}
                        </Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#faf7fb",
        gap: 14,
    },
    head: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    avatar: {
        width: 76,
        height: 76,
        borderRadius: 999,
        backgroundColor: colors.tint,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarLetter: {
        fontFamily: font.semiBold,
        fontSize: 30,
        color: colors.primaryDeep,
    },
    avatarImage: {
        width: 76,
        height: 76,
        borderRadius: 999,
    },
    headCol: {
        flex: 1,
        gap: 4,
    },
    name: {
        fontFamily: font.semiBold,
        fontSize: 24,
        color: colors.ink,
    },
    sub: {
        fontFamily: font.semiBold,
        fontSize: 13,
        color: colors.inkSoft,
    },
    editBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.line,
        alignItems: "center",
        justifyContent: "center",
    },
    menuLabel: {
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
    rowLabel: {
        flex: 1,
        fontFamily: font.semiBold,
        fontSize: 15,
        color: colors.ink,
    },
    rowLabelDanger: {
        color: colors.danger,
    },
});
