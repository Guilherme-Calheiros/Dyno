import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "@/theme/tokens";
import YarnBallIcon from "../ui/YarnBallIcon";
import CrochetIcon from "../ui/CrochetIcon";

type Props = {
    tipo: "material" | "novelo" | "agulha";
    cor?: string | null;
};

export default function MaterialIcon({ tipo, cor }: Props) {
    if (tipo === "novelo") {
        return (
            <YarnBallIcon
                size={28}
                color={cor?.trim() || colors.primary}
            />
        );
    }

    if (tipo === "agulha") {
        return (
            <CrochetIcon
                size={22}
                color={colors.primary}
            />
        );
    }

    return (
        <FontAwesome5
            name="box"
            size={18}
            color={colors.primary}
        />
    );
}