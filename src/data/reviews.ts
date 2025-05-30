import type { ProductReview } from "@/types/product";

export const sampleReviews: { [productId: string]: ProductReview[] } = {
  "mixpad-mini": [
    {
      id: "rev-1",
      userId: "user-1",
      userName: "Sarah Johnson",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      title: "Perfect for our smart home setup",
      comment:
        "The MixPad Mini has exceeded our expectations. The touchscreen is incredibly responsive and the setup was surprisingly easy. Integration with our existing smart devices was seamless.",
      date: "2024-01-15",
      verified: true,
      helpful: 23,
    },
    {
      id: "rev-2",
      userId: "user-2",
      userName: "Michael Chen",
      userAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      title: "Great device, minor connectivity issues",
      comment:
        "Overall very satisfied with the purchase. The panel looks sleek and modern. Had some initial WiFi connectivity issues but support helped resolve them quickly.",
      date: "2024-01-10",
      verified: true,
      helpful: 15,
    },
    {
      id: "rev-3",
      userId: "user-3",
      userName: "Emma Rodriguez",
      userAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      title: "Love the compact design!",
      comment:
        "This panel fits perfectly in our kitchen. The 4-inch screen is the ideal size - not too big, not too small. The unlimited scenarios feature is amazing.",
      date: "2024-01-08",
      verified: true,
      helpful: 18,
    },
  ],
  "mixpad-s-gateway": [
    {
      id: "rev-4",
      userId: "user-4",
      userName: "David Park",
      userAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      title: "The ultimate smart home hub",
      comment:
        "Finally, one device that controls everything! The built-in gateway eliminated the need for multiple hubs. Setup was straightforward and it handles all 47 of our smart devices without any issues.",
      date: "2024-01-12",
      verified: true,
      helpful: 31,
    },
    {
      id: "rev-5",
      userId: "user-5",
      userName: "Lisa Thompson",
      userAvatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      title: "Premium quality, worth the investment",
      comment:
        "The build quality is excellent and the interface is intuitive. The dual microphone array works really well for voice commands. A bit pricey but you get what you pay for.",
      date: "2024-01-05",
      verified: true,
      helpful: 12,
    },
  ],
  "outdoor-security-cam": [
    {
      id: "rev-6",
      userId: "user-6",
      userName: "Robert Kim",
      userAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      title: "Crystal clear 4K footage",
      comment:
        "The video quality is outstanding, even at night. The motion detection is very accurate and the weather resistance has been tested through a harsh winter. Highly recommended.",
      date: "2024-01-14",
      verified: true,
      helpful: 27,
    },
    {
      id: "rev-7",
      userId: "user-7",
      userName: "Jennifer Walsh",
      userAvatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      title: "Great security camera with minor app issues",
      comment:
        "The camera itself is fantastic - great image quality and reliable motion alerts. The mobile app could use some improvements for easier navigation, but overall very happy.",
      date: "2024-01-09",
      verified: true,
      helpful: 8,
    },
  ],
};

export const getReviewsForProduct = (productId: string): ProductReview[] => {
  return sampleReviews[productId] || [];
};

export const getAverageRating = (reviews: ProductReview[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

export const getRatingDistribution = (reviews: ProductReview[]) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const review of reviews) {
    distribution[review.rating as keyof typeof distribution]++;
  }
  return distribution;
};
