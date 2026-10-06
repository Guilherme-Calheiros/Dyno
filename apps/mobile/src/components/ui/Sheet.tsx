import { useEffect, useRef } from "react";
import { useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";
import { colors } from "@/theme/tokens";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export default function Sheet({
    isOpen,
    onClose,
    children,
}: Props) {
    const sheetRef = useRef<BottomSheet>(null);
    const { height: windowHeight } = useWindowDimensions();

    useEffect(() => {
        if (isOpen) {
            sheetRef.current?.present();
        } else {
            sheetRef.current?.dismiss();
        }
    }, [isOpen]);

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            enablePanDownToClose
            onDismiss={onClose}
            backgroundStyle={{
                backgroundColor: colors.surface,
            }}
        >
            <BottomSheetView
                style={{ maxHeight: windowHeight * 0.9 }}
            >
                {children}
            </BottomSheetView>
        </BottomSheet>
    );
}