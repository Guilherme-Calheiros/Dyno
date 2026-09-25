import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, font } from "@/theme/tokens";
import SegmentedControl from "@/components/ui/SegmentedControl";
import ProductionCard from "@/components/productions/ProductionCard";
import NewProductionSheet from "@/components/productions/NewProductionSheet";
import { authedFetch } from "../../../../lib/authed-fetch";
import { useFocusEffect, useRouter } from "expo-router";
import { Production, ProductionStatus } from "@artesaos/validation";

export default function Productions() {
    const insets = useSafeAreaInsets();
    const [productions, setProductions] = useState<Production[]>([])
    const [activeTab, setActiveTab] = useState<ProductionStatus>("andamento");
    const [showSheet, setShowSheet] = useState(false);
    const router = useRouter()

    const filtered = productions.filter((p) => p.status === activeTab);

    useFocusEffect(
        useCallback(() => {
            const fetchProductions = async () => {
                try {
                    const response = await authedFetch("/api/productions");

                    if (!response.ok) {
                        throw new Error("Erro ao buscar produções");
                    }

                    const data = await response.json();

                    setProductions(data.producoes);
                } catch (error) {
                    console.error("Erro ao buscar produções:", error);
                }
            };

            fetchProductions();
        }, [])
    );

    const handleCreateProduction = async () => {
        try {
            const response = await authedFetch("/api/productions", {
                method: "POST"
            })

             if (!response.ok) {
                throw new Error("Erro ao criar produção");
            }

            const data = await response.json();

            router.push({ pathname: "/productions/[id]", params: { id: String(data.producao.id) }});
        } catch (error) {
            console.error("Erro ao criar produção:", error);
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
            <Text style={styles.title}>Produções</Text>

            <SegmentedControl
                options={[
                    { key: "andamento", label: "Em andamento" },
                    { key: "concluido", label: "Concluídas" },
                ]}
                active={activeTab}
                onChange={(key) => setActiveTab(key as ProductionStatus)}
            />

            <View style={styles.list}>
                {filtered.map((item) => (
                    <ProductionCard
                        key={item.id}
                        production={item}
                        onPress={() => router.push(`/productions/${item.id}`)}
                    />
                ))}
            </View>

            <Pressable
                style={[styles.fab, { bottom: insets.bottom }]}
                onPress={() => setShowSheet(true)}
            >
                <FontAwesome5 name="plus" size={22} color="#ffffff" />
            </Pressable>

            <NewProductionSheet
                isOpen={showSheet}
                onClose={() => setShowSheet(false)}
                onCreate={handleCreateProduction}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: colors.bg,
        gap: 14,
    },
    title: {
        fontFamily: font.semiBold,
        fontSize: 26,
        color: colors.ink,
    },
    list: {
        flex: 1,
        gap: 12,
    },
    fab: {
        position: "absolute",
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 999,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
});