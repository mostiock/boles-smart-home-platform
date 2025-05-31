"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface DebugInfo {
  authLoaded: boolean;
  userLoaded: boolean;
  userId: string;
  userEmail: string;
  clerkVersion: string;
  hostname: string;
  protocol: string;
}

export function ClerkDebug() {
  const { isLoaded: authLoaded, userId } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDebugInfo({
        authLoaded,
        userLoaded,
        userId: userId || "none",
        userEmail: user?.primaryEmailAddress?.emailAddress || "none",
        clerkVersion: `${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20)}...`,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
      });
    }
  }, [authLoaded, userLoaded, userId, user]);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded text-xs z-50 max-w-xs">
      <div className="font-bold mb-2">Clerk Debug Info:</div>
      {debugInfo && (
        <div className="space-y-1">
          <div>Auth Loaded: {debugInfo.authLoaded ? "✅" : "❌"}</div>
          <div>User Loaded: {debugInfo.userLoaded ? "✅" : "❌"}</div>
          <div>User ID: {debugInfo.userId}</div>
          <div>Email: {debugInfo.userEmail}</div>
          <div>Key: {debugInfo.clerkVersion}</div>
          <div>Host: {debugInfo.hostname}</div>
          <div>Protocol: {debugInfo.protocol}</div>
        </div>
      )}
    </div>
  );
}
