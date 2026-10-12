"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type FeedbackPrompt = {
    _id: string;
    username: string;
    question: string;
    isActive: boolean;
    createdAt?: string;
};

type FeedbackPromptsResponse = {
    success: boolean;
    message?: string;
    prompts?: FeedbackPrompt[];
    prompt?: FeedbackPrompt;
};

type FeedbackPromptManagerProps = {
    username: string;
};

export function FeedbackPromptManager({
    username,
}: FeedbackPromptManagerProps) {
    const [question, setQuestion] = useState("");
    const [prompts, setPrompts] = useState<FeedbackPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const fetchPrompts = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/feedback-prompts", {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store",
            });

            const data: FeedbackPromptsResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load feedback questions."
                );
            }

            setPrompts(data.prompts ?? []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while loading questions."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchPrompts();
    }, [fetchPrompts]);

    async function handleCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedQuestion = question.trim();

        if (trimmedQuestion.length < 5 || trimmedQuestion.length > 500) {
            setError("Your question must contain 5–500 characters.");
            return;
        }

        setCreating(true);
        setError("");
        setNotice("");

        try {
            const response = await fetch("/api/feedback-prompts", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: trimmedQuestion,
                }),
            });

            const data: FeedbackPromptsResponse = await response.json();

            if (!response.ok || !data.success || !data.prompt) {
                throw new Error(
                    data.message || "Failed to create your feedback question."
                );
            }

            setPrompts((current) => [
                data.prompt!,
                ...current.filter((item) => item._id !== data.prompt!._id),
            ]);

            setQuestion("");
            setNotice("Your feedback question was created successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while creating your question."
            );
        } finally {
            setCreating(false);
        }
    }

    function getFeedbackLink(promptId: string) {
        const baseUrl =
            typeof window !== "undefined" ? window.location.origin : "";

        return `${baseUrl}/u/${encodeURIComponent(
            username
        )}?promptId=${encodeURIComponent(promptId)}`;
    }

    async function handleCopyLink(prompt: FeedbackPrompt) {
        setError("");
        setNotice("");

        const link = getFeedbackLink(prompt._id);

        try {
            await navigator.clipboard.writeText(link);
            setCopiedId(prompt._id);
            setNotice("Feedback link copied! Share it with anyone.");
        } catch {
            setError(
                "Couldn't copy automatically. Copy the link displayed below instead."
            );
        }
    }

    return (
        <section className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div>
                <h2 className="text-xl font-bold text-white">
                    Custom feedback links
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                    Create your own questions and share a dedicated anonymous
                    feedback link. People can answer without creating an
                    account.
                </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
                <label
                    htmlFor="feedback-question"
                    className="block text-sm font-medium text-gray-200"
                >
                    What do you want to ask?
                </label>

                <textarea
                    id="feedback-question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="e.g. What should I improve about my portfolio?"
                    minLength={5}
                    maxLength={500}
                    required
                    rows={3}
                    disabled={creating}
                    className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 disabled:opacity-60"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-gray-500">
                        {question.trim().length}/500 characters · Minimum 5
                    </span>

                    <button
                        type="submit"
                        disabled={
                            creating ||
                            question.trim().length < 5 ||
                            question.trim().length > 500
                        }
                        className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {creating ? "Creating..." : "Create feedback link"}
                    </button>
                </div>
            </form>

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
                >
                    {error}
                </div>
            )}

            {notice && (
                <div
                    role="status"
                    className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300"
                >
                    {notice}
                </div>
            )}

            <div className="border-t border-white/10 pt-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">
                        Your questions
                    </h3>

                    <button
                        type="button"
                        onClick={() => void fetchPrompts()}
                        disabled={loading}
                        className="text-sm text-violet-300 transition hover:text-violet-200 disabled:opacity-50"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <p className="text-sm text-gray-400">
                        Loading your questions...
                    </p>
                ) : prompts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                        <p className="text-sm text-gray-300">
                            You haven&apos;t created any feedback questions yet.
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Create your first question above to get a custom link.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {prompts.map((prompt) => {
                            const link = getFeedbackLink(prompt._id);

                            return (
                                <article
                                    key={prompt._id}
                                    className="rounded-xl border border-white/10 bg-black/20 p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <p className="whitespace-pre-wrap break-words text-sm font-medium leading-6 text-white">
                                            {prompt.question}
                                        </p>

                                        <span
                                            className={`shrink-0 rounded-full px-2 py-1 text-xs ${prompt.isActive
                                                    ? "bg-emerald-500/10 text-emerald-300"
                                                    : "bg-gray-500/10 text-gray-400"
                                                }`}
                                        >
                                            {prompt.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                    <label
                                        htmlFor={`feedback-link-${prompt._id}`}
                                        className="mt-4 block text-xs text-gray-400"
                                    >
                                        Share this link
                                    </label>

                                    <input
                                        id={`feedback-link-${prompt._id}`}
                                        readOnly
                                        value={link}
                                        onFocus={(event) =>
                                            event.currentTarget.select()
                                        }
                                        className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-300 outline-none focus:border-violet-500"
                                    />

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                void handleCopyLink(prompt)
                                            }
                                            disabled={!prompt.isActive}
                                            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {copiedId === prompt._id
                                                ? "Copy again"
                                                : "Copy feedback link"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.open(
                                                    link,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                )
                                            }
                                            disabled={!prompt.isActive}
                                            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Preview link
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
