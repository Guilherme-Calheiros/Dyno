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
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        const { error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: email,
          subject:
            type === "sign-in"
              ? "Seu código de acesso ao Dyno"
              : "Seu código de verificação do Dyno",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
              <h1 style="color: #4b277a;">Dyno</h1>

              <p>Seu código de verificação é:</p>

              <div
                style="
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  margin: 24px 0;
                  color: #4b277a;
                "
              >
                ${otp}
              </div>

              <p>
                Esse código é válido por alguns minutos.
              </p>

              <p>
                Se você não solicitou esse código, pode ignorar este e-mail.
              </p>
            </div>
          `,
        });

        if (error) {
          console.error("[OTP] falha ao enviar e-mail:", error);
          throw new Error("Falha ao enviar código de verificação");
        }
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
