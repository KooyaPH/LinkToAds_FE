"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from Supabase (handles the OAuth callback automatically)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          return;
        }

        if (session?.user) {
          // Store user data in localStorage for consistency with email/password auth
          const user = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "",
          };

          localStorage.setItem("token", session.access_token);
          localStorage.setItem("user", JSON.stringify(user));

          // Sync user to our backend database
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: session.user.id,
                  email: session.user.email,
                  name: user.name,
                  avatar_url: session.user.user_metadata?.avatar_url,
                }),
              }
            );

            const data = await response.json();
            if (data.success && data.data?.token) {
              // Use our backend token instead
              localStorage.setItem("token", data.data.token);
              localStorage.setItem("user", JSON.stringify(data.data.user));
            }
          } catch (syncError) {
            console.warn("Failed to sync with backend:", syncError);
            // Continue anyway - user is authenticated with Supabase
          }

          // Redirect to dashboard
          router.push("/dashboard");
        } else {
          setError("No session found. Please try signing in again.");
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 text-red-400">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Authentication Error</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#5555DD] to-[#DD55DD] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <svg className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-zinc-400">Completing sign in...</p>
      </div>
    </div>
  );
}
