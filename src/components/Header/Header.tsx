"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="LinkToAds Logo"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="bg-gradient-to-r from-[#6666FF] to-[#FF66FF] bg-clip-text text-xl font-bold text-transparent">
            LinkToAds
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            Log In
          </Link>
          <Link
            href="/get-started"
            className="rounded bg-gradient-to-r from-[#6666FF] to-[#FF66FF] px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

