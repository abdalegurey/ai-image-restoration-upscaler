"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ImageIcon, Wand2, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F] text-white">
      
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-48 -left-48 w-[520px] h-[520px] bg-indigo-600/30 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 -right-48 w-[520px] h-[520px] bg-cyan-500/20 rounded-full blur-[140px]" />
      </div>

      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-6 backdrop-blur-md">
        <h1 className="text-2xl font-extrabold tracking-wide">
          Restore
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            AI
          </span>
        </h1>

        <div className="flex gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-zinc-300 hover:text-white"
            >
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button className="bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-500/30 hover:scale-105 transition">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mt-36 px-6 text-center">
        <h2 className="text-6xl md:text-7xl font-extrabold leading-tight max-w-5xl mx-auto">
          Restore, Enhance & Upscale Images with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            AI Precision
          </span>
        </h2>

        <p className="mt-8 text-lg text-zinc-400 max-w-2xl mx-auto">
          Bring old, blurry, and low-quality photos back to life using
          next-generation AI restoration and upscaling technology.
        </p>

        <div className="mt-12 flex justify-center gap-5 flex-wrap">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-xl shadow-indigo-500/40 hover:scale-105 transition"
            >
              Upload Image
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
          >
            Live Demo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mt-44 max-w-6xl mx-auto px-8 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <ImageIcon className="h-10 w-10 text-cyan-400" />,
            title: "Photo Restoration",
            desc: "Repair damaged, old, or blurry photos automatically using AI.",
          },
          {
            icon: <Wand2 className="h-10 w-10 text-purple-400" />,
            title: "Smart Enhancement",
            desc: "Enhance resolution, clarity, and details with one click.",
          },
          {
            icon: <Sparkles className="h-10 w-10 text-emerald-400" />,
            title: "Fast & Secure",
            desc: "Lightning-fast processing with privacy-first infrastructure.",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="group bg-zinc-900/60 border-zinc-800 backdrop-blur-xl hover:border-zinc-600 transition"
          >
            <CardContent className="p-8">
              <div className="mb-5 group-hover:scale-110 transition">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-44 py-12 text-center text-zinc-500 text-sm">
        © {new Date().getFullYear()} RestoreAI · Built with Next.js & AI
      </footer>
    </div>
  );
}
