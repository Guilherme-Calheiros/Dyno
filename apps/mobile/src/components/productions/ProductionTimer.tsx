import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { colors, font } from "@/theme/tokens";
import { formatarTempo } from "@/lib/format";

type Props = {
    tempoReal: number;
    locked?: boolean;
    onPause: (tempoSessao: number) => Promise<void>;
    onReset: () => Promise<void>;
};

export default function ProductionTimer({
    tempoReal,
    locked = false,
    onPause,
    onReset,
}: Props) {
    const [running, setRunning] = useState(false);
    const [tempoSessao, setTempoSessao] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    const isRunningRef = useRef(false);
    const tempoSessaoRef = useRef(0);
    const salvandoRef = useRef(false);

    useEffect(() => {
        isRunningRef.current = running;
    }, [running]);

    useEffect(() => {
        tempoSessaoRef.current = tempoSessao;
    }, [tempoSessao]);

    useEffect(() => {
        if (!running) {
            return;
        }

        const interval = setInterval(() => {
            setTempoSessao((tempo) => tempo + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [running]);

    const pausar = useCallback(async () => {
        if (!isRunningRef.current || salvandoRef.current) {
            return;
        }

        const tempo = tempoSessaoRef.current;

        salvandoRef.current = true;
        isRunningRef.current = false;
        setRunning(false);

        try {
            await onPause(tempo);

            setTempoSessao(0);
            tempoSessaoRef.current = 0;
        } catch (error) {
            console.error(
                "Erro ao pausar cronômetro:",
                error
            );

            isRunningRef.current = true;
            setRunning(true);
        } finally {
            salvandoRef.current = false;
        }
    }, [onPause]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                pausar().catch((error) => {
                    console.error(
                        "Erro ao pausar cronômetro:",
                        error
                    );
                });
            };
        }, [pausar])
    );

    const handleStart = () => {
        if (locked || actionLoading || isRunningRef.current) {
            return;
        }

        setActionLoading(true);

        try {
            setRunning(true);
            isRunningRef.current = true;
            tempoSessaoRef.current = tempoSessao;
        } finally {
            setActionLoading(false);
        }
    };

    const handlePause = async () => {
        if (locked || actionLoading) {
            return;
        }

        setActionLoading(true);

        try {
            await pausar();
        } finally {
            setActionLoading(false);
        }
    };

    const handleReset = async () => {
        if (locked || actionLoading || salvandoRef.current) {
            return;
        }

        setActionLoading(true);

        try {
            if (isRunningRef.current) {
                await pausar();
            }

            await onReset();

            setTempoSessao(0);
            tempoSessaoRef.current = 0;
            setRunning(false);
            isRunningRef.current = false;
        } catch (error) {
            console.error(
                "Erro ao resetar cronômetro:",
                error
            );
        } finally {
            setActionLoading(false);
        }
    };

    const tempoAtual = tempoReal + tempoSessao;

    return (
        <View style={styles.card}>
            <View style={styles.controls}>
                <View style={styles.slotLeft}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.resetButton,
                            pressed && styles.pressed,
                            (locked || actionLoading) && styles.disabled,
                        ]}
                        onPress={handleReset}
                        disabled={locked || actionLoading}
                        accessibilityRole="button"
                        accessibilityLabel="Resetar cronômetro"
                    >
                        <FontAwesome5
                            name="redo"
                            size={19}
                            color={colors.inkSoft}
                        />
                    </Pressable>
                </View>

                <View style={styles.readout}>
                    <Text style={styles.time}>
                        {formatarTempo(tempoAtual)}
                    </Text>

                    <Text style={styles.status}>
                        {locked
                            ? "Concluída"
                            : running
                            ? "Em Andamento"
                            : "Pausado"}
                    </Text>
                </View>

                <View style={styles.slotRight}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.primaryButton,
                            pressed && styles.pressed,
                            (locked || actionLoading) && styles.disabled,
                        ]}
                        onPress={
                            running
                                ? handlePause
                                : handleStart
                        }
                        disabled={locked || actionLoading}
                        accessibilityRole="button"
                        accessibilityLabel={
                            locked
                                ? "Cronômetro bloqueado"
                                : running
                                ? "Pausar cronômetro"
                                : "Iniciar cronômetro"
                        }
                    >
                        <FontAwesome5
                            name={
                                running
                                    ? "pause"
                                    : "play"
                            }
                            size={22}
                            color={colors.surface}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 18,
    },

    controls: {
        flexDirection: "row",
        alignItems: "center",
    },

    slotLeft: {
        width: 58,
        alignItems: "flex-start",
    },

    slotRight: {
        width: 58,
        alignItems: "flex-end",
    },

    readout: {
        flex: 1,
        alignItems: "center",
        gap: 6,
    },

    time: {
        fontFamily: font.semiBold,
        fontSize: 40,
        lineHeight: 46,
        color: colors.ink,
        textAlign: "center",
        fontVariant: ["tabular-nums"],
    },

    status: {
        fontFamily: font.semiBold,
        fontSize: 11,
        color: colors.inkFaint,
        textAlign: "center",
    },

    resetButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.line,
        alignItems: "center",
        justifyContent: "center",
    },

    primaryButton: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    pressed: {
        opacity: 0.85,
    },

    disabled: {
        opacity: 0.5,
    },
});