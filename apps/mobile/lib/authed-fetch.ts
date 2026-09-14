import { authClient } from "./auth-client";
import { API_URL } from "../src/config/api";

export async function authedFetch(endpoint: string, init?: RequestInit) {
    const cookies = await authClient.getCookie();

    return fetch(`${API_URL}${endpoint}`, {
        ...init,
        headers: {
            Cookie: cookies,
            ...(init?.body
                ? { "Content-Type": "application/json" }
                : {}),
            ...init?.headers,
        },
        credentials: "omit",
    });
}