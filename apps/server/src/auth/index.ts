import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { emailOTP } from "better-auth/plugins";
import { db } from "../db/index.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [
    expo(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // TODO: Integrar serviço de envio de e-mail (Resend, Nodemailer, etc.)
        console.log(`[OTP] type=${type} email=${email} otp=${otp}`);
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
      "http://localhost:3000",
      `${process.env.EXPO_PUBLIC_BETTER_AUTH_BASE_URL}`,
      "exp://",
      "dyno://",
  ],
  socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
});
