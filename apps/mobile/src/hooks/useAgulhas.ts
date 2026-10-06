import { useCallback, useEffect, useState } from "react";
import { authedFetch } from "../../lib/authed-fetch";

export type Agulha = {
    id: number;
    nome: string;
}

let agulhasCache: Agulha[] | null = null;
let pendingFetch: Promise<Agulha[]> | null = null;

async function fetchAgulhas(): Promise<Agulha[]> {
    const response = await authedFetch("/api/agulhas");

    if (!response.ok) {
        throw new Error("Erro ao buscar agulhas");
    }

    const data = await response.json();

    return data.agulhas as Agulha[];
}

function getAgulhas(): Promise<Agulha[]> {
    if (agulhasCache !== null) {
        return Promise.resolve(agulhasCache);
    }

    if (!pendingFetch) {
        pendingFetch = fetchAgulhas()
            .then((agulhas) => {
                agulhasCache = agulhas;
                pendingFetch = null;
                return agulhas;
            })
            .catch((error) => {
                pendingFetch = null;
                throw error;
            });
    }

    return pendingFetch;
}

export function useAgulhas(active = true) {
    const [agulhas, setAgulhas] = useState<Agulha[]>(agulhasCache ?? []);
    const [loading, setLoading] = useState(!agulhasCache);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!active) return;

        let activeFlag = true;

        getAgulhas()
            .then((data) => {
                if (activeFlag) {
                    setAgulhas(data);
                }
            })
            .catch((e) => {
                if (activeFlag) {
                    setError(e instanceof Error ? e.message : "Erro ao buscar agulhas");
                }
            })
            .finally(() => {
                if (activeFlag) {
                    setLoading(false);
                }
            });

        return () => {
            activeFlag = false;
        };
    }, [active]);

    const refetch = useCallback(async () => {
        agulhasCache = null;
        pendingFetch = null;
        setLoading(true);
        setError(null);

        try {
            const data = await fetchAgulhas();
            agulhasCache = data;
            setAgulhas(data);
            return data;
        } finally {
            setLoading(false);
        }
    }, []);

    return { agulhas, loading, error, refetch };
}