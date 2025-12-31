"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/server/user";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      toast.success("Successfully logged in");

      setError("");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-xl bg-white/80 backdrop-blur-md border border-gray-200">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Welcome Back 👋
          </h2>

          <p className="text-center text-gray-600 mb-8">
            Login to your account
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-center text-red-800">{error && <>{error}</>}</h1>
            <div>
              <label className="text-gray-700 text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="mt-1 rounded-xl"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="mt-1 rounded-xl"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* OAuth Buttons */}
            <div className="flex flex-col gap-3">
              {/* GOOGLE LOGIN BUTTON */}
              <button
                type="button"
                className="flex items-center justify-center gap-3 border border-gray-700 bg-gray-900 rounded-xl p-3 hover:bg-gray-800 transition-colors text-gray-300"
                onClick={() =>
                  signIn.social({
                    provider: "google",
                    callbackURL: "/dashboard",
                  })
                }
              >
                <span className="text-yellow-400">🔒</span>
                <span>Continue with Google</span>
              </button>

              {/* GITHUB LOGIN */}
              <button
                type="button"
                className="flex items-center justify-center gap-3 border border-gray-700 bg-gray-900 rounded-xl p-3 hover:bg-gray-800 transition-colors text-gray-300"
                onClick={() =>
                  signIn.social({
                    provider: "github",
                    callbackURL: "/dashboard",
                  })
                }
              >
                <span className="text-gray-400">🐙</span>
                <span>Continue with GitHub</span>
              </button>
            </div>

            <Button className="w-full py-3 rounded-xl text-lg mt-4" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
 