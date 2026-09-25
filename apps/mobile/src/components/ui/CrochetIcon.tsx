import { colors } from "@/theme/tokens";
import Svg, { G, Path } from "react-native-svg";

type Props = {
    size?: number;
    color?: string;
};

export default function CrochetIcon({
    size = 24,
    color = colors.primary,
}: Props) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 128 128"
        >
            <G transform="translate(0,128) scale(0.1,-0.1)">
                <Path
                    fill={color}
                    d="M1025 1146 c-16 -8 -127 -111 -245 -230 -204 -205 -213 -216 -195 -230
                    11 -9 23 -16 27 -16 4 0 15 -14 25 -30 9 -16 22 -30 28 -30
                    16 0 301 291 318 325 8 17 20 49 26 73 13 47 49 77 80 67
                    28 -9 33 -33 11 -55 -36 -36 -20 -80 30 -80 35 0 60 29 67 78
                    7 49 -16 96 -60 122 -37 23 -70 25 -112 6z
                    M425 625 c-39 -21 -312 -291 -332 -329 -45 -86 36 -189 134 -171
                    32 6 64 33 195 163 165 163 186 194 174 256 -14 72 -106 116 -171 81z"
                />
            </G>
        </Svg>
    );
}