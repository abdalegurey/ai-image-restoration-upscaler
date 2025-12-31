"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { toast } from "sonner";

interface ResultUpscaler {
  url: string;
}

export default function UpscalerPage() {


 const { data } = useSession();
  const user = data?.user;
  console.log(user)
const userId=user?.id
console.log("useid",userId)
  //  if(!user){
  //     redirect("/login")
  //   }


  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [upscaled, setUpscaled] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setUpscaled(null);
  };

  const handleUpscale = async () => {
    if (!file) return;
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/upscaler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: reader.result, userId,
  originalImage: reader.result }),
        });
        const data: ResultUpscaler = await res.json();
        if (data.url) {
          toast.success("Image upscaled!");
          setUpscaled(data.url);
        } else {
          alert("Upscale failed!");
        }
      } catch {
        alert("Upscale failed!");
      } finally {
        setLoading(false);
      }
    };
  };

  const handleDownload = () => {
    if (!upscaled) return;
    const a = document.createElement("a");
    a.href = upscaled;
    a.download = "upscaled-image.png";
    a.click();
  };

  const handleCopy = async () => {
    if (!upscaled) return;
    try {
      await navigator.clipboard.writeText(upscaled);
      toast.success("Link copied ✅");
    } catch {
      alert("Failed to copy link");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Upscale Image</h1>
        <p className="text-zinc-400 mb-6">Upload an image to upscale using AI</p>
      </div>

      {/* Upload */}
      <div className="flex justify-center mb-6 gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold cursor-pointer hover:from-indigo-500 hover:to-cyan-400 transition"
        >
          Choose Image
        </label>

        <button
          onClick={handleUpscale}
          disabled={!file || loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-lime-500 text-white font-semibold hover:from-green-500 hover:to-lime-400 disabled:opacity-50 transition"
        >
          {loading ? "Upscaling..." : "Upscale Image"}
        </button>
      </div>

      {/* Before / After */}
      {preview && (
        <div className="flex flex-col sm:flex-row gap-6">
          <ImageCard title="Original" src={preview} />
          {upscaled && (
            <ImageCard
              title="Upscaled"
              src={upscaled}
              showDownload
              onDownload={handleDownload}
              onCopy={handleCopy}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ImageCard({
  title,
  src,
  showDownload,
  onDownload,
  onCopy,
}: {
  title: string;
  src: string;
  showDownload?: boolean;
  onDownload?: () => void;
  onCopy?: () => void;
}) {
  return (
    <div className="flex-1 bg-zinc-900/60 rounded-2xl p-4 shadow-lg border border-zinc-800">
      <p className="text-sm text-zinc-400 mb-2">{title}</p>
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
        <Image src={src} alt={title} fill unoptimized className="object-cover" />
      </div>

      {showDownload && (
        <div className="flex flex-col gap-2">
          <button
            onClick={onDownload}
            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            ⬇ Download
          </button>
          <button
            onClick={onCopy}
            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            📋 Copy Link
          </button>
        </div>
      )}
    </div>
  );
}
