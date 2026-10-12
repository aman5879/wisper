"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import {
  Loader2,
  RefreshCcw,
  Copy,
  LogOut,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Inbox,
  CheckCircle2,
  XCircle,
  Link2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { MessageCard } from "@/components/MessageCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import type { Message } from "@/modules/User";
import type { ApiResponse } from "@/types/ApiResponse";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import { FeedbackPromptManager } from "@/components/FeedbackPromptManager";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c4b0ff]";

const primaryBtn =
  `inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#c4b0ff] px-5 text-sm font-semibold text-[#1a1226] transition-colors hover:bg-[#d6c8ff] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

const card = "rounded-2xl border border-white/10 bg-[#1e1629]";
const mutedText = "text-[#b3a9c4]";
const subtleText = "text-[#9a90ac]";

type AcceptMessagesForm = z.infer<typeof acceptMessageSchema>;

const getErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (isAxiosError<ApiResponse>(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 404 && typeof data === "string") {
      return "API route not found. Check your route file.";
    }

    return (
      (typeof data === "object" ? data?.message : undefined) ??
      fallback
    );
  }

  return fallback;
};

export default function UserDashboard() {
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [origin, setOrigin] = useState("");

  const { watch, setValue } = useForm<AcceptMessagesForm>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessage: false,
    },
  });

  const acceptMessages = watch("acceptMessage");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const username = session?.user?.username;
  const displayName = session?.user?.name || username || "User";

  const profileUrl =
    origin && username ? `${origin}/u/${username}` : "";

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const { data } = await axios.get<ApiResponse>(
        "/api/accept-messages"
      );

      setValue(
        "acceptMessage",
        Boolean(data.isAcceptingMessage),
        { shouldDirty: false }
      );
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Failed to fetch message settings")
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);

    try {
      const { data } = await axios.get<ApiResponse>(
        "/api/get-messages"
      );

      setMessages(data.messages ?? []);

      if (refresh) {
        toast.success("Messages refreshed successfully");
      }
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Failed to fetch messages")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    void fetchMessages();
    void fetchAcceptMessages();
  }, [status, fetchMessages, fetchAcceptMessages]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((previousMessages) =>
      previousMessages.filter(
        (message) => String(message._id) !== messageId
      )
    );
  };

  const handleSwitchChange = async (checked: boolean) => {
    if (isSwitchLoading) return;

    const previousValue = acceptMessages;

    setValue("acceptMessage", checked);
    setIsSwitchLoading(true);

    try {
      const { data } = await axios.post<ApiResponse>(
        "/api/accept-messages",
        {
          acceptMessages: checked,
        }
      );

      toast.success(data.message ?? "Settings updated successfully");
    } catch (error: unknown) {
      setValue("acceptMessage", previousValue);

      toast.error(
        getErrorMessage(error, "Failed to update message settings")
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!profileUrl) {
      toast.error("Your profile link is not ready yet");
      return;
    }

    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied!");
    } catch {
      toast.error("Unable to copy the profile link");
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await signOut({
        callbackUrl: "/",
      });
    } catch {
      toast.error("Unable to log out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#150f1d] font-sans text-[#f3eefa]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-[#c4b0ff]" />
          <p className={`text-sm ${mutedText}`}>
            Preparing your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  if (!username) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#150f1d] px-5 font-sans text-[#f3eefa]">
        <div className={`${card} w-full max-w-md p-8 text-center sm:p-10`}>
          <ShieldCheck className="mx-auto mb-5 size-10 text-[#c4b0ff]" />

          <h1 className="text-2xl font-semibold">
            Profile unavailable
          </h1>

          <p className={`mt-3 text-sm leading-6 ${mutedText}`}>
            We couldn't load your username. Please sign in again.
          </p>

          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`${primaryBtn} mt-6 w-full`}
          >
            {isLoggingOut ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 size-4" />
            )}
            Sign out
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#150f1d] font-sans text-[#f3eefa] selection:bg-[#c4b0ff] selection:text-[#1a1226]">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(196,176,255,0.09),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-5 sm:px-8 sm:pt-7 lg:px-12">

        {/* Header */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <a
            href="/"
            aria-label="Wisper home"
            className={`flex items-center gap-3 rounded-lg ${focusRing}`}
          >
            <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[#1e1629]">
              <MessageCircle className="size-5 text-[#c4b0ff]" />
            </div>

            <div>
              <span className="text-2xl font-semibold tracking-tight">
                wisper
              </span>
              <span className="text-[#c4b0ff]">.</span>
            </div>
          </a>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden text-right sm:block">
              {/* <p className="text-sm font-semibold">{displayName}</p> */}
              <p className={`mt-0.5 text-sm font-semibold ${subtleText}`}>
                @{username}
              </p>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c4b0ff]/25 bg-[#c4b0ff]/10 text-sm font-semibold text-[#d9ccff]">
              {String(displayName).charAt(0).toUpperCase()}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`h-10 rounded-xl border-white/15 bg-transparent px-3 text-sm text-white/85 hover:border-white/25 hover:bg-white/[0.06] hover:text-white sm:px-4 ${focusRing}`}
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 size-4" />
              )}
              <span className="hidden sm:inline">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
              <span className="sm:hidden">
                {isLoggingOut ? "..." : "Exit"}
              </span>
            </Button>
          </div>
        </header>

        {/* Welcome section */}
        <section className="relative mb-10 grid items-center gap-8 overflow-hidden rounded-2xl border border-white/10 bg-[#1e1629] p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full border border-white/[0.04]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full border border-white/[0.05]"
          />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c4b0ff]/20 bg-[#c4b0ff]/[0.07] px-3 py-1.5 text-xs font-medium text-[#d9ccff]">
              <Sparkles className="size-3.5" />
              YOUR PERSONAL INBOX
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your inbox,
              <br />
              <span className="text-[#d9ccff]">your rules.</span>
            </h1>

            <p className={`mt-5 max-w-lg text-base leading-7 ${mutedText}`}>
              Hey, {displayName}. Your private space for honest
              conversations. Share your link and see what people
              have to say, anonymously.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={copyToClipboard}
                disabled={!profileUrl}
                className={primaryBtn}
              >
                <Copy className="size-4" />
                Copy my link
              </Button>

              {profileUrl && (
                <a
                  href={`/u/${encodeURIComponent(username)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-medium text-white/85 transition-colors hover:bg-white/[0.06] ${focusRing}`}
                >
                  Preview profile
                  <ArrowUpRight className="size-4 text-white/60" />
                </a>
              )}
            </div>
          </div>

          {/* Inbox illustration */}
          <div className="relative z-10 hidden w-56 rounded-2xl border border-white/10 bg-[#150f1d] p-5 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.8)] lg:block">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <Inbox className="size-4 text-[#c4b0ff]" />
              <span className={`text-xs ${subtleText}`}>
                Your inbox
              </span>
            </div>

            <div className="mt-5 border-l-2 border-[#c4b0ff] pl-3">
              <p className="text-lg font-medium leading-snug">
                You make people feel seen.
              </p>
              <p className={`mt-3 text-xs ${subtleText}`}>
                <ShieldCheck className="mr-1 inline size-3" />
                Sender hidden
              </p>
            </div>

            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <div className="mb-2 h-1.5 w-2/3 rounded-full bg-white/10" />
              <div className="h-1.5 w-full rounded-full bg-white/[0.06]" />
            </div>

            <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <div className="mb-2 h-1.5 w-1/2 rounded-full bg-white/10" />
              <div className="h-1.5 w-4/5 rounded-full bg-white/[0.06]" />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2">
          <article className={`${card} p-6 transition-colors hover:border-white/20 sm:p-7`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-sm ${mutedText}`}>
                  Total messages
                </p>

                <p className="mt-3 text-4xl font-semibold tracking-tight">
                  {messages.length}
                </p>

                <p className={`mt-3 text-xs ${subtleText}`}>
                  Messages in your inbox
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl border border-[#c4b0ff]/15 bg-[#c4b0ff]/[0.08]">
                <Inbox className="size-5 text-[#c4b0ff]" />
              </div>
            </div>
          </article>

          <article className={`${card} p-6 transition-colors hover:border-white/20 sm:p-7`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-sm ${mutedText}`}>
                  Inbox status
                </p>

                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {acceptMessages ? "Active" : "Paused"}
                </p>

                <p className={`mt-3 text-xs ${subtleText}`}>
                  {acceptMessages
                    ? "You're ready to receive messages"
                    : "New messages are turned off"}
                </p>
              </div>

              <div
                className={`flex size-11 items-center justify-center rounded-xl border ${acceptMessages
                  ? "border-[#c4b0ff]/20 bg-[#c4b0ff]/[0.08] text-[#c4b0ff]"
                  : "border-[#ffc9a3]/20 bg-[#ffc9a3]/[0.08] text-[#ffc9a3]"
                  }`}
              >
                {acceptMessages ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <XCircle className="size-5" />
                )}
              </div>
            </div>
          </article>
        </section>

        {/* Profile link */}
        <section className={`${card} mb-6 p-5 sm:p-7`}>
          <div className="mb-5 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#c4b0ff]/15 bg-[#c4b0ff]/[0.08]">
              <Link2 className="size-5 text-[#c4b0ff]" />
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Your anonymous link
              </h2>
              <p className={`mt-2 max-w-xl text-sm leading-6 ${mutedText}`}>
                Share it in your bio, send it to friends, or drop it
                in a group chat. Anyone with the link can message you.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={profileUrl}
              readOnly
              aria-label="Your profile URL"
              placeholder="Preparing your profile link..."
              onFocus={(event) => event.currentTarget.select()}
              className={`h-12 min-w-0 rounded-xl border-white/10 bg-[#150f1d] text-sm text-white/80 placeholder:text-[#9a90ac] focus-visible:ring-[#c4b0ff] ${focusRing}`}
            />

            <Button
              type="button"
              onClick={copyToClipboard}
              disabled={!profileUrl}
              className={`${primaryBtn} shrink-0`}
            >
              <Copy className="size-4" />
              Copy link
            </Button>
          </div>
        </section>

        {username && (
          <FeedbackPromptManager username={username} />
        )}

        {/* Message settings */}
        <section className={`${card} mb-10 p-5 sm:p-7 mt-8`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#c4b0ff]/15 bg-[#c4b0ff]/[0.08]">
                <ShieldCheck className="size-5 text-[#c4b0ff]" />
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Message preferences
                </h2>

                <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
                  {acceptMessages
                    ? "Your profile is accepting anonymous messages."
                    : "Your profile is currently not accepting messages."}
                </p>

                <p className={`mt-2 text-xs ${subtleText}`}>
                  Change this setting whenever you want.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 rounded-xl border border-white/10 bg-[#150f1d] px-4 py-3.5 sm:min-w-48">
              <div>
                <p className="text-sm font-medium">
                  {acceptMessages ? "Accepting messages" : "Messages paused"}
                </p>
                <p className={`mt-1 text-xs ${subtleText}`}>
                  {acceptMessages ? "Enabled" : "Disabled"}
                </p>
              </div>

              <Switch
                id="accept-messages"
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                aria-label="Accept anonymous messages"
                className="data-[state=checked]:bg-[#c4b0ff] data-[state=unchecked]:bg-white/20"
              />

              {isSwitchLoading && (
                <Loader2 className="size-4 shrink-0 animate-spin text-[#c4b0ff]" />
              )}
            </div>
          </div>
        </section>

        {/* Messages */}
        <section className={`${card} p-5 sm:p-7`}>
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Your messages
                </h2>

                <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-[#c4b0ff]/20 bg-[#c4b0ff]/[0.08] px-2.5 py-1 text-xs font-semibold text-[#d9ccff]">
                  {messages.length}
                </span>
              </div>

              <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
                Every message, in one private place.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => void fetchMessages(true)}
              disabled={isLoading}
              className={`h-10 self-start rounded-xl border-white/15 bg-transparent text-white/85 hover:bg-white/[0.06] hover:text-white sm:self-auto ${focusRing}`}
            >
              <RefreshCcw
                className={`mr-2 size-4 ${isLoading ? "animate-spin" : ""
                  }`}
              />
              Refresh
            </Button>
          </div>

          {isLoading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="size-8 animate-spin text-[#c4b0ff]" />
              <p className={`mt-4 text-sm ${mutedText}`}>
                Loading your messages...
              </p>
            </div>
          ) : messages.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {messages.map((message) => (
                <MessageCard
                  key={String(message._id)}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#150f1d]/60 px-5 py-16 text-center sm:py-20">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#c4b0ff]/20 bg-[#c4b0ff]/[0.08]">
                <MessageCircle className="size-6 text-[#c4b0ff]" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Your inbox is waiting.
              </h3>

              <p className={`mx-auto mt-3 max-w-sm text-sm leading-6 ${mutedText}`}>
                No messages yet. Share your anonymous link with
                friends and see what they have to say.
              </p>

              <Button
                type="button"
                onClick={copyToClipboard}
                disabled={!profileUrl}
                className={`${primaryBtn} mt-6`}
              >
                <Copy className="size-4" />
                Share my link
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/10 py-7 text-center">
          <p className={`text-xs ${subtleText}`}>
            Made with care for your honest conversations.
          </p>
          <p className={`mt-2 text-xs ${subtleText}`}>
            <span className="text-white/80">wisper</span>
            <span className="text-[#c4b0ff]">.</span>
            {" "}© {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  );
}