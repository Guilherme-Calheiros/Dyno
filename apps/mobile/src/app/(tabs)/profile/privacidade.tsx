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
import { colors, font } from "@/theme/tokens";

// TODO: revisar texto da política de privacidade (LGPD) com assessoria
// jurídica e substituir conteúdo provisório antes do lançamento.
export default function Privacidade() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

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
                        <Text style={styles.headerTitle}>
                            Política de privacidade
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.date}>Última atualização: 07/09/2026</Text>

                        <Text style={styles.heading}>1. Controlador dos dados</Text>
                        <Text style={styles.body}>
                            O controlador dos dados pessoais coletados pelo
                            Aplicativo Dyno é a empresa Dyno, responsável pelo
                            tratamento dos dados em conformidade com a Lei Geral de
                            Proteção de Dados (Lei nº 13.709/2018 — LGPD).
                        </Text>

                        <Text style={styles.heading}>
                            2. Dados pessoais coletados
                        </Text>
                        <Text style={styles.body}>
                            O Aplicativo coleta e armazena os seguintes dados
                            pessoais, fornecidos diretamente pelo titular:
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Nome completo
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Endereço de e-mail
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Biografia (opcional)
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Foto de perfil (opcional)
                        </Text>

                        <Text style={styles.heading}>
                            3. Finalidade do tratamento
                        </Text>
                        <Text style={styles.body}>
                            Os dados pessoais são tratados para as seguintes
                            finalidades:
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Criação e gestão da conta do usuário
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Autenticação e acesso ao Aplicativo
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Exibição do perfil dentro do Aplicativo
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Armazenamento de receitas, produções e
                            materiais do usuário
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Comunicação relacionada ao serviço
                        </Text>

                        <Text style={styles.heading}>4. Base legal</Text>
                        <Text style={styles.body}>
                            O tratamento dos dados é realizado com base em:
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Consentimento do titular (art. 7º, I da LGPD)
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Execução de contrato ou de procedimentos
                            preliminares relacionados a contrato (art. 7º, V da
                            LGPD)
                        </Text>

                        <Text style={styles.heading}>
                            5. Compartilhamento de dados
                        </Text>
                        <Text style={styles.body}>
                            Os dados pessoais do usuário não são compartilhados com
                            terceiros, exceto nas seguintes hipóteses:
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Quando exigido por determinação judicial ou
                            autoridade competente
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Para prestadores de serviço essenciais ao
                            funcionamento do Aplicativo (hospedagem, armazenamento em
                            nuvem), sob contratos que garantem a proteção dos dados
                        </Text>

                        <Text style={styles.heading}>6. Retenção de dados</Text>
                        <Text style={styles.body}>
                            Os dados pessoais serão armazenados enquanto a conta do
                            usuário estiver ativa. Após a exclusão da conta, os dados
                            serão removidos de forma irreversível dentro de prazo
                            razoável, resguardadas as obrigações legais de retenção.
                        </Text>

                        <Text style={styles.heading}>
                            7. Direitos do titular
                        </Text>
                        <Text style={styles.body}>
                            Nos termos do art. 18 da LGPD, o titular dos dados tem
                            direito a:
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Confirmação da existência de tratamento
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Acesso aos dados pessoais
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Correção de dados incompletos ou desatualizados
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Anonimização, bloqueio ou eliminação de dados
                            desnecessários
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Portabilidade dos dados
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Eliminação dos dados tratados com
                            consentimento
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Informação sobre entidades com quem houve
                            compartilhamento
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Revogação do consentimento
                        </Text>

                        <Text style={styles.heading}>8. Segurança dos dados</Text>
                        <Text style={styles.body}>
                            O Dyno adota medidas técnicas e administrativas aptas a
                            proteger os dados pessoais de acessos não autorizados e de
                            situações acidentais ou ilícitas de destruição, perda,
                            alteração, comunicação ou qualquer forma de tratamento
                            inadequado ou ilícito.
                        </Text>

                        <Text style={styles.heading}>
                            9. Transferência internacional
                        </Text>
                        <Text style={styles.body}>
                            Caso os dados sejam transferidos para fora do Brasil,
                            será garantido, no mínimo, grau de proteção de dados
                            previsto nesta Política e na LGPD.
                        </Text>

                        <Text style={styles.heading}>
                            10. Alterações nesta política
                        </Text>
                        <Text style={styles.body}>
                            O Dyno reserva-se o direito de alterar esta Política de
                            Privacidade a qualquer momento. As alterações serão
                            comunicadas por meio do Aplicativo ou por e-mail.
                        </Text>

                        <Text style={styles.heading}>11. Contato</Text>
                        <Text style={styles.body}>
                            Para exercer seus direitos ou esclarecer dúvidas sobre
                            esta Política de Privacidade, entre em contato pelo
                            e-mail suporte@dyno.app.
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
    content: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 20,
        gap: 12,
    },
    date: {
        fontFamily: font.medium,
        fontSize: 12,
        color: colors.inkFaint,
        marginBottom: 4,
    },
    heading: {
        fontFamily: font.bold,
        fontSize: 15,
        color: colors.ink,
    },
    body: {
        fontFamily: font.regular,
        fontSize: 14,
        lineHeight: 22,
        color: colors.inkSoft,
    },
    listItem: {
        fontFamily: font.regular,
        fontSize: 14,
        lineHeight: 22,
        color: colors.inkSoft,
        paddingLeft: 8,
    },
});
