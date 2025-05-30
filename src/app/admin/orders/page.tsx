"use client";

import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrencyContext } from "@/contexts/CurrencyContext";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Package,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
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

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "user-001",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    status: "delivered",
    items: [
      {
        productId: "mixpad-mini",
        productName: "MixPad Mini Super Smart Panel",
        productImage:
          "https://res.cloudinary.com/control4/image/upload/f_auto,q_auto,dpr_auto/www/control4/homepage/OS_3_WWW_Home_1b.jpg",
        quantity: 1,
        price: 299,
        total: 299,
      },
    ],
    subtotal: 299,
    tax: 23.92,
    shipping: 0,
    total: 322.92,
    orderDate: "2024-01-15",
    estimatedDelivery: "2024-01-20",
    trackingNumber: "BOLES123456789",
    shippingAddress: {
      address1: "123 Smart Home Ave",
      city: "Tech City",
      state: "CA",
      zipCode: "94105",
      country: "United States",
    },
    paymentMethod: {
      type: "card",
      last4: "4242",
      brand: "Visa",
    },
  },
  {
    id: "ORD-002",
    userId: "user-002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    status: "shipped",
    items: [
      {
        productId: "outdoor-security-cam",
        productName: "BOLES Outdoor Security Camera",
        productImage: "https://m.media-amazon.com/images/I/716Ed4DBAML.jpg",
        quantity: 2,
        price: 249,
        total: 498,
      },
      {
        productId: "smart-led-strip",
        productName: "BOLES RGB Smart LED Strip",
        productImage:
          "https://m.media-amazon.com/images/I/714sp-DjYhL._AC_UF1000,1000_QL80_.jpg",
        quantity: 1,
        price: 79,
        total: 79,
      },
    ],
    subtotal: 577,
    tax: 46.16,
    shipping: 15,
    total: 638.16,
    orderDate: "2024-01-18",
    estimatedDelivery: "2024-01-25",
    trackingNumber: "BOLES987654321",
    shippingAddress: {
      address1: "456 Innovation Blvd",
      city: "Silicon Valley",
      state: "CA",
      zipCode: "94301",
      country: "United States",
    },
    paymentMethod: {
      type: "card",
      last4: "8888",
      brand: "Mastercard",
    },
  },
  {
    id: "ORD-003",
    userId: "user-003",
    customerName: "Mike Davis",
    customerEmail: "mike@example.com",
    status: "processing",
    items: [
      {
        productId: "voice-assistant-hub",
        productName: "BOLES Voice Assistant Hub",
        productImage:
          "https://m.media-amazon.com/images/I/61F4vOdQpqL._AC_UF1000,1000_QL80_.jpg",
        quantity: 1,
        price: 179,
        total: 179,
      },
    ],
    subtotal: 179,
    tax: 14.32,
    shipping: 10,
    total: 203.32,
    orderDate: "2024-01-20",
    estimatedDelivery: "2024-01-27",
    shippingAddress: {
      address1: "789 Smart Street",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "United States",
    },
    paymentMethod: {
      type: "card",
      last4: "1234",
      brand: "American Express",
    },
  },
  {
    id: "ORD-004",
    userId: "user-004",
    customerName: "Lisa Wilson",
    customerEmail: "lisa@example.com",
    status: "pending",
    items: [
      {
        productId: "keypad-smart-lock",
        productName: "Smart Keypad Door Lock",
        productImage:
          "https://m.media-amazon.com/images/I/71WCY7n+nuL._AC_UF894,1000_QL80_.jpg",
        quantity: 2,
        price: 279,
        total: 558,
      },
    ],
    subtotal: 558,
    tax: 44.64,
    shipping: 0,
    total: 602.64,
    orderDate: "2024-01-22",
    estimatedDelivery: "2024-01-29",
    shippingAddress: {
      address1: "321 Security Lane",
      city: "Denver",
      state: "CO",
      zipCode: "80201",
      country: "United States",
    },
    paymentMethod: {
      type: "card",
      last4: "5555",
      brand: "Visa",
    },
  },
];

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { convertToNaira, formatNaira } = useCurrencyContext();

  const filterOrders = useCallback(() => {
    let filtered = orders;

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.trackingNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <RefreshCw className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => formatNaira(convertToNaira(price));

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-gray-600">Monitor and manage customer orders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-[#43abc3] hover:bg-[#3a9bb5]">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {orderStats.total}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orderStats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orderStats.processing}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-purple-600">
                  {orderStats.shipped}
                </p>
              </div>
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {orderStats.delivered}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-xl font-bold text-green-600">
                  {formatPrice(orderStats.revenue)}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders, customers, or tracking numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item) => (
                      <img
                        key={item.productId}
                        src={item.productImage}
                        alt={item.productName}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">
                        {order.id}
                      </h3>
                      <Badge
                        className={`${getStatusColor(order.status)} flex items-center space-x-1`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.customerName} • {order.customerEmail}
                    </p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        Ordered {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                      {order.trackingNumber && (
                        <span>Tracking: {order.trackingNumber}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} items
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        handleUpdateOrderStatus(
                          order.id,
                          value as Order["status"],
                        )
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No orders have been placed yet"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
