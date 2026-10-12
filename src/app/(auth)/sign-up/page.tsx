"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
// import { toast } from "sonner";
import { toast } from "@/components/ui/toast"
import Link from "next/link";
import { MessageCircle, Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldLabel,
    FieldError,
    FieldDescription,
} from "@/components/ui/field";

import { signUpSchema } from "@/schema/signUpSchema";
import type { ApiResponse } from "@/types/ApiResponse";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";



export default function SignUpForm() {
    const [username, setUsername] = useState("");
    const [debouncedUsername, setDebouncedUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const debounced = useDebounceCallback(
        (value: string) => setDebouncedUsername(value.trim()),
        600
    );

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        setUsernameMessage("");
        setIsCheckingUsername(false);
        debounced(value);
    };

    useEffect(() => {
        if (!debouncedUsername) {
            setUsernameMessage("");
            setIsCheckingUsername(false);
            return;
        }

        // Ignore results from outdated requests.
        const controller = new AbortController();

        const checkUsername = async () => {
            setIsCheckingUsername(true);
            setUsernameMessage("");

            try {
                const response = await fetch(
                    `/api/check-username-unique?username=${encodeURIComponent(
                        debouncedUsername
                    )}`,
                    {
                        signal: controller.signal,
                    }
                );

                const result = await response.json();

                if (controller.signal.aborted) return;

                if (!response.ok) {
                    setUsernameMessage(
                        result.message ??
                        "Unable to check username availability."
                    );
                    return;
                }

                setUsernameMessage(
                    result.message ??
                    "Unable to check username availability."
                );
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                if (!controller.signal.aborted) {
                    console.error("Error checking username:", error);
                    setUsernameMessage(
                        "Unable to check username availability."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsCheckingUsername(false);
                }
            }
        };

        void checkUsername();

        return () => {
            controller.abort();
        };
    }, [debouncedUsername]);

    const onSubmit = async (
        data: z.infer<typeof signUpSchema>
    ) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post<ApiResponse>(
                "/api/sign-up",
                data
            );

            toast.add({
                title: "Success",
                description: response.data.message,
                type: "success",
            });

            router.replace(
                `/verify/${encodeURIComponent(data.username)}`
            );
        } catch (error) {
            console.error("Error during sign-up:", error);

            const axiosError = error as AxiosError<ApiResponse>;

            const errorMessage =
                axiosError.response?.data?.message ??
                "There was a problem with your sign-up. Please try again.";

            toast.add({
                title: "Sign Up Failed",
                description: errorMessage,
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

                {/* Signup Card */}
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
                                Join Wisper
                            </h1>

                            <p className="text-sm leading-6 text-slate-400">
                                Share your thoughts anonymously and receive honest feedback.
                            </p>
                        </div>

                    </div>

                    {/* Signup Form */}
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >

                        {/* Username */}
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="space-y-2"
                                >
                                    <FieldLabel
                                        htmlFor="username"
                                        className="text-sm font-medium text-slate-200"
                                    >
                                        Choose a username
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="username"
                                        placeholder="e.g. your_username"
                                        autoComplete="username"
                                        aria-invalid={fieldState.invalid}
                                        className="h-11 rounded-xl border-white/10 bg-white/5 px-4 text-white placeholder:text-slate-500 transition-all focus-visible:ring-violet-500"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleUsernameChange(e.target.value);
                                        }}
                                    />

                                    <div className="flex min-h-5 items-center gap-2">
                                        {isCheckingUsername && (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                                                <p className="text-xs text-slate-400">
                                                    Checking username availability...
                                                </p>
                                            </>
                                        )}

                                        {!isCheckingUsername && usernameMessage && (
                                            <p
                                                className={`text - xs ${usernameMessage === "Username is unique"
                                                        ? "text-emerald-400"
                                                        : "text-rose-400"
                                                    } `}
                                            >
                                                {usernameMessage === "Username is unique"
                                                    ? "✓ Username is available"
                                                    : usernameMessage}
                                            </p>
                                        )}
                                    </div>

                                    <FieldError
                                        errors={fieldState.error ? [fieldState.error] : []}
                                    />
                                </Field>
                            )}
                        />

                        {/* Email */}
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="space-y-2"
                                >
                                    <FieldLabel
                                        htmlFor="email"
                                        className="text-sm font-medium text-slate-200"
                                    >
                                        Email address
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        aria-invalid={fieldState.invalid}
                                        className="h-11 rounded-xl border-white/10 bg-white/5 px-4 text-white placeholder:text-slate-500 transition-all focus-visible:ring-violet-500"
                                    />

                                    <FieldDescription className="text-xs leading-5 text-slate-400">
                                        We'll send you a verification code to confirm your email address.
                                    </FieldDescription>

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
                                    <FieldLabel
                                        htmlFor="password"
                                        className="text-sm font-medium text-slate-200"
                                    >
                                        Create a password
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="password"
                                        type="password"
                                        placeholder="Create a strong password"
                                        autoComplete="new-password"
                                        aria-invalid={fieldState.invalid}
                                        className="h-11 rounded-xl border-white/10 bg-white/5 px-4 text-white placeholder:text-slate-500 transition-all focus-visible:ring-violet-500"
                                    />

                                    <FieldDescription className="text-xs leading-5 text-slate-400">
                                        Use a strong, unique password to help protect your account.
                                    </FieldDescription>

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
                            className="group h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white shadow-lg shadow-violet-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-violet-900/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating your account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>

                    </form>

                    {/* Sign In & Trust Message */}
                    <div className="space-y-4 border-t border-white/10 pt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link
                                href="/sign-in"
                                className="font-semibold text-violet-300 transition-colors hover:text-violet-200 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>

                        <p className="text-xs leading-5 text-slate-500">
                            Join the conversation. Share your thoughts. Keep it respectful.
                        </p>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <div className="relative z-10 w-full shrink-0">
                <Footer />
            </div>

        </div>
    );
}