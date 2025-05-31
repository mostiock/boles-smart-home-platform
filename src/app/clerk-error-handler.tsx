"use client";

import { useEffect } from "react";

export function ClerkErrorHandler() {
  useEffect(() => {
    // Handle Clerk-specific errors
    const handleClerkError = (event: ErrorEvent) => {
      if (event.error?.message) {
        const errorMessage = event.error.message.toLowerCase();

        // Check for common Clerk errors
        if (
          errorMessage.includes("clerk") ||
          errorMessage.includes("authentication") ||
          event.filename?.includes("clerk")
        ) {
          console.warn("Clerk error caught and handled:", event.error);

          // Prevent the error from propagating
          event.preventDefault();
          return false;
        }
      }
    };

    window.addEventListener("error", handleClerkError);

    return () => {
      window.removeEventListener("error", handleClerkError);
    };
  }, []);

  return null;
}
