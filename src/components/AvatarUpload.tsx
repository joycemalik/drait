"use client";
import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { setAvatar } from "@/lib/actions";

const SIZE = 320;

/** Center-crops to a square and re-encodes as WebP, so uploads stay small whatever the camera made. */
async function toSquareWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  bitmap.close();
  return await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't read that image."))), "image/webp", 0.85),
  );
}

export default function AvatarUpload({ userId, url, name }: { userId: string; url?: string; name: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(url);
  const [status, setStatus] = useState<{ text: string; error?: boolean } | null>(null);
  const [pending, start] = useTransition();

  function pick(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setStatus({ text: "Choose an image file.", error: true });
    if (file.size > 15 * 1024 * 1024) return setStatus({ text: "That image is over 15 MB.", error: true });
    setStatus(null);
    start(async () => {
      try {
        const blob = await toSquareWebp(file);
        const sb = createClient();
        const path = `${userId}/avatar.webp`;
        const { error } = await sb.storage.from("avatars").upload(path, blob, { upsert: true, contentType: "image/webp" });
        if (error) throw error;
        // A new query string makes browsers fetch the new picture instead of the cached one.
        const publicUrl = `${sb.storage.from("avatars").getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
        const res = await setAvatar(publicUrl);
        if (!res.ok) throw new Error(res.error);
        setPreview(publicUrl);
        setStatus({ text: "Photo updated." });
      } catch (e) {
        setStatus({ text: e instanceof Error ? e.message : "Upload failed.", error: true });
      }
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.1rem" }}>
      <button
        type="button"
        onClick={() => input.current?.click()}
        aria-label="Change profile photo"
        style={{
          width: 88,
          height: 88,
          flexShrink: 0,
          borderRadius: "48% 52% 50% 50% / 52% 48% 52% 48%",
          overflow: "hidden",
          background: "var(--paper-deep)",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 0 0 3px var(--paper), 0 0 0 4.5px var(--rule)",
          opacity: pending ? 0.6 : 1,
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" width={88} height={88} style={{ objectFit: "cover", width: "100%", height: "100%" }} referrerPolicy="no-referrer" />
        ) : (
          <span className="font-display" style={{ fontSize: "2rem", color: "var(--ink-soft)" }}>
            {name.slice(0, 1) || "?"}
          </span>
        )}
      </button>
      <div style={{ display: "grid", gap: "0.3rem" }}>
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={pending}
          style={{ justifySelf: "start", color: "var(--ink)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "underline", textUnderlineOffset: 4 }}
        >
          {pending ? "Uploading…" : "Change photo"}
        </button>
        <span style={{ fontSize: "0.78rem", color: "var(--ink-faint)" }}>Square crop, JPG/PNG/WebP. Visible to everyone.</span>
        {status && (
          <span role="status" style={{ fontSize: "0.8rem", color: status.error ? "var(--laterite)" : "var(--sal)" }}>
            {status.text}
          </span>
        )}
      </div>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
}
