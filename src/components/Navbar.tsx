import Link from "next/link";
import {
    ArrowRight,
    MessageCircle,
} from "lucide-react";


function BrandMark({ small = false }: { small?: boolean }) {
    return (
        <span className="group mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-indigo-500/20 shadow-lg shadow-violet-950/30 transition-all duration-300 hover:border-violet-400/40 hover:shadow-violet-500/20">
            <MessageCircle
                className="h-6 w-6 text-violet-300 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.8}
            />
        </span>
    );
}

const Navbar = () => {
    return (

        //Navigation 
        < header className="relative z-20 border-b border-white/[0.07]" >
            <nav className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
                <Link href="/" aria-label="Wisper home" className="group flex items-center gap-3">
                    <BrandMark />
                    <span className="text-[22px] font-semibold tracking-[-0.06em]">
                        wisper<span className="text-violet-300">.</span>
                    </span>
                </Link>

                <div className="hidden items-center gap-9 text-[13px] font-medium text-white/55 md:flex">
                    <Link href="#features" className="transition-colors hover:text-white">Why Wisper</Link>
                    <Link href="#how-it-works" className="transition-colors hover:text-white">How it works</Link>
                    <Link href="#about" className="transition-colors hover:text-white">Our idea</Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link href="/sign-in" className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:text-white sm:px-4">
                        Sign in
                    </Link>
                    <Link href="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-[#f4efff] px-4 py-2.5 text-sm font-semibold text-[#1b1425] transition hover:bg-white sm:px-5">
                        Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </nav>
        </header >
    )
}

export default Navbar
