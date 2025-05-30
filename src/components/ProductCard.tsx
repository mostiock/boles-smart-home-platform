"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { useCurrencyContext } from "@/contexts/CurrencyContext";
import type { Product } from "@/types/product";
import { Eye, GitCompare, Heart, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist, isAuthenticated } =
    useAuth();
  const { addToComparison, removeFromComparison, isInComparison } =
    useComparison();
  const { convertToNaira, formatNaira } = useCurrencyContext();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const inWishlist = isAuthenticated && isInWishlist(product.id);
  const inComparison = isInComparison(product.id);

  const formatPrice = (price: number) => formatNaira(convertToNaira(price));

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    addToCart(product);

    // Simulate loading state
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      // Could trigger login modal here
      return;
    }

    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inComparison) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      router.push(`/products/${product.id}`);
    }
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={`star-${product.id}-${i}`}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card
      className="group h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.badges.slice(0, 2).map((badge) => (
                <Badge
                  key={badge}
                  variant={
                    badge === "Best Seller" ? "destructive" : "secondary"
                  }
                  className="text-xs"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={handleViewProduct}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className={`h-8 w-8 p-0 ${inWishlist ? "bg-red-100 text-red-600 hover:bg-red-200" : ""}`}
              onClick={handleWishlistToggle}
            >
              <Heart
                className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`}
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className={`h-8 w-8 p-0 ${inComparison ? "bg-[#43abc3] text-white hover:bg-[#3a9bb5]" : ""}`}
              onClick={handleComparisonToggle}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-[#43abc3] transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground">
                Key Features:
              </p>
              <ul className="text-xs text-muted-foreground">
                {product.features.slice(0, 2).map((feature) => (
                  <li key={feature} className="flex items-start gap-1">
                    <span className="text-[#43abc3] mt-1">•</span>
                    <span className="line-clamp-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-3">
        {/* Price */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#43abc3]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.originalPrice && (
            <Badge variant="destructive" className="text-xs">
              Save {formatPrice(product.originalPrice - product.price)}
            </Badge>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className="w-full btn-primary"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAddingToCart
            ? "Adding..."
            : product.inStock
              ? "Add to Cart"
              : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
