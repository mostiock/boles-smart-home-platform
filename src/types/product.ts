export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image: string;
  images?: string[]; // Multiple images for gallery
  imageUploads?: string[]; // Admin uploaded images
  features: string[];
  specifications?: { [key: string]: string };
  inStock: boolean;
  stockCount?: number;
  rating: number;
  reviewCount: number; // Number of reviews
  badges?: string[];
  brand?: string;
  model?: string;
  warranty?: string;
  compatibility?: string[];
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export type ProductCategory =
  | "smart-lighting"
  | "security-cameras"
  | "smart-speakers"
  | "smart-locks"
  | "sensors-detectors"
  | "control-panels";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShoppingCart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CategoryFilter {
  id: ProductCategory;
  name: string;
  description: string;
  icon: string;
}
