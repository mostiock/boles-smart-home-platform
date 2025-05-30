import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* BOLES Logo */}
        <div className="mb-8">
          <img
            src="https://ext.same-assets.com/596243380/3736915175.png"
            alt="BOLES Enterprise"
            className="h-12 w-auto mx-auto"
          />
        </div>

        {/* 404 Error */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-[#43abc3] mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-[#43abc3] hover:bg-[#3a9bb5] text-white w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/categories/smart-lighting">
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-sm font-medium text-foreground mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              href="/categories/smart-lighting"
              className="text-muted-foreground hover:text-[#43abc3] transition-colors"
            >
              Smart Lighting
            </Link>
            <Link
              href="/categories/security-cameras"
              className="text-muted-foreground hover:text-[#43abc3] transition-colors"
            >
              Security Cameras
            </Link>
            <Link
              href="/categories/smart-speakers"
              className="text-muted-foreground hover:text-[#43abc3] transition-colors"
            >
              Smart Speakers
            </Link>
            <Link
              href="/categories/smart-locks"
              className="text-muted-foreground hover:text-[#43abc3] transition-colors"
            >
              Smart Locks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
