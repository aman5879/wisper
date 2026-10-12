import Link from "next/link";
import {
    MessageCircle,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-white/[0.07] px-5 py-7 sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
                <Link href="/" className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-violet-400" />
                    <span className="font-bold tracking-tight">
                        wisper<span className="text-violet-400">.</span>
                    </span>
                </Link>
                <p className="text-center text-xs text-white/35">A little honesty can make a big difference.</p>
                <div className="flex items-center gap-5 text-xs font-medium text-white/45"><Link href="/sign-in" className="transition hover:text-white">Sign in</Link><Link href="/sign-up" className="transition hover:text-white">Create account</Link></div>
            </div>
        </footer>
    )
}

export default Footer
