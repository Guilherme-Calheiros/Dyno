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

// TODO: revisar texto legal dos termos de uso com assessoria jurídica
// e substituir conteúdo provisório antes do lançamento.
export default function Termos() {
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
                        <Text style={styles.headerTitle}>Termos de uso</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.date}>Última atualização: 07/09/2026</Text>

                        <Text style={styles.heading}>1. Aceitação dos termos</Text>
                        <Text style={styles.body}>
                            Ao acessar ou utilizar o aplicativo Dyno ("Aplicativo"),
                            você concorda com estes Termos de Uso. Caso não concorde,
                            não utilize o Aplicativo.
                        </Text>

                        <Text style={styles.heading}>2. Descrição do serviço</Text>
                        <Text style={styles.body}>
                            O Dyno é um aplicativo destinado ao gerenciamento de
                            receitas, produções e controle de artesanato. O Aplicativo
                            permite ao usuário organizar receitas, acompanhar
                            produções e gerenciar materiais.
                        </Text>

                        <Text style={styles.heading}>3. Cadastro e conta</Text>
                        <Text style={styles.body}>
                            Para utilizar o Aplicativo, é necessário realizar cadastro
                            fornecendo informações verdadeiras e atualizadas. O usuário
                            é responsável por manter a confidencialidade de suas
                            credenciais de acesso e por todas as atividades realizadas
                            em sua conta.
                        </Text>

                        <Text style={styles.heading}>4. Uso aceitável</Text>
                        <Text style={styles.body}>
                            O usuário compromete-se a utilizar o Aplicativo de acordo
                            com a legislação vigente e estes Termos. É vedado:
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Utilizar o Aplicativo para fins ilícitos ou
                            não autorizados;
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Tentar acessar áreas restritas ou contas de
                            outros usuários;
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Interromper ou prejudicar o funcionamento do
                            Aplicativo;
                        </Text>
                        <Text style={styles.listItem}>
                            {"\u2022"} Enviar vírus, malware ou qualquer código
                            malicioso.
                        </Text>

                        <Text style={styles.heading}>5. Propriedade intelectual</Text>
                        <Text style={styles.body}>
                            Todo o conteúdo do Aplicativo, incluindo mas não se
                            limitando a textos, gráficos, logotipos, ícones, imagens,
                            clipes de áudio e software, é propriedade do Dyno ou de
                            seus licenciadores e é protegido por leis de propriedade
                            intelectual.
                        </Text>

                        <Text style={styles.heading}>6. Conteúdo do usuário</Text>
                        <Text style={styles.body}>
                            O usuário mantém a propriedade sobre os dados e conteúdos
                            que insere no Aplicativo (receitas, produções, materiais).
                            Ao utilizar o Aplicativo, o usuário concede ao Dyno a
                            licença limitada de armazenar e exibir tais conteúdos
                            exclusivamente para fins de prestação do serviço.
                        </Text>

                        <Text style={styles.heading}>7. Isenção de garantias</Text>
                        <Text style={styles.body}>
                            O Aplicativo é fornecido "como está", sem garantias de
                            qualquer tipo, expressas ou implícitas. O Dyno não
                            garante que o Aplicativo será ininterrupto, livre de erros
                            ou seguro.
                        </Text>

                        <Text style={styles.heading}>8. Limitação de responsabilidade</Text>
                        <Text style={styles.body}>
                            Em nenhuma circunstância o Dyno será responsável por
                            quaisquer danos indiretos, incidentais, especiais ou
                            consequenciais decorrentes do uso ou incapacidade de uso
                            do Aplicativo.
                        </Text>

                        <Text style={styles.heading}>9. Alterações nestes termos</Text>
                        <Text style={styles.body}>
                            O Dyno reserva-se o direito de alterar estes Termos a
                            qualquer momento. As alterações entrarão em vigor na data
                            de sua publicação no Aplicativo. O uso continuado do
                            Aplicativo após as alterações constitui aceitação dos novos
                            Termos.
                        </Text>

                        <Text style={styles.heading}>10. Contato</Text>
                        <Text style={styles.body}>
                            Em caso de dúvidas sobre estes Termos, entre em contato
                            pelo e-mail suporte@dyno.app.
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
