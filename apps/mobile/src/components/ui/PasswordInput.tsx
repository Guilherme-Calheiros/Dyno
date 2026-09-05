import { useState } from "react";
import { Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Input, { type InputProps } from "./Input";
import { colors } from "@/theme/tokens";

type PasswordInputProps = Omit<InputProps, "secureTextEntry" | "rightIcon"> & {
    textContentType?: InputProps["textContentType"];
};

export default function PasswordInput({
    textContentType,
    ...inputProps
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    function toggleVisibility() {
        setVisible((prev) => !prev);
    }

    return (
        <Input
            {...inputProps}
            secureTextEntry={!visible}
            textContentType={textContentType}
            rightIcon={
                <Pressable
                    onPress={toggleVisibility}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={visible ? "Ocultar senha" : "Mostrar senha"}
                >
                    <FontAwesome5
                        name={visible ? "eye-slash" : "eye"}
                        size={17}
                        color={colors.inkFaint}
                    />
                </Pressable>
            }
        />
    );
}
