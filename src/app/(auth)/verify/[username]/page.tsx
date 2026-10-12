'use client';

import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type infer as zInfer } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/toast";
import { MessageCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";

import type { ApiResponse } from "@/types/ApiResponse";
import { verifySchema } from "@/schema/verifySchema";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();

    const form = useForm<zInfer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: zInfer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(
                "/api/verify-code",
                {
                    username: params.username,
                    code: data.code,
                }
            );

            toast.add({
                title: "Success",
                description: response.data.message,
                type: "success",
            });

            router.replace("/sign-in");
        } catch (error: unknown) {
            let message = "An error occurred. Please try again.";

            if (axios.isAxiosError<ApiResponse>(error)) {
                message =
                    error.response?.data?.message ??
                    error.message ??
                    message;
            }

            toast.add({
                title: "Verification Failed",
                description: message,
                type: "error",
            });
        }
    };


    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0b0910] text-[#f8f6fc] selection:bg-violet-300 selection:text-[#171022]">

            {/* Background Glow Effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
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

                {/* Verification Card */}
                <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-violet-950/30 backdrop-blur-2xl sm:p-10">

                    {/* Icon */}
                    <div className="group mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-indigo-500/20 shadow-lg shadow-violet-950/30 transition-all duration-300 hover:border-violet-400/40 hover:shadow-violet-500/20">
                        <MessageCircle
                            className="h-6 w-6 text-violet-300 transition-transform duration-300 group-hover:scale-110"
                            strokeWidth={1.8}
                        />
                    </div>

                    {/* Heading */}
                    <div className="mb-8 mt-4 space-y-3 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Verify{" "}
                            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                Wisper
                            </span>
                        </h1>

                        <p className="mx-auto max-w-xs text-sm leading-6 text-slate-400">
                            Verify your account. You're almost there!
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="space-y-2"
                                >
                                    <FieldLabel
                                        htmlFor="code"
                                        className="text-sm font-medium text-slate-200"
                                    >
                                        Verification Code
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="code"
                                        placeholder="Enter your verification code"
                                        autoComplete="one-time-code"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 transition-all duration-200 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/20"
                                    />

                                    <FieldError
                                        errors={
                                            fieldState.error
                                                ? [fieldState.error]
                                                : []
                                        }
                                    />
                                </Field>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="group h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white shadow-lg shadow-violet-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-violet-900/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify Account
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Card Footer */}
                    <div className="mt-7 flex flex-col items-center gap-2 border-t border-white/[0.08] pt-5 text-center">
                        <p className="text-xs leading-5 text-slate-500">
                            Secure account verification
                            <span className="mx-2 text-slate-700">•</span>
                            Your account, your privacy
                        </p>

                        <Link
                            href="/"
                            className="text-xs leading-5 text-slate-500 transition-colors hover:text-violet-300"
                        >
                            Go Home
                        </Link>
                    </div>

                </div>
            </main>

            {/* Page Footer */}
            <div className="relative z-10 w-full shrink-0">
                <Footer />
            </div>

        </div>
    );
};

export default VerifyAccount;
