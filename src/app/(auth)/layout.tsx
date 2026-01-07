import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - LinkToAds",
  description: "Sign in to your LinkToAds account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

