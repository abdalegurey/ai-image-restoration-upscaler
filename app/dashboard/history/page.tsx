"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Copy, Loader2 } from "lucide-react";

interface RestoreItem {
  id: string;
  userId: string;
  originalImage: string;   
  restoredImage: string;   
  createdAt: string;
}

type RestoreResponse = {
  allrestore: RestoreItem[];
};

export default function HistoryPage() {
  const [data, setData] = useState<RestoreItem[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchdata = async () => {
    try {
      const restore = await fetch("/api/readrestore");

      if (!restore.ok) {
        throw new Error("Failed to fetch restore history");
      }

       const res = await restore.json();
    const cleaned = res.allrestore.map((item: RestoreItem) => ({
          ...item,
          restoredImage: item.restoredImage?.replace(/"/g, ""),
        }));

        setData(cleaned);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchdata();
}, []);



  console.log(data)
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
   <div className=" max-w-8xl   space-y-10">
  {/* Header */}
  <div className="flex flex-col gap-2">
    <h2 className="text-3xl font-bold tracking-tight">
      Restoration History
    </h2>
    <p className="text-zinc-400 max-w-xl">
      Review and manage your previously restored and enhanced images.
    </p>
  </div>

  {/* Empty state */}
  {data.length === 0 && (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
      <p className="text-lg font-semibold">No history yet</p>
      <p className="text-zinc-500 text-sm mt-1">
        Your restored images will appear here once you process one.
      </p>
    </div>
  )}

  {/* Grid */}
  <div className="grid grid-cols-1 gap-6">
    {data.map((item) => (
      <div
        key={item.id}
        className="group relative rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-4 transition hover:border-zinc-700 hover:shadow-xl hover:shadow-indigo-500/10"
      >
        {/* Date */}
        <p className="text-xs text-zinc-500 mb-3">
          {new Date(item.createdAt).toLocaleDateString()}
        </p>

        {/* Images */}
        <div className="grid grid-cols-2 gap-3">
          {/* Original */}
          <div className="space-y-1">
            <p className="text-xs text-zinc-400">Original</p>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-800">
              <Image
                src={item.originalImage}
                alt="Original"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Restored */}
          <div className="space-y-1">
            <p className="text-xs text-zinc-400">Restored</p>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-800">
              <Image
                src={item.restoredImage}
                alt="Restored"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => copyImage(item.restoredImage)}
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>

          <Button
            size="sm"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            onClick={() =>
              downloadImage(
                item.restoredImage,
                `restored-${item.id}.png`
              )
            }
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}
