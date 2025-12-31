"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUser } from "@/server/user";

interface ImageResponse {
  image: string;
  success: boolean;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ImageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  //   const { data: session } = useSession();
  // const userId = session?.user?.id;
  const router=useRouter()
  
  // const red=async()=>{
  //     const session= await getUser()
  //     if(!session){
  //       redirect("/login")
  //       return;
  //     }
  // }

  // red()
//

 const { data } = useSession();
  const user = data?.user;
  console.log(user)
const userId=user?.id
  


//  useEffect(() => {
//     const checkSession = async () => {
//       const session = await getUser();
//       if (!session) {
//         redirect("/login")
//   return;
       
//       }
//     };

//     checkSession();
//   }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    // console.log(e.target?.files[0])
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
   
    setResult(null);
    setImageLoaded(false);
  };
   console.log("preview",preview)

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      try {
        const res = await fetch("/api/restore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
  imageBase64: reader.result,
  userId,
  originalImage: reader.result // Halkan ku darso
})

          ,
        });

        const data: ImageResponse = await res.json();

     

        if (data.success && data.image) {
             toast.success("successfully restored")
          setResult(data);
        } else {
          alert("Image processing failed");
        }
      } catch {
        alert("Image processing failed");
      } finally {
        setLoading(false);
      }
    };
  };


  
  const handleDownload = async () => {
    if (!result?.image) return;

    const res = await fetch(result.image);
    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "restored-image.png";
    a.click();
    URL.revokeObjectURL(url);
  };

const copy = async () => {
  if (!result?.image) return;

  try {
    await navigator.clipboard.writeText(result.image);
    alert("Image link copied ✅");
  } catch (err) {
    alert("Failed to copy image link");
  }
};

//  if(!user || !user.id){
//       redirect("/login")
//       return
//   }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload Box */}
      <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-12 text-center bg-zinc-900/40">
        <h2 className="text-2xl font-bold mb-2">Upload Image</h2>
        <p className="text-zinc-400 mb-6">
          Upload an image to restore using AI
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileUpload"
        />

        <label
          htmlFor="fileUpload"
          className="cursor-pointer px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500"
        >
          Choose Image
        </label>
      </div>

      {/* Preview */}
      {preview && (
        <div className="grid md:grid-cols-2 gap-6">
          <ImageCard title="Original" src={preview} />

          {result ? (
            // <ImageCard
            //   title="Restored"
            //   src={result.image}
            //   onLoad={() => setImageLoaded(true)}
            //   showDownload={imageLoaded}
            //   onDownload={handleDownload}
            //   oncopy={copy}
            // />
            <ImageCard
  title="Restored"
  src={result.image}
  showDownload={true} // <-- hadda mar walba muujinaya
  onDownload={handleDownload}
  oncopy={copy}
/>

          ) : (
            <div className="flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
              {loading ? (
                <p className="text-zinc-400 animate-pulse">
                  Processing image...
                </p>
              ) : (
                <button
                  onClick={handleUpload}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500"
                >
                  Restore Image
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function ImageCard({
  title,
  src,
  onDownload,
  showDownload,
  onLoad,
  oncopy,
}: {
  title: string;
  src: string;
  onDownload?: () => void;
  showDownload?: boolean;
  onLoad?: () => void;
    oncopy?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <p className="text-sm text-zinc-400 mb-2">{title}</p>

      <div className="relative aspect-square rounded-xl overflow-hidden">
        <Image
          src={src}
          alt={title}
          fill
          unoptimized
          className="object-cover"
        //   onLoad={onLoad}
        />
      </div>

      {showDownload && (
       <div>
         <button
          onClick={onDownload}
          className="mt-4 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700"
        >
          ⬇ Download Image
        </button>

        <button
          onClick={oncopy}
          className="mt-4 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700"
        >
          ⬇ Copy Image
        </button>
       </div>



      )}
    </div>
  );
}
