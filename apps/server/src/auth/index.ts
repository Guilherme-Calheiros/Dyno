import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { emailOTP } from "better-auth/plugins";
import { db } from "../db/index.js";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL!,
    database: drizzleAdapter(db, { provider: "pg" }),
    logger: {
        level: "debug",
        log(level, message, ...args) {
            console.log(`[better-auth:${level}]`, message, ...args);
        },
    },
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
        "dyno://*",
        "exp://**",
        "http://localhost:3000",
    ],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }
    }
});
