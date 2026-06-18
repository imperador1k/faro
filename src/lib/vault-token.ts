const COOKIE_MAX_AGE = 3600; // 1 hour

async function getHmacKey(secret: string) {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Creates a signed admin vault token.
 * Format: userId:expiry:signature
 */
export async function createVaultToken(userId: string): Promise<string> {
  const expiry = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;
  const payload = `${userId}:${expiry}`;

  const rawSecret =
    process.env.CLERK_SECRET_KEY ||
    process.env.ADMIN_SUDO_HASH ||
    "fallback-secret-do-not-use-in-production";
  const secret = rawSecret.replace(/\\/g, "");

  const key = await getHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  const signature = bufferToHex(signatureBuffer);

  return `${payload}:${signature}`;
}

/**
 * Validates a signed admin vault token.
 * Returns the userId if valid, null otherwise.
 */
export async function validateVaultToken(
  token: string,
): Promise<string | null> {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return null;

    const [userId, expiryStr, signature] = parts;
    const expiry = parseInt(expiryStr, 10);

    if (isNaN(expiry) || Date.now() / 1000 > expiry) {
      return null;
    }

    const rawSecret =
      process.env.CLERK_SECRET_KEY ||
      process.env.ADMIN_SUDO_HASH ||
      "fallback-secret-do-not-use-in-production";
    const secret = rawSecret.replace(/\\/g, "");

    const key = await getHmacKey(secret);
    const expectedPayload = `${userId}:${expiry}`;

    const signatureBytes = new Uint8Array(
      signature.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(expectedPayload),
    );

    if (!isValid) return null;

    return userId;
  } catch (error) {
    console.error("[validateVaultToken] Error during validation:", error);
    return null;
  }
}
