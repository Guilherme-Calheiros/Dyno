import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { emailOTP } from "better-auth/plugins";
import { db } from "../db/index.js";
import {
  deleteObject,
  getObjectKeyFromUrl,
  getPublicUrl,
  isOurObject,
  uploadBuffer,
} from "../storage/r2.js";

async function migrateGoogleImage(userId: string, image?: string | null) {
  if (!image || isOurObject(image)) return image;

  try {
    const response = await fetch(image);
    if (!response.ok) return;
    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());
    const ext = contentType.split("/")[1]?.split(";")[0] ?? "jpg";
    const objectKey = `avatars/${userId}/google-${Date.now()}.${ext}`;
    await uploadBuffer(objectKey, buffer, contentType);
    return getPublicUrl(objectKey);
  } catch (err) {
    console.error("[google-avatar] falha ao migrar imagem", err);
  }
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      "/sign-in/email": { window: 15 * 60, max: 5 },
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
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const image = await migrateGoogleImage(user.id, user.image,);

          return {
            data: {
              ...user,
              image,
            },
          };
        },
      },
      delete: {
        before: async (deletedUser) => {
          if (!deletedUser.image || !isOurObject(deletedUser.image)) {
            return;
          }

          const objectKey = getObjectKeyFromUrl(deletedUser.image);
          if (!objectKey) {
            return;
          }

          try {
            await deleteObject(objectKey);
          } catch (error) {
            console.error("[google-avatar] falha ao remover imagem", error);
          }
        }
      }
    },
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
