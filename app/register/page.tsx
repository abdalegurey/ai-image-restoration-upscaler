"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signup } from "@/server/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";


type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const [loading, setLoading]= useState(false)
  const [error, setError]=useState("")
  const router=useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await signup(data.email, data.password);

    toast.success("succesfully Regsister")
      router.push("/login")
      setError("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-xl bg-white/80 backdrop-blur-md border border-gray-200">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Create Account ✨
          </h2>

          <p className="text-center text-gray-600 mb-8">Sign up to get started</p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
               <h1 className="text-center text-red-800">{error && <>{error}</>}</h1>
            <div>
              <label className="text-gray-700 text-sm font-medium">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                className="mt-1 rounded-xl"
                {...register("fullName", { required: "Full name is required", minLength: { value: 3, message: "Full name must be at least 3 characters" } })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

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
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              className="w-full py-3 rounded-xl text-lg mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
