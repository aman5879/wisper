"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import axios from "axios";
import { toast } from "@/components/ui/toast";
import { MessageCircle, Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { signIn } from "next-auth/react";
import { signInSchema } from "@/schema/signInSchema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof signInSchema>
  ) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.add({
          title:
            result.error === "CredentialsSignin"
              ? "Login Failed"
              : "Error",
          description:
            result.error === "CredentialsSignin"
              ? "Incorrect username or password."
              : result.error,
          type: "error",
        });

        return;
      }

      if (result?.ok) {
        toast.add({
          title: "Success",
          description: "You have signed in successfully!",
          type: "success",
        });

        router.replace("/dashboard");
        router.refresh();
      }
    } catch {
      toast.add({
        title: "Error",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0b0910] text-[#f8f6fc] selection:bg-violet-300 selection:text-[#171022]">

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      {/* Background Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Navbar */}
      <div className="relative z-20 w-full shrink-0">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">

        {/* Sign-in Card */}
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">

          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="group mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-indigo-500/20 shadow-lg shadow-violet-950/30 transition-all duration-300 hover:border-violet-400/40 hover:shadow-violet-500/20">
              <MessageCircle
                className="h-6 w-6 text-violet-300 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.8}
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Login to{" "}
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  Wisper
                </span>
              </h1>

              <p className="text-sm leading-6 text-slate-400">
                Welcome back and continue your anonymous conversations.
              </p>
            </div>
          </div>

          {/* Sign-in Form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Username or Email */}
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="space-y-2"
                >
                  <FieldLabel
                    htmlFor="identifier"
                    className="text-sm font-medium text-slate-200"
                  >
                    Username or Email
                  </FieldLabel>

                  <Input
                    {...field}
                    id="identifier"
                    placeholder="Enter your username or email"
                    autoComplete="username"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-xl border-white/10 bg-white/5 px-4 text-white placeholder:text-slate-500 transition-all focus-visible:ring-violet-500"
                  />

                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : []}
                  />
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm font-medium text-slate-200"
                    >
                      Password
                    </FieldLabel>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-violet-300 transition-colors hover:text-violet-200 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-xl border-white/10 bg-white/5 px-4 text-white placeholder:text-slate-500 transition-all focus-visible:ring-violet-500"
                  />

                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : []}
                  />
                </Field>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white shadow-lg shadow-violet-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-violet-900/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Sign-up Link & Trust Message */}
          <div className="space-y-4 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-violet-300 transition-colors hover:text-violet-200 hover:underline"
              >
                Create account
              </Link>
            </p>

            <p className="text-xs leading-5 text-slate-500">
              Your thoughts. Your space. Your privacy.
            </p>
          </div>

        </div>
      </main>

      {/* Page Footer */}
      <div className="relative z-10 w-full shrink-0">
        <Footer />
      </div>

    </div>
  );
}
