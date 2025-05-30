"use client";

import { CartSidebar } from "@/components/CartSidebar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { useCurrencyContext } from "@/contexts/CurrencyContext";
import { getProductById, products } from "@/data/products";
import { getRatingDistribution, getReviewsForProduct } from "@/data/reviews";
import type { Product } from "@/types/product";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  Heart,
  RefreshCw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  ThumbsUp,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductPageClientProps {
  productId: string;
}

export default function ProductPageClient({
  productId,
}: ProductPageClientProps) {
  const router = useRouter();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist, isAuthenticated } =
    useAuth();
  const { addToComparison, removeFromComparison, isInComparison } =
    useComparison();
  const { convertToNaira, formatNaira } = useCurrencyContext();

  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);

        // Get related products from same category
        const related = products
          .filter(
            (p) =>
              p.category === foundProduct.category && p.id !== foundProduct.id,
          )
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#43abc3]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => formatNaira(convertToNaira(price));
  const inWishlist = isAuthenticated && isInWishlist(product.id);
  const inComparison = isInComparison(product.id);
  const productReviews = getReviewsForProduct(product.id);
  const ratingDistribution = getRatingDistribution(productReviews);
  const totalReviews = productReviews.length || product.reviewCount;

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

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) return;

    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleComparisonToggle = () => {
    if (inComparison) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
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
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button
            onClick={() => router.push("/")}
            className="hover:text-[#43abc3]"
          >
            Home
          </button>
          <ChevronRight className="h-4 w-4" />
          <button
            onClick={() => router.push("/#products")}
            className="hover:text-[#43abc3]"
          >
            Products
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative mb-6">
              <img
                src={product.images?.[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
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
                  {product.images.map((imageUrl, imageIndex) => (
                    <button
                      key={`indicator-${product.id}-${imageUrl}`}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        imageIndex === selectedImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                      onClick={() => setSelectedImageIndex(imageIndex)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail navigation */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, imageIndex) => (
                  <button
                    key={`thumb-${product.id}-${image}`}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      imageIndex === selectedImageIndex
                        ? "border-[#43abc3]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImageIndex(imageIndex)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${imageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div>
            {/* Back button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {/* Product header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-3">
                    {product.brand}
                  </Badge>
                  <h1 className="text-3xl lg:text-4xl font-bold text-[#112137] leading-tight mb-2">
                    {product.name}
                  </h1>
                  <p className="text-muted-foreground">
                    Model: {product.model}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWishlistToggle}
                    className={
                      inWishlist ? "bg-red-50 text-red-600 border-red-200" : ""
                    }
                  >
                    <Heart
                      className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleComparisonToggle}
                    className={inComparison ? "bg-[#43abc3] text-white" : ""}
                  >
                    <GitCompare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="font-medium text-lg">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({totalReviews} reviews)
                </span>
              </div>

              {/* Badges */}
              {product.badges && product.badges.length > 0 && (
                <div className="flex gap-2 mb-6">
                  {product.badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant={
                        badge === "Best Seller" ? "destructive" : "secondary"
                      }
                      className="text-sm"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl font-bold text-[#43abc3]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge variant="destructive" className="text-sm">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div
                  className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
                />
                <span
                  className={`font-medium ${product.inStock ? "text-green-700" : "text-red-700"}`}
                >
                  {product.inStock
                    ? `In Stock (${product.stockCount ?? 0} available)`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2"
                    >
                      -
                    </Button>
                    <span className="px-6 py-2 min-w-[60px] text-center border-x border-gray-300">
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
                      className="px-4 py-2"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-[#43abc3] hover:bg-[#3a9bb5] text-white text-lg py-6"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-6">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield className="h-6 w-6 text-[#43abc3]" />
                <span className="text-sm font-medium">
                  {product.warranty} Warranty
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="h-6 w-6 text-[#43abc3]" />
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RefreshCw className="h-6 w-6 text-[#43abc3]" />
                <span className="text-sm font-medium">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="features" className="text-lg py-3">
                Features
              </TabsTrigger>
              <TabsTrigger value="specs" className="text-lg py-3">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg py-3">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <span className="text-[#43abc3] mt-1 text-lg">•</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6">
                    Technical Specifications
                  </h3>
                  <div className="space-y-4">
                    {product.specifications &&
                      Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-3 border-b border-gray-100 last:border-0"
                          >
                            <span className="font-medium text-gray-700 w-1/3">
                              {key}:
                            </span>
                            <span className="text-gray-900 w-2/3">{value}</span>
                          </div>
                        ),
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6">
                    Customer Reviews
                  </h3>

                  {/* Rating Summary */}
                  <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-[#43abc3] mb-2">
                          {product.rating}
                        </div>
                        <div className="flex justify-center mb-2">
                          {renderStars(product.rating, "lg")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {totalReviews} reviews
                        </div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div
                            key={rating}
                            className="flex items-center gap-3 mb-2"
                          >
                            <span className="text-sm w-4">{rating}</span>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <Progress
                              value={
                                (ratingDistribution[
                                  rating as keyof typeof ratingDistribution
                                ] /
                                  totalReviews) *
                                100
                              }
                              className="flex-1 h-3"
                            />
                            <span className="text-sm text-muted-foreground w-8">
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
                  <div className="space-y-6">
                    {productReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={review.userAvatar}
                              alt={review.userName}
                            />
                            <AvatarFallback>
                              {review.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold">
                                {review.userName}
                              </span>
                              {review.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                            <h4 className="font-medium mb-2">{review.title}</h4>
                            <p className="text-muted-foreground mb-3 leading-relaxed">
                              {review.comment}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-[#43abc3] transition-colors">
                                <ThumbsUp className="h-4 w-4" />
                                Helpful ({review.helpful})
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="group cursor-pointer hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {renderStars(relatedProduct.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({relatedProduct.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#43abc3]">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(`/products/${relatedProduct.id}`)
                        }
                        className="bg-[#43abc3] hover:bg-[#3a9bb5]"
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
