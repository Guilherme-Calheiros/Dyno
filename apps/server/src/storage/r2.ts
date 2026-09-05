import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID!;
const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
const bucket = process.env.R2_BUCKET!;
const publicUrl = process.env.R2_PUBLIC_URL!;

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function createUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn: 300 });
}

export async function uploadBuffer(key: string, buffer: Buffer, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });
  await client.send(command);
}

export async function deleteObject(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  await client.send(command);
}

export function getObjectKeyFromUrl(url: string) {
  const baseUrl = publicUrl.replace(/\/$/, "");
  if (!url.startsWith(baseUrl)) {
    return null;
  }
  return url.slice(baseUrl.length + 1).split("?")[0] || null;
}

export function isOurObject(url: string) {
  const baseUrl = publicUrl.replace(/\/$/, "");
  return url.startsWith(baseUrl);
}

export function getPublicUrl(key: string) {
  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}