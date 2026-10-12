"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCompletion } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Loader2,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    ArrowRight,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import type { ApiResponse } from "@/types/ApiResponse";
import { messageSchema } from "@/schema/messageSchema";
import { FeedbackPromptManager } from "@/components/FeedbackPromptManager";

type MessageFormValues = z.infer<typeof messageSchema>;

const SEPARATOR = "||";

const INITIAL_SUGGESTIONS =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const parseSuggestions = (value: string): string[] =>
    value
        .split(SEPARATOR)
        .map((message) => message.trim())
        .filter(Boolean);

const focusRing =
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c4b0ff]";

const primaryBtn =
    `inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#c4b0ff] px-6 text-sm font-semibold text-[#1a1226] transition-colors hover:bg-[#d6c8ff] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

const cardStyle =
    "rounded-2xl border border-white/10 bg-[#1e1629]";

const mutedText = "text-[#b3a9c4]";
const subtleText = "text-[#9a90ac]";

export default function SendMessagePage() {
    const params = useParams<{ username: string }>();
    const username = params.username;

    const [promptId, setPromptId] = useState("");
    const [promptQuestion, setPromptQuestion] = useState("");
    const [promptLoading, setPromptLoading] = useState(false);
    const [promptError, setPromptError] = useState("");

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("promptId");

        setPromptId(id ?? "");
        setPromptQuestion("");
        setPromptError("");

        if (!id) {
            return; // Normal anonymous-message link
        }

        const controller = new AbortController();

        async function loadPrompt() {
            setPromptLoading(true);

            try {
                const response = await fetch(
                    `/api/feedback-prompts?username=${encodeURIComponent(
                        String(username)
                    )}&promptId=${encodeURIComponent(String(id))}`,
                    {
                        method: "GET",
                        cache: "no-store",
                        signal: controller.signal,
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success || !data.prompt?.question) {
                    throw new Error(
                        data.message || "This feedback link is unavailable."
                    );
                }

                setPromptQuestion(data.prompt.question);
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }

                setPromptError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load this feedback question."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setPromptLoading(false);
                }
            }
        }

        void loadPrompt();

        return () => controller.abort();
    }, [username]);

    const {
        complete,
        completion,
        isLoading: isSuggesting,
        error: suggestError,
    } = useCompletion({
        api: "/api/suggest-messages",
        initialCompletion: INITIAL_SUGGESTIONS,
        streamProtocol: "text",
    });

    const form = useForm<MessageFormValues>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            senderUsername: "",
            content: "",
        },
    });

    const { isSubmitting } = form.formState;
    const messageContent = form.watch("content");

    const onSubmit = async (data: MessageFormValues) => {
        try {
            const response = await fetch("/api/send-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    username,
                    ...(promptId ? { promptId } : {}),
                }),
            });

            const result: ApiResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message ?? "Failed to send message");
                return;
            }

            toast.success(
                result.message ?? "Message sent successfully!"
            );

            form.reset({
                senderUsername: "",
                content: "",
            });
        } catch {
            toast.error("Failed to send message. Please try again.");
        }
    };

    const handleSuggestMessages = async () => {
        try {
            await complete("");
        } catch {
            toast.error("Failed to generate message suggestions");
        }
    };

    const handleSelectSuggestion = (message: string) => {
        form.setValue("content", message, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    const suggestions = parseSuggestions(completion);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#150f1d] font-sans text-[#f3eefa] selection:bg-[#c4b0ff] selection:text-[#1a1226]">
            {/* Background decoration */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(196,176,255,0.09),transparent_65%)]"
            />

            <div className="relative mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
                {/* Brand header */}
                <header className="mb-10 flex items-center justify-between border-b border-white/10 pb-5">
                    <Link
                        href="/"
                        aria-label="Wisper home"
                        className={`flex items-center gap-3 rounded-lg ${focusRing}`}
                    >
                        <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[#1e1629]">
                            <MessageCircle className="size-5 text-[#c4b0ff]" />
                        </div>

                        <span className="text-2xl font-semibold tracking-tight">
                            wisper<span className="text-[#c4b0ff]">.</span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-2 text-xs text-[#b3a9c4] sm:flex">
                        <ShieldCheck className="size-4 text-[#c4b0ff]" />
                        Anonymous messaging
                    </div>
                </header>


                {/* Page heading */}
                {promptId ? (
                    <section className="mb-10 max-w-2xl">
                        {promptLoading ? (
                            <p className="mb-4 text-sm text-gray-400">
                                Loading feedback question...
                            </p>
                        ) : promptError ? (
                            <div
                                role="alert"
                                className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
                            >
                                {promptError}
                            </div>
                        ) : (
                            <>
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c4b0ff]/20 bg-[#c4b0ff]/[0.07] px-3 py-1.5 text-xs font-medium text-[#d9ccff]">
                                    <MessageCircle className="size-3.5" />
                                    A PRIVATE FEEDBACK FROM @{username}
                                </div>

                                <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                                    Some things are easier
                                    <br className="hidden sm:block" /> to say anonymously.
                                </h1>

                                <div className="mt-6 rounded-xl border border-violet-400/20 bg-violet-500/[0.07] p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                                        {username} ask your thaught's
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap break-words text-base font-medium leading-7 text-white">
                                        {promptQuestion}
                                    </p>
                                </div>
                            </>
                        )}
                    </section>
                ) : (
                    <section className="mb-10 max-w-2xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c4b0ff]/20 bg-[#c4b0ff]/[0.07] px-3 py-1.5 text-xs font-medium text-[#d9ccff]">
                            <MessageCircle className="size-3.5" />
                            A PRIVATE MESSAGE FOR @{username}
                        </div>

                        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                            Some things are easier
                            <br className="hidden sm:block" /> to say anonymously.
                        </h1>

                        <p className={`mt-4 max-w-xl text-base leading-7 ${mutedText}`}>
                            Send a thoughtful message, share something on your mind,
                            or say what you have always wanted to say. Your identity
                            stays hidden.
                        </p>
                    </section>
                )}


                {/* Main content */}
                <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    {/* Send message form */}
                    <section className={`${cardStyle} p-5 sm:p-7`}>
                        <div className="mb-6 flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#c4b0ff]/15 bg-[#c4b0ff]/[0.08]">
                                <MessageCircle className="size-5 text-[#c4b0ff]" />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">
                                    Send a message
                                </h2>
                                <p className={`mt-1 text-sm leading-6 ${mutedText}`}>
                                    Write whatever is on your mind.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5">

                            <div className="space-y-2">
                                <label
                                    htmlFor="sender-username"
                                    className="text-sm font-medium text-white/85"
                                >
                                    Your username
                                </label>

                                <Input
                                    id="sender-username"
                                    placeholder="Enter any username..."
                                    maxLength={30}
                                    autoComplete="off"
                                    disabled={isSubmitting}
                                    {...form.register("senderUsername")}
                                    className="h-12 rounded-xl border-white/10 bg-[#150f1d] text-white placeholder:text-[#9a90ac] focus-visible:ring-[#c4b0ff]"
                                />

                                <p className={`text-xs leading-5 ${mutedText}`}>
                                    Choose any name you like. No account or identity verification required.
                                </p>

                                {form.formState.errors.senderUsername && (
                                    <p className="text-sm text-red-400">
                                        {form.formState.errors.senderUsername.message}
                                    </p>
                                )}
                            </div>
                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="message-content"
                                            className="text-sm font-medium text-white/85"
                                        >
                                            Your message to @{username}
                                        </FieldLabel>

                                        <Textarea
                                            {...field}
                                            id="message-content"
                                            placeholder="Write your anonymous message here..."
                                            className={`min-h-40 resize-y rounded-xl border-white/10 bg-[#150f1d] px-4 py-3 text-sm leading-6 text-white placeholder:text-[#9a90ac] focus-visible:ring-[#c4b0ff] ${focusRing}`}
                                            aria-invalid={fieldState.invalid}
                                            disabled={isSubmitting}
                                        />

                                        <FieldDescription className={`text-xs leading-5 ${mutedText}`}>
                                            Your identity stays hidden. @{username} will
                                            receive your message.
                                        </FieldDescription>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <p className={`flex items-center gap-2 text-xs ${subtleText}`}>
                                    <ShieldCheck className="size-4 text-[#c4b0ff]" />
                                    Your message is anonymous
                                </p>

                                <Button
                                    type="submit"
                                    disabled={
                                        isSubmitting || !messageContent?.trim()
                                    }
                                    className={`${primaryBtn} w-full sm:w-auto`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send message
                                            <ArrowRight className="size-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </section>

                    {/* AI suggestions */}
                    <section className={`${cardStyle} p-5 sm:p-7`}>
                        <div className="mb-5 flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#ffc9a3]/15 bg-[#ffc9a3]/[0.08]">
                                <Sparkles className="size-5 text-[#ffc9a3]" />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">
                                    Message suggestions
                                </h2>

                                <p className={`mt-1 text-sm leading-6 ${mutedText}`}>
                                    Not sure what to say? Find a little inspiration.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleSuggestMessages}
                            disabled={isSuggesting}
                            className={`${primaryBtn} w-full`}
                        >
                            {isSuggesting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Generating suggestions...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4" />
                                    Generate suggestions
                                </>
                            )}
                        </Button>

                        <Separator className="my-6 bg-white/10" />

                        <div className="mb-4">
                            <h3 className="text-sm font-semibold">
                                Try one of these
                            </h3>
                            <p className={`mt-1 text-xs leading-5 ${subtleText}`}>
                                Select any suggestion to add it to your message.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {suggestError ? (
                                <div className="rounded-xl border border-[#ffc9a3]/20 bg-[#ffc9a3]/[0.05] p-4">
                                    <p className="text-sm text-[#ffc9a3]">
                                        Failed to generate suggestions. Please try again.
                                    </p>
                                </div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map((message, index) => (
                                    <Button
                                        key={`${message}-${index}`}
                                        type="button"
                                        variant="outline"
                                        className={`h-auto min-h-12 w-full justify-start whitespace-normal rounded-xl border-white/10 bg-[#150f1d] px-4 py-3 text-left text-sm font-normal leading-6 text-white/80 transition-colors hover:border-[#c4b0ff]/30 hover:bg-[#c4b0ff]/[0.06] hover:text-white ${focusRing}`}
                                        onClick={() => handleSelectSuggestion(message)}
                                    >
                                        <span className="mr-2 shrink-0 text-[#c4b0ff]">
                                            {index + 1}.
                                        </span>
                                        <span>{message}</span>
                                    </Button>
                                ))
                            ) : (
                                <p className={`py-5 text-center text-sm ${mutedText}`}>
                                    No suggestions available yet.
                                </p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Signup CTA */}

                <section className="mt-8 rounded-2xl border border-white/10 bg-[#1e1629] p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                Want your own message board?
                            </h2>

                            <p className={`mt-2 max-w-lg text-sm leading-6 ${mutedText}`}>
                                Create your own account, share your personal link,
                                and start receiving anonymous messages.
                            </p>
                        </div>

                        <Link
                            href="/sign-up"
                            className={`${primaryBtn} shrink-0 inline-flex items-center justify-center gap-2`}
                        >
                            Create your account
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </section>


                {/* Footer */}
                <footer className="mt-10 border-t border-white/10 py-7 text-center">
                    <p className={`text-xs ${subtleText}`}>
                        Made with care for your honest conversations.
                    </p>

                    <p className={`mt-2 text-l ${subtleText}`}>
                        Wisper
                    </p>
                </footer>
            </div>
        </main>
    );
}