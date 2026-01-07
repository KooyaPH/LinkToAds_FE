"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 mb-8 border-t border-white/5 bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="LinkToAds Logo"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span className="bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] bg-clip-text text-lg font-bold text-transparent">
            LinkToAds
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-sm text-zinc-500">
          © {currentYear} LinkToAds. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

