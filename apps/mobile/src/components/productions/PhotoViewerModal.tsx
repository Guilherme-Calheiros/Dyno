import { useEffect, useRef } from "react";
import {
    FlatList,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, font } from "@/theme/tokens";
import { ProductionFoto } from "@artesaos/validation";

type PhotoViewerModalProps = {
    visible: boolean;
    fotos: ProductionFoto[];
    index: number;
    onIndexChange: (index: number) => void;
    onClose: () => void;
    onMore: () => void;
};

export default function PhotoViewerModal({
    visible,
    fotos,
    index,
    onIndexChange,
    onClose,
    onMore,
}: PhotoViewerModalProps) {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const listRef = useRef<FlatList<ProductionFoto>>(null);

    const safeIndex = Math.min(
        Math.max(index, 0),
        Math.max(fotos.length - 1, 0)
    );

    const prevVisible = useRef(visible);

    useEffect(() => {
        if (visible && !prevVisible.current) {
            listRef.current?.scrollToIndex({ index: safeIndex, animated: false });
        }

        prevVisible.current = visible;
    }, [visible, safeIndex]);

    const handleMomentumScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const next = Math.round(event.nativeEvent.contentOffset.x / width);
        const clamped = Math.min(
            Math.max(next, 0),
            Math.max(fotos.length - 1, 0)
        );

        if (clamped !== index) {
            onIndexChange(clamped);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
            accessibilityViewIsModal
        >
            <View style={styles.backdrop}>
                <FlatList
                    ref={listRef}
                    data={fotos}
                    keyExtractor={(item) => String(item.id)}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={safeIndex}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    getItemLayout={(_, i) => ({
                        length: width,
                        offset: width * i,
                        index: i,
                    })}
                    renderItem={({ item }) => (
                        <View style={[styles.page, { width }]}>
                            <Image
                                source={{ uri: item.caminho }}
                                style={styles.image}
                                contentFit="contain"
                                transition={200}
                            />
                        </View>
                    )}
                />

                <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
                    <Pressable
                        style={styles.circleBtn}
                        onPress={onClose}
                        accessibilityRole="button"
                        accessibilityLabel="Fechar"
                    >
                        <FontAwesome5 name="arrow-left" size={18} color={colors.ink} />
                    </Pressable>

                    <Pressable
                        style={styles.circleBtn}
                        onPress={onMore}
                        accessibilityRole="button"
                        accessibilityLabel="Mais ações"
                    >
                        <FontAwesome5
                            name="ellipsis-h"
                            size={18}
                            color={colors.ink}
                        />
                    </Pressable>
                </View>

                {fotos.length > 1 ? (
                    <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                        <View style={styles.counter}>
                            <Text style={styles.counterText}>
                                {safeIndex + 1} / {fotos.length}
                            </Text>
                        </View>
                    </View>
                ) : null}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "#000000",
    },

    page: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    topBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },

    circleBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },

    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
    },

    counter: {
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        borderRadius: 999,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },

    counterText: {
        fontFamily: font.semiBold,
        fontSize: 12,
        color: "#ffffff",
    },
});