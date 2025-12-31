import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { getUser } from "@/server/user";
import { ImageIcon, Wand2, History } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

    const session= await getUser()
  if(!session){
    redirect("/login")
    return;
  }
 
  return (
    <div className="space-y-8">
      
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<ImageIcon />} title="Images Restored" value="128" />
        <StatCard icon={<Wand2 />} title="Enhancements" value="86" />
        <StatCard icon={<History />} title="History Items" value="42" />
      </div>

      {/* Welcome */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur">
        <h3 className="text-2xl font-bold mb-2">
          Welcome to RestoreAI 👋
        </h3>
        <p className="text-zinc-400">
          Upload an image and let AI restore or enhance it in seconds.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500">
          {icon}
        </div>
        <div>
          <p className="text-zinc-400 text-sm">{title}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
        </div>
      </CardContent>
    </Card>
  );
}
