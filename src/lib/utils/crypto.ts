// src/lib/utils/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { env } from "@/lib/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// TODO(security): Rotate ENCRYPTION_KEY periodically and support key versioning
export function encrypt(text: string): { encrypted: string; iv: string } {
  const iv = randomBytes(IV_LENGTH);
  const key = Buffer.from(env.ENCRYPTION_KEY, "utf-8");
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf-8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    encrypted: Buffer.concat([encrypted, authTag]).toString("base64"),
    iv: iv.toString("base64"),
  };
}

// TODO(security): Handle decryption failures gracefully without leaking timing info
export function decrypt(encrypted: string, iv: string): string {
  const key = Buffer.from(env.ENCRYPTION_KEY, "utf-8");
  const ivBuffer = Buffer.from(iv, "base64");
  const encryptedBuffer = Buffer.from(encrypted, "base64");

  const authTag = encryptedBuffer.subarray(
    encryptedBuffer.length - AUTH_TAG_LENGTH
  );
  const encryptedData = encryptedBuffer.subarray(
    0,
    encryptedBuffer.length - AUTH_TAG_LENGTH
  );

  const decipher = createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  return decrypted.toString("utf-8");
}
