import { useCallback } from "react";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const toast = useCallback(
    ({ title, description, variant = "default" }: ToastOptions) => {
      // Simple browser alert for now - in a real app you'd use a proper toast library
      if (variant === "destructive") {
        alert(`❌ ${title}: ${description || ""}`);
      } else {
        alert(`✅ ${title}: ${description || ""}`);
      }

      console.log(`Toast: [${variant}] ${title} - ${description}`);
    },
    [],
  );

  return { toast };
}
