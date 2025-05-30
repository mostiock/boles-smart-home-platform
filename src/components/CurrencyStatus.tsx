// Instructions: Update the compact currency status to be visible on smaller screens and always show the currency symbol

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrencyContext } from "@/contexts/CurrencyContext";
import { Clock, RefreshCw, TrendingUp } from "lucide-react";
import { useState } from "react";

interface CurrencyStatusProps {
  className?: string;
  showDetails?: boolean;
}

export function CurrencyStatus({
  className = "",
  showDetails = false,
}: CurrencyStatusProps) {
  const { exchangeRate, lastUpdated, isLoading, error, refreshRate } =
    useCurrencyContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshRate();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    }).format(date);
  };

  if (!showDetails) {
    // Compact version for header - always visible
    return (
      <div
        className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      >
        <TrendingUp className="h-4 w-4 text-green-600" />
        <span className="font-medium">₦{exchangeRate.toFixed(0)}</span>
        <span className="text-xs">/USD</span>
        {isLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
      </div>
    );
  }

  // Detailed version
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Live Exchange Rate</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="h-8"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading || isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              1 USD equals
            </div>
            <div className="text-3xl font-bold text-green-600">
              ₦{exchangeRate.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="text-muted-foreground">Last updated:</span>
            </div>
            <span className="text-muted-foreground">
              {formatTime(lastUpdated)}
            </span>
          </div>

          {error && (
            <Badge variant="destructive" className="w-full justify-center">
              {error}
            </Badge>
          )}

          <div className="text-xs text-muted-foreground pt-2 border-t text-center">
            ⚡ Rates update automatically every hour
            <br />
            All prices are displayed in Nigerian Naira (₦)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
