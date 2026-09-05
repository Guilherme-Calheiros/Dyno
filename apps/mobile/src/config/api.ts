import { authClient } from "../../lib/auth-client";

export const API_URL = __DEV__
  ? process.env.EXPO_PUBLIC_API_URL_DEV!
  : process.env.EXPO_PUBLIC_API_URL_PROD!;

export async function api<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

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