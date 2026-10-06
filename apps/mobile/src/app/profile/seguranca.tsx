import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlterarSenha from "@/components/security/AlterarSenha";
import BackButton from "@/components/ui/BackButton";
import { colors, font } from "@/theme/tokens";

export default function Seguranca() {
    const insets = useSafeAreaInsets();

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
                        <BackButton />
                        <Text style={styles.headerTitle}>Segurança</Text>
                    </View>

                    <AlterarSenha />
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
        backgroundColor: colors.bg,
        gap: 14,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        height: 40,
    },
    headerTitle: {
        fontFamily: font.semiBold,
        fontSize: 22,
        color: colors.ink,
    },
});
