"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useCurrencyContext } from "@/contexts/CurrencyContext";
import { getRatingDistribution, getReviewsForProduct } from "@/data/reviews";
import type { Product } from "@/types/product";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  RefreshCw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  ThumbsUp,
  Truck,
} from "lucide-react";
import { useState } from "react";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { convertToNaira, formatNaira } = useCurrencyContext();

  if (!product) return null;

  const formatPrice = (price: number) => formatNaira(convertToNaira(price));

  const renderStars = (rating: number, size = "sm") => {
    const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";
    return [1, 2, 3, 4, 5].map((starNumber) => (
      <Star
        key={`star-${rating}-${size}-${starNumber}`}
        className={`${sizeClass} ${
          starNumber <= Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : starNumber <= rating
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ));
  };

  const productReviews = getReviewsForProduct(product.id);
  const ratingDistribution = getRatingDistribution(productReviews);
  const totalReviews = productReviews.length || product.reviewCount;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const nextImage = () => {
    if (!product?.images) return;
    const images = product.images;
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    if (!product?.images) return;
    const images = product.images;
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="p-6">
            <div className="relative mb-4">
              <img
                src={product.images?.[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />

              {product.images && product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Image indicators */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {product.images.map((imageUrl, index) => (
                    <button
                      key={`indicator-${product.id}-${imageUrl}`}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === selectedImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail navigation */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={`thumb-${product.id}-${image}`}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex
                        ? "border-[#43abc3]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="p-6 border-l border-gray-200">
            <DialogHeader className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {product.brand}
                  </Badge>
                  <DialogTitle className="text-2xl font-bold text-[#112137] leading-tight">
                    {product.name}
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Model: {product.model}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">({totalReviews} reviews)</span>
              </div>

              {/* Badges */}
              {product.badges && product.badges.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {product.badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant={
                        badge === "Best Seller" ? "destructive" : "secondary"
                      }
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </DialogHeader>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-[#43abc3]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge variant="destructive">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
                />
                <span
                  className={`font-medium ${product.inStock ? "text-green-700" : "text-red-700"}`}
                >
                  {product.inStock
                    ? `In Stock (${product.stockCount} available)`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3"
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 min-w-[50px] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setQuantity(
                          Math.min(product.stockCount || 0, quantity + 1),
                        )
                      }
                      className="px-3"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-[#43abc3] hover:bg-[#3a9bb5] text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="px-6">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="flex flex-col items-center gap-1">
                <Shield className="h-5 w-5 text-[#43abc3]" />
                <span className="text-xs text-gray-600">
                  {product.warranty} Warranty
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-5 w-5 text-[#43abc3]" />
                <span className="text-xs text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="h-5 w-5 text-[#43abc3]" />
                <span className="text-xs text-gray-600">30-Day Returns</span>
              </div>
            </div>

            {/* Tabs for detailed information */}
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="mt-4">
                <div className="space-y-2">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <span className="text-[#43abc3] mt-1">•</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-4">
                <div className="space-y-3">
                  {product.specifications &&
                    Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                          <span className="font-medium text-gray-700">
                            {key}:
                          </span>
                          <span className="text-sm">{value}</span>
                        </div>
                      ),
                    )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#43abc3]">
                          {product.rating}
                        </div>
                        <div className="flex justify-center mb-1">
                          {renderStars(product.rating)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {totalReviews} reviews
                        </div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div
                            key={rating}
                            className="flex items-center gap-2 mb-1"
                          >
                            <span className="text-sm w-3">{rating}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Progress
                              value={
                                (ratingDistribution[
                                  rating as keyof typeof ratingDistribution
                                ] /
                                  totalReviews) *
                                100
                              }
                              className="flex-1 h-2"
                            />
                            <span className="text-sm text-gray-600 w-8">
                              {
                                ratingDistribution[
                                  rating as keyof typeof ratingDistribution
                                ]
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {productReviews.slice(0, 3).map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-4 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={review.userAvatar}
                              alt={review.userName}
                            />
                            <AvatarFallback>
                              {review.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {review.userName}
                              </span>
                              {review.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-600">
                                {review.date}
                              </span>
                            </div>
                            <h4 className="font-medium mb-1">{review.title}</h4>
                            <p className="text-sm text-gray-700 mb-2">
                              {review.comment}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <button className="flex items-center gap-1 hover:text-[#43abc3]">
                                <ThumbsUp className="h-3 w-3" />
                                Helpful ({review.helpful})
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {productReviews.length > 3 && (
                    <Button variant="outline" className="w-full">
                      See All {totalReviews} Reviews
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
