// Cloudinary storage helpers for file uploads

import { ENV } from './_core/env';

type StorageConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function getStorageConfig(): StorageConfig {
  const cloudName = ENV.cloudinaryCloudName;
  const apiKey = ENV.cloudinaryApiKey;
  const apiSecret = ENV.cloudinaryApiSecret;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials missing: set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET"
    );
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Upload a file to Cloudinary
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const { cloudName, apiKey, apiSecret } = getStorageConfig();

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = relKey.replace(/\.[^.]+$/, "").replace(/^\/+/, "");

  // Generate signature
  const { createHash } = await import("crypto");
  const signatureStr = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signatureStr).digest("hex");

  const formData = new FormData();

  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });

  formData.append("file", blob, relKey.split("/").pop() ?? "file");
  formData.append("public_id", publicId);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Cloudinary upload failed (${response.status}): ${message}`
    );
  }

  const result = await response.json();
  return { key: publicId, url: result.secure_url };
}

/**
 * Get the public URL for a Cloudinary asset
 */
export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const { cloudName } = getStorageConfig();
  const key = relKey.replace(/^\/+/, "");
  return {
    key,
    url: `https://res.cloudinary.com/${cloudName}/image/upload/${key}`,
  };
}
