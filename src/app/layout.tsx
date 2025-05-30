// Instructions: Add Clerk provider to wrap the app for authentication

import { ClerkErrorHandler } from "@/app/clerk-error-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BOLES Smart Home | Premium Smart Home Automation",
  description:
    "Transform your home with BOLES Smart Home solutions. Professional smart home automation, security, lighting, and control systems.",
  keywords: [
    "smart home",
    "home automation",
    "smart lighting",
    "security cameras",
    "smart locks",
    "smart speakers",
    "BOLES",
  ],
  authors: [{ name: "BOLES Enterprise" }],
  creator: "BOLES Enterprise",
  publisher: "BOLES Enterprise",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "BOLES Smart Home | Premium Smart Home Automation",
    description:
      "Transform your home with BOLES Smart Home solutions. Professional smart home automation, security, lighting, and control systems.",
    type: "website",
    locale: "en_US",
    url: "https://boles-smart-home.netlify.app",
    siteName: "BOLES Smart Home",
  },
  twitter: {
    card: "summary_large_image",
    title: "BOLES Smart Home | Premium Smart Home Automation",
    description:
      "Transform your home with BOLES Smart Home solutions. Professional smart home automation, security, lighting, and control systems.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#43abc3",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#112137",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ClerkErrorHandler />
          <CurrencyProvider>
            <AuthProvider>
              <CartProvider>
                <ComparisonProvider>{children}</ComparisonProvider>
              </CartProvider>
            </AuthProvider>
          </CurrencyProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
