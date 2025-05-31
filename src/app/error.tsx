"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <img
            src="https://ext.same-assets.com/596243380/3736915175.png"
            alt="BOLES Enterprise"
            className="h-12 w-auto mx-auto"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground mb-4">
            We're sorry, but something unexpected happened. Please try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-[#43abc3] hover:bg-[#3a9bb5] text-white"
          >
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
