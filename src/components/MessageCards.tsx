"use client";

import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { X, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import type { Message } from "@/modules/User";
import type { ApiResponse } from "@/types/ApiResponse";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

export function MessageCard({
    message,
    onMessageDelete,
}: MessageCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteConfirm = async () => {
        if (isDeleting) return;

        setIsDeleting(true);

        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message/${message._id}`
            );

            toast.success("Message deleted", {
                description: response.data.message,
            });

            onMessageDelete(message._id.toString());
        } catch (error: unknown) {
            const errorMessage = axios.isAxiosError<ApiResponse>(error)
                ? error.response?.data?.message ??
                "Failed to delete message. Please try again."
                : "Something went wrong. Please try again.";

            toast.error("Unable to delete message", {
                description: errorMessage,
            });
        } finally {
            setIsDeleting(false);
        }
    };


    return (
        <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 text-white shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-950/20">
            {/* Subtle accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-60" />

            <CardHeader className="space-y-4 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                            <MessageCircle
                                className="h-5 w-5 text-violet-300"
                                strokeWidth={1.8}
                            />
                        </div>

                        <div className="min-w-0 pt-1">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                {message.promptText
                                    ? "Feedback response"
                                    : "Anonymous message"}
                            </p>

                            <p className="break-words text-sm font-semibold text-white">
                                {message.senderUsername?.trim() ||
                                    "Unknown sender"}
                            </p>

                            {/* <p className="mt-1 text-xs text-violet-300">
                                Unverified username
                            </p> */}

                            <p className="mt-1 text-xs text-slate-400">
                                {dayjs(message.createdAt).format(
                                    "MMM D, YYYY · h:mm A"
                                )}
                            </p>
                        </div>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger
                            render={
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={isDeleting}
                                    aria-label="Delete message"
                                    className="h-9 w-9 shrink-0 rounded-xl text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            }
                        />

                        <AlertDialogContent className="border border-white/10 bg-slate-950 text-white sm:rounded-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg font-semibold text-white">
                                    Delete this message?
                                </AlertDialogTitle>

                                <AlertDialogDescription className="leading-6 text-slate-400">
                                    This action cannot be undone. This message
                                    will be permanently deleted from your account.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white">
                                    Cancel
                                </AlertDialogCancel>

                                <AlertDialogAction
                                    onClick={(event) => {
                                        event.preventDefault();
                                        void handleDeleteConfirm();
                                    }}
                                    disabled={isDeleting}
                                    className="bg-red-600 font-medium text-white hover:bg-red-500 focus-visible:ring-red-500"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete message"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 px-5 pb-6 pt-0 sm:px-6">
                {/* Original custom feedback question */}
                {message.promptText && (
                    <div className="rounded-xl border border-violet-400/20 bg-violet-500/[0.07] p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-violet-300" />

                            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                                Response to
                            </p>
                        </div>

                        <p className="whitespace-pre-wrap break-words text-sm font-medium leading-6 text-violet-100">
                            {message.promptText}
                        </p>
                    </div>
                )}


                {/* Sender's answer */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {message.promptText ? "Answer" : "Response"}
                    </p>

                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">
                        {message.content}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}