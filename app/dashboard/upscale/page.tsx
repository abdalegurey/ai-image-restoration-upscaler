"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


interface ResultUpscaler {
  image?: string;
}

/* ---------------- IMAGE RESIZE (MUHIIM) ---------------- */
function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const MAX_SIZE = 1024; // ❗ Mobile GPU safety
      let { width, height } = img;

      if (width > height && width > MAX_SIZE) {
        height = Math.round((height * MAX_SIZE) / width);
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = Math.round((width * MAX_SIZE) / height);
        height = MAX_SIZE;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");

      ctx.drawImage(img, 0, 0, width, height);

      // JPEG + compression = mobile friendly
      const resizedBase64 = canvas.toDataURL("image/jpeg", 0.85);
      resolve(resizedBase64);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------------- PAGE ---------------- */
export default function UpscalerPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [upscaled, setUpscaled] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* -------- AUTH GUARD -------- */
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) return <p>Loading session...</p>;
  if (!session?.user) return <p>Redirecting...</p>;

  const userId = session.user.id;

  /* -------- FILE SELECT -------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setUpscaled(null);
  };

  /* -------- UPSCALE -------- */
  const handleUpscale = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // 🔥 RESIZE IMAGE HERE (mobile fix)
      const resizedImage = await resizeImage(file);

      const res = await fetch("/api/upscaler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: resizedImage,
          originalImage: resizedImage,
          userId,
          scale: 2,
          faceEnhance: false,
        }),
      });

      const data: ResultUpscaler = await res.json();

      if (data.image) {
        toast.success("Image upscaled successfully!");
        setUpscaled(data.image);
      } else {
        toast.error("Upscale failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upscale failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------- UI -------- */
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          AI Image Upscaler
        </h1>
        <p className="text-zinc-400">
          Upload an image and upscale it using AI
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <input
          type="file"
          accept="image/*"
          id="fileUpload"
          className="hidden"
          onChange={handleFileChange}
        />

        <label
          htmlFor="fileUpload"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold cursor-pointer"
        >
          Choose Image
        </label>

        <button
          onClick={handleUpscale}
          disabled={!file || loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-lime-500 text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Upscaling..." : "Upscale Image"}
        </button>
      </div>

      {preview && (
        <div className="flex flex-col sm:flex-row gap-6">
          <ImageCard title="Original" src={preview} />

          {upscaled && (
            <ImageCard
              title="Upscaled"
              src={upscaled}
              showActions
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- IMAGE CARD ---------------- */
function ImageCard({
  title,
  src,
  showActions,
}: {
  title: string;
  src: string;
  showActions?: boolean;
}) {
  return (
    <div className="flex-1 bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800">
      <p className="text-sm text-zinc-400 mb-2">{title}</p>

      <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
        <Image
          src={src}
          alt={title}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      {showActions && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = src;
              a.download = "upscaled-image.png";
              a.click();
            }}
            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            ⬇ Download
          </button>

          <button
            onClick={async () => {
              await navigator.clipboard.writeText(src);
              toast.success("Link copied ✅");
            }}
            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            📋 Copy Link
          </button>
        </div>
      )}
    </div>
  );
}
