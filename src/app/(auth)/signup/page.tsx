"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { signInWithGoogle } from "@/lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setError(result.error || "Google sign up failed. Please try again.");
        setIsGoogleLoading(false);
      }
      // If successful, user will be redirected to /auth/callback
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.signup(email, password);
      
      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(response.message || "Signup failed. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-4">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-pink-600/15 blur-[120px]" />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {/* Logo */}
      <Link href="/" className="relative z-10 mb-8 flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="LinkToAds Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <span className="bg-gradient-to-r from-[#5555DD] to-[#DD55DD] bg-clip-text text-2xl font-bold text-transparent">
          LinkToAds
        </span>
      </Link>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#1a1a22] bg-[#0c101e] p-8 backdrop-blur-sm">
        {/* Card inner glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        
        <div className="relative">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Start generating high-converting ads today
            </p>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#1a1a22] bg-[#12121a] px-4 py-3 text-sm font-medium text-white transition-all hover:border-[#252530] hover:bg-[#1a1a24] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isGoogleLoading ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#1a1a22]" />
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Or continue with email
            </span>
            <div className="h-px flex-1 bg-[#1a1a22]" />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="off"
                className="w-full rounded-md border border-[#1a1a22] bg-[#0c0c14] px-4 py-3 text-sm text-white placeholder-zinc-500 transition-all focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 focus:bg-[#0c0c14] [&:-webkit-autofill]:bg-[#0c0c14] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="off"
                className="w-full rounded-md border border-[#1a1a22] bg-[#0c0c14] px-4 py-3 text-sm text-white placeholder-zinc-500 transition-all focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 focus:bg-[#0c0c14] [&:-webkit-autofill]:bg-[#0c0c14] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
              />
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#5555DD] to-[#DD55DD] px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-purple-400 transition-colors hover:text-purple-300"
            >
              Sign in
            </Link>
          </p>

          {/* Back to Home */}
          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

