import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Say it without the pressure",
    description:
      "Give people room to be honest. Your personal link makes it easy to share thoughts they might not say out loud.",
    accent: "text-violet-200",
    iconBg: "bg-violet-400/10",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Your space, your boundaries",
    description:
      "Receive messages in one personal inbox, with privacy at the heart of the experience.",
    accent: "text-emerald-200",
    iconBg: "bg-emerald-400/10",
  },
  {
    icon: WandSparkles,
    number: "03",
    title: "A little help from AI",
    description:
      "When the first words are hard to find, get conversation starters that help break the ice.",
    accent: "text-amber-200",
    iconBg: "bg-amber-400/10",
  },
];

const steps = [
  {
    number: "01",
    title: "Make it yours",
    description: "Create an account and set up your own little corner of Wisper.",
  },
  {
    number: "02",
    title: "Pass the link around",
    description: "Share your unique link with friends, your community, or anyone you trust.",
  },
  {
    number: "03",
    title: "Let the messages in",
    description: "Read what people want to share and keep the good conversations going.",
  },
];


export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0910] text-[#f8f6fc] selection:bg-violet-300 selection:text-[#171022]">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-64 left-[42%] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[150px]" />
        <div className="absolute right-[-220px] top-[850px] h-[480px] w-[480px] rounded-full bg-fuchsia-700/[0.08] blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-12 lg:pb-32 lg:pt-28">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200/15 bg-violet-300/[0.07] px-3.5 py-2 text-xs font-medium text-violet-100/90 sm:text-[13px]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-300 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-200" />
            </span>
            A softer place for honest thoughts
            <ChevronRight className="h-3.5 w-3.5 text-violet-200/60" />
          </div>

          <h1 className="max-w-[760px] text-[clamp(3.25rem,7vw,6.35rem)] font-semibold leading-[0.98] tracking-[-0.075em]">
            Some things are
            <span className="mt-2 block bg-gradient-to-r from-violet-200 via-fuchsia-200 to-rose-200 bg-clip-text pb-2 text-transparent">
              easier whispered.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-white/55 sm:mt-8 sm:text-lg sm:leading-9">
            A little space for the thoughts people keep to themselves. Share your link, receive anonymous messages, and make room for conversations that feel real.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up" className="group inline-flex h-[54px] items-center justify-center gap-2.5 rounded-xl bg-violet-300 px-6 text-sm font-semibold text-[#1b1425] shadow-[0_8px_36px_rgba(167,139,250,0.18)] transition hover:-translate-y-0.5 hover:bg-violet-200">
              Create your free space
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="#how-it-works" className="inline-flex h-[54px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-6 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]">
              See how it works <ArrowDownRight className="h-4 w-4 text-white/50" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-white/45 sm:text-[13px]">
            <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-emerald-200/80" /> Anonymous by design</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
            <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4 text-rose-200/80" /> Made for real connection</span>
          </div>
        </div>

        {/* Product preview */}
        <div className="relative mx-auto w-full max-w-[530px] lg:ml-auto">
          <div aria-hidden="true" className="absolute -inset-8 rounded-[42px] bg-gradient-to-br from-violet-500/20 via-fuchsia-500/[0.06] to-transparent blur-3xl" />
          <div className="absolute -right-5 top-14 h-28 w-28 rounded-full border border-violet-200/10 bg-violet-300/[0.04] blur-[1px] sm:-right-9" />
          <div className="relative rounded-[28px] border border-white/[0.11] bg-[#14111c]/95 p-4 shadow-[0_35px_100px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-300/10 text-violet-200"><MessageCircle className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">Your little corner</p>
                  <p className="mt-1 text-xs text-white/40">A peek inside your inbox</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/15 bg-emerald-200/[0.06] px-2.5 py-1.5 text-[10px] font-medium text-emerald-100/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-200" /> Private space
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/40">YOUR INBOX</p>
                <p className="mt-1 text-lg font-semibold tracking-tight">A few kind words.</p>
              </div>
              <div className="flex -space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#14111c] bg-rose-200 text-[10px] font-bold text-rose-950">♡</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#14111c] bg-violet-200 text-[10px] font-bold text-violet-950">✳</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#14111c] bg-amber-100 text-[10px] font-bold text-amber-950">✦</span>
              </div>
            </div>

            <div className="mt-5 space-y-3.5">
              <article className="rounded-2xl rounded-tl-md border border-violet-200/10 bg-gradient-to-br from-violet-300/[0.11] to-fuchsia-300/[0.045] p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-violet-100/90"><span className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-200/10"><Sparkles className="h-3.5 w-3.5" /></span> Anonymous message</span>
                  <span className="text-[10px] text-white/30">just now</span>
                </div>
                <p className="text-[14px] leading-7 text-white/85 sm:text-[15px]">“You have this way of making people feel seen, even when they don’t know how to ask for it.”</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-white/35"><LockKeyhole className="h-3 w-3" /> Sender identity hidden</div>
              </article>

              <article className="ml-5 rounded-2xl rounded-tr-md border border-white/[0.07] bg-white/[0.035] p-4 sm:ml-10 sm:p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white/65"><span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-200/10 text-rose-100"><Heart className="h-3.5 w-3.5" /></span> A thought worth keeping</div>
                <p className="text-sm leading-6 text-white/65">“Never underestimate how much your little check-ins mean to people.”</p>
              </article>

              <div className="group flex items-center gap-3 rounded-2xl border border-dashed border-amber-100/15 bg-amber-100/[0.035] p-4 transition hover:border-amber-100/25 hover:bg-amber-100/[0.055]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100/10 text-amber-100"><Zap className="h-[18px] w-[18px]" /></span>
                <div className="min-w-0 flex-1"><p className="text-sm font-semibold">Words not coming?</p><p className="mt-1 text-xs leading-5 text-white/40">Let AI spark your next conversation.</p></div>
                <ArrowRight className="h-4 w-4 text-amber-100/50 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
              <div><p className="text-[10px] uppercase tracking-[0.14em] text-white/35">Your space</p><p className="mt-1 text-xs font-medium text-white/75">Your voice. Your conversations.</p></div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200/10 bg-emerald-200/[0.07] text-emerald-100"><ShieldCheck className="h-[18px] w-[18px]" /></span>
            </div>
          </div>

          <div className="mt-5 flex items-center w-xs gap-3 px-4 py-3 sm:flex sm:-left-8">
            <span className="flex h-9 w-9 items-center justify-center text-emerald-100"><Check className="h-6 w-6" /></span>
            <div><p className="text-xs font-semibold">A little more honesty</p><p className="mt-1 text-[11px] text-white/40">One message at a time.</p></div>
          </div>
        </div>
      </section>

      {/* Brand promise strip */}
      <div className="relative z-10 border-y border-white/[0.07] bg-white/[0.018]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-5 py-5 text-center sm:flex-row sm:gap-8 sm:px-8 lg:px-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Built around</span>
          <span className="hidden h-4 w-px bg-white/10 sm:block" />
          <span className="text-xs font-medium text-white/65">Honesty without pressure</span>
          <span className="hidden h-1 w-1 rounded-full bg-violet-200/60 sm:block" />
          <span className="text-xs font-medium text-white/65">Privacy by intention</span>
          <span className="hidden h-1 w-1 rounded-full bg-violet-200/60 sm:block" />
          <span className="text-xs font-medium text-white/65">Conversations that matter</span>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="relative z-10 px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/80">Why Wisper</p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-5xl">Less overthinking.<br /><span className="text-white/45">More real connection.</span></h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8">Not another noisy social feed. Just a thoughtful way to hear what people want to tell you.</p>
          </div>

          <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.number} className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-200/20 hover:bg-white/[0.045] sm:p-8">
                  <div className="flex items-center justify-between"><span className="text-xs font-medium tracking-[0.16em] text-white/25">{feature.number}</span><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${feature.iconBg} ${feature.accent}`}><Icon className="h-5 w-5" /></span></div>
                  <h3 className="mt-8 text-lg font-semibold tracking-tight sm:text-xl">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/48">{feature.description}</p>
                  <div className="mt-7 h-px w-full bg-gradient-to-r from-violet-200/25 via-white/[0.06] to-transparent" />
                  <div className="mt-5 flex items-center gap-2 text-xs font-medium text-white/35 transition group-hover:text-violet-100/80"><span>Made for meaningful moments</span><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 border-y border-white/[0.07] bg-white/[0.018] px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/80">Simple by design</p>
            <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-5xl">Three small steps.<br /><span className="text-white/45">A world of things unsaid.</span></h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/50 sm:text-base sm:leading-8">No complicated setup or awkward introductions. Start with your link and see where the conversation goes.</p>
            <Link href="/sign-up" className="group mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-violet-300 px-5 text-sm font-semibold text-[#1b1425] transition hover:bg-violet-200">Start your Wisper <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
          </div>

          <div className="space-y-3">
            {steps.map((step) => (
              <article key={step.number} className="flex gap-5 rounded-2xl border border-white/[0.08] bg-[#100d16]/65 p-5 sm:gap-6 sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-200/15 bg-violet-300/[0.07] text-sm font-semibold text-violet-100">{step.number}</span>
                <div className="pt-0.5"><h3 className="text-base font-semibold tracking-tight sm:text-lg">{step.title}</h3><p className="mt-2 max-w-lg text-sm leading-7 text-white/45">{step.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="about" className="relative z-10 px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-violet-200/15 bg-[#17111f] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-36 h-80 w-80 rounded-full bg-violet-500/20 blur-[100px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-[-20px] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[100px]" />
          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-violet-100"><Heart className="h-6 w-6" /></div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/80">There's room for your voice</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-5xl">What if you heard<br />what people really think?</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8">Create your space, share your link, and make it a little easier for someone to say what they mean.</p>
            <Link href="/sign-up" className="group mt-8 inline-flex h-[52px] items-center gap-2.5 rounded-xl bg-[#f4efff] px-6 text-sm font-semibold text-[#1b1425] transition hover:-translate-y-0.5 hover:bg-white">Create your free account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
            <p className="mt-4 text-xs text-white/30">A thoughtful little space, just for you.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
