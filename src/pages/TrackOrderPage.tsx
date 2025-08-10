import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, Clock, Utensils, MapPin, StickyNote } from "lucide-react";
import { fetchOrders, Order as SupabaseOrder } from "@/integrations/supabase/orders";

type Order = SupabaseOrder;

const statusMap: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "Pending", icon: <Clock className="w-5 h-5" />, color: "text-yellow-600" },
  preparing: { label: "Preparing", icon: <Utensils className="w-5 h-5" />, color: "text-blue-600" },
  ready: { label: "Ready", icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600" },
};

const TrackOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    try {
      // Fetch all orders and find by id (could be optimized with a direct query if needed)
      const orders = await fetchOrders();
      const found = orders.find((o) => o.id === orderId.trim());
      if (found) {
        setOrder(found);
        setNotFound(false);
      } else {
        setOrder(null);
        setNotFound(true);
      }
    } catch {
      setOrder(null);
      setNotFound(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleTrack}
            className="flex gap-2 mb-4"
          >
            <Input
              placeholder="Enter Order ID"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!orderId.trim() || loading}>
              Track
            </Button>
          </form>
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin w-5 h-5" /> Loading...
            </div>
          )}
          {notFound && !loading && (
            <div className="text-red-600">Order not found. Please check your Order ID.</div>
          )}
          {order && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${statusMap[order.status]?.color || "text-gray-700"}`}>
                  {statusMap[order.status]?.icon} {statusMap[order.status]?.label || order.status}
                </span>
              </div>
              <div>
                <div className="font-medium">Order ID: <span className="text-gray-600">{order.id}</span></div>
                {order.customer && (
                  <div className="text-gray-500 text-sm">Customer: {order.customer}</div>
                )}
                {order.location && (
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Location: {order.location}</span>
                  </div>
                )}
                {order.notes && (
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <StickyNote className="w-4 h-4 mr-1" />
                    <span>Notes: {order.notes}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold mb-1">Items:</div>
                <ul className="list-disc pl-5">
                  {order.items?.map((item, idx) => (
                    <li key={idx}>
                      {item.name} <span className="text-xs text-gray-500">× {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackOrderPage;