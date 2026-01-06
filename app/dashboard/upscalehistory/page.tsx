"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Copy, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface UpscalerItem {
  id: string;
  userId: string;
  originalImage: string;
  upscalerImage: string;
  createdAt: string;
}

const UpscaleHistoryPage = () => {
  const [data, setData] = useState<UpscalerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session, error, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!isPending && !session?.user) {
        router.push("/login");
        return;
      }

      if (isPending) return;

      try {
        const res = await fetch("/api/readaupscaler");
        if (!res.ok) throw new Error("Failed to fetch upscaler history");

        const json = await res.json();
        const cleaned = json.allupscaler.map((item: UpscalerItem) => ({
          ...item,
          upscalerImage: item.upscalerImage?.replace(/"/g, ""),
        }));

        setData(cleaned);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, isPending, router]);

  const downloadImage = (base64: string, filename: string) => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = filename;
    link.click();
  };

  const copyImage = async (base64: string) => {
    await navigator.clipboard.writeText(base64);
    alert("Image copied!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-8xl space-y-10 p-6">
      <h2 className="text-3xl font-bold tracking-tight">Upscaler History</h2>
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-lg font-semibold">No history yet</p>
          <p className="text-zinc-500 text-sm mt-1">
            Your Upscaler images will appear here once you process one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-4 transition hover:border-zinc-700 hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <p className="text-xs text-zinc-500 mb-3">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-zinc-400">Original</p>
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-800">
                    <Image src={item.originalImage} alt="Original" fill className="object-cover" unoptimized />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-zinc-400">Upscaler</p>
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-800">
                    <Image src={item.upscalerImage} alt="Upscaler" fill className="object-cover" unoptimized />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => copyImage(item.upscalerImage)}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => downloadImage(item.upscalerImage, `restored-${item.id}.png`)}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpscaleHistoryPage;
