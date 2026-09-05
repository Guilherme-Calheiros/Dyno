import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../src/config/api";
import type { auth } from "../../server/src/auth";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    expoClient({
      scheme: "dyno",
      storagePrefix: "dyno",
      storage: SecureStore,
    }),
    emailOTPClient(),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
