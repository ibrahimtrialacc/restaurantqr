import React, { useState, useEffect } from "react";
import { Clock, MapPin, CheckCircle, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchOrders, updateOrderStatus, Order as SupabaseOrder } from "@/integrations/supabase/orders";

type OrderStatus = "pending" | "preparing" | "ready";

type Order = SupabaseOrder;

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "pending": return "bg-red-100 text-red-800 border-red-200";
    case "preparing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ready": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getLocationIcon = (location?: string) => {
  if (!location) return "📍";
  if (location.toLowerCase().includes("table")) return "🪑";
  if (location.toLowerCase().includes("flat")) return "🏢";
  if (location.toLowerCase().includes("house")) return "🏠";
  return "📍";
};

const formatTime = (created_at?: string) => {
  if (!created_at) return "";
  const date = new Date(created_at);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60)); // minutes
  if (diff < 60) {
    return `${diff}m ago`;
  } else {
    return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
  }
};

const getNextStatus = (status: OrderStatus): OrderStatus => {
  if (status === "pending") return "preparing";
  if (status === "preparing") return "ready";
  return "ready";
};

const sendOrderStatusEmail = async (email: string, orderId: string, status: string) => {
  try {
    const res = await fetch("https://ddqqvpujkspvkhjcdych.supabase.co/functions/v1/order-status-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, orderId, status }),
    });
    if (!res.ok) throw new Error("Failed to send email");
  } catch {
    // Optionally show a toast or log error
  }
};

const KitchenDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000); // Poll every 5s for updates
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId} marked as ${newStatus}`);
      // Send notification if customer email is available
      if (order?.customer && order.customer.includes("@")) {
        await sendOrderStatusEmail(order.customer, orderId, newStatus);
      }
      loadOrders();
    } catch {
      toast.error("Failed to update order status.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kitchen Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage incoming orders and track preparation status</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Time</div>
            <div className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Orders</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading orders...</div>
        ) : (
          <div className="space-y-6">
            {orders.length === 0 && (
              <div className="text-center py-12">
                <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Orders</h3>
                <p className="text-gray-500">All orders are completed. Great job!</p>
              </div>
            )}
            {orders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  order.status === "pending"
                    ? "border-l-red-500"
                    : order.status === "preparing"
                    ? "border-l-yellow-500"
                    : "border-l-green-500"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-900">#{order.id}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status as OrderStatus)}`}
                    >
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-gray-500 mb-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{formatTime(order.created_at)}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">${order.total}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <span className="mr-2">{getLocationIcon(order.location)}</span>
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="font-medium">{order.location || "N/A"}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {order.notes && (
                  <div className="bg-blue-50 p-3 rounded-md mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Customer Notes:</strong> {order.notes}
                    </p>
                  </div>
                )}
                <div className="flex space-x-2">
                  {order.status === "pending" && (
                    <Button
                      className="flex-1 bg-yellow-600 text-white hover:bg-yellow-700"
                      onClick={() => handleUpdateStatus(order.id, "preparing")}
                    >
                      <Utensils className="w-4 h-4 mr-2" />
                      Start Preparing
                    </Button>
                  )}
                  {order.status === "preparing" && (
                    <Button
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleUpdateStatus(order.id, "ready")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Ready
                    </Button>
                  )}
                  {order.status === "ready" && (
                    <div className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-md text-center font-medium">
                      ✅ Ready for Pickup/Delivery
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default KitchenDashboard;