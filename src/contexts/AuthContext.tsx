"use client";

import { type User, db } from "@/lib/database";
import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface Order {
  id: string;
  userId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shippingAddress: {
    address1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    last4: string;
    brand: string;
  };
}

interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  dateAdded: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  orders: Order[];
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock address for orders
const mockAddress = {
  id: "addr-1",
  type: "shipping" as const,
  firstName: "John",
  lastName: "Smith",
  address1: "123 Smart Home Ave",
  city: "Tech City",
  state: "CA",
  zipCode: "94105",
  country: "United States",
  isDefault: true,
};

const mockOrders: Order[] = [
  {
    id: "order-001",
    userId: "user-1",
    status: "delivered",
    items: [
      {
        productId: "mixpad-mini",
        productName: "MixPad Mini Super Smart Panel",
        productImage: "https://ext.same-assets.com/596243380/550675188.png",
        quantity: 1,
        price: 299,
        total: 299,
      },
    ],
    subtotal: 299,
    tax: 23.92,
    shipping: 0,
    total: 322.92,
    shippingAddress: mockAddress,
    billingAddress: mockAddress,
    paymentMethod: {
      id: "pm-1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
    },
    orderDate: "2024-01-10",
    estimatedDelivery: "2024-01-15",
    trackingNumber: "BOLES123456789",
  },
  {
    id: "order-002",
    userId: "user-1",
    status: "shipped",
    items: [
      {
        productId: "outdoor-security-cam",
        productName: "BOLES Outdoor Security Camera",
        productImage:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
        quantity: 2,
        price: 249,
        total: 498,
      },
    ],
    subtotal: 498,
    tax: 39.84,
    shipping: 0,
    total: 537.84,
    shippingAddress: mockAddress,
    billingAddress: mockAddress,
    paymentMethod: {
      id: "pm-1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
    },
    orderDate: "2024-01-20",
    estimatedDelivery: "2024-01-25",
    trackingNumber: "BOLES987654321",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Sync Clerk user with Supabase user
  useEffect(() => {
    const syncUser = async () => {
      if (!clerkLoaded) return;

      if (clerkUser) {
        try {
          // Check if user exists in Supabase
          let supabaseUser = await db.getUserByClerkId(clerkUser.id);

          if (!supabaseUser) {
            // Create user in Supabase
            const newUserData = {
              clerk_id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress || "",
              first_name: clerkUser.firstName || "",
              last_name: clerkUser.lastName || "",
              role: "user" as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            supabaseUser = await db.createUser(newUserData);
          }

          setUser(supabaseUser);

          // Load user data
          if (supabaseUser) {
            // Load orders from Supabase
            try {
              const userOrders = await db.getOrdersByUserId(supabaseUser.id);
              setOrders(userOrders.length > 0 ? userOrders : mockOrders); // Fallback to mock orders
            } catch (error) {
              console.error("Error loading orders:", error);
              setOrders(mockOrders); // Fallback to mock orders
            }

            // Load wishlist from Supabase
            try {
              const userWishlist = await db.getWishlist(supabaseUser.id);
              const wishlistItems: WishlistItem[] = userWishlist.map(
                (item) => ({
                  id: item.id,
                  productId: item.product_id,
                  userId: item.user_id,
                  dateAdded: item.created_at,
                }),
              );
              setWishlist(wishlistItems);
            } catch (error) {
              console.error("Error loading wishlist:", error);
              setWishlist([]);
            }
          }
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      } else {
        // User is not authenticated
        setUser(null);
        setOrders([]);
        setWishlist([]);
      }

      setIsLoading(false);
    };

    syncUser();
  }, [clerkUser, clerkLoaded]);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setOrders([]);
      setWishlist([]);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser = await db.updateUser(user.id, data);
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) return;

    try {
      await db.addToWishlist(user.id, productId);

      const newItem: WishlistItem = {
        id: `wishlist-${Date.now()}`,
        productId,
        userId: user.id,
        dateAdded: new Date().toISOString(),
      };

      setWishlist((prev) => [...prev, newItem]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      await db.removeFromWishlist(user.id, productId);
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!clerkUser,
        isAdmin: !!user && user.role === "admin",
        isLoading: isLoading || !clerkLoaded,
        logout,
        updateProfile,
        orders,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
