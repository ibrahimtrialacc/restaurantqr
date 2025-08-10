import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchOrders, Order as SupabaseOrder } from "@/integrations/supabase/orders";
import { useSession } from "@/components/SessionContextProvider";
import FeedbackForm from "@/components/FeedbackForm";
import { fetchFeedbackForOrder } from "@/integrations/supabase/feedback";

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<SupabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchOrders();
        // Only show orders for this user
        const filtered = session?.user?.id
          ? data.filter((order) => order.user_id === session.user.id)
          : [];
        setOrders(filtered);

        // Check which orders already have feedback
        const feedbackChecks = await Promise.all(
          filtered.map((order) =>
            fetchFeedbackForOrder(order.id).then((fb) => !!fb)
          )
        );
        const map: Record<string, boolean> = {};
        filtered.forEach((order, idx) => {
          map[order.id] = feedbackChecks[idx];
        });
        setFeedbackMap(map);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    };
    loadOrders();
  }, [session]);

  if (!session) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500">No previous orders found.</div>
          ) : (
            <ul className="space-y-6">
              {orders.map((order, idx) => (
                <li key={order.id} className="border-b pb-4 last:border-b-0">
                  <div className="font-semibold mb-1">
                    Order ID: <span className="text-primary">{order.id || "N/A"}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Placed: {order.created_at ? new Date(order.created_at).toLocaleString() : "N/A"}
                  </div>
                  {order.customer && (
                    <div className="text-xs text-gray-500 mb-1">Customer: {order.customer}</div>
                  )}
                  {order.location && (
                    <div className="text-xs text-gray-500 mb-1">Location: {order.location}</div>
                  )}
                  {order.notes && (
                    <div className="text-xs text-gray-500 mb-1">Notes: {order.notes}</div>
                  )}
                  <ul className="mb-2">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.name} <span className="text-xs text-gray-400">× {item.quantity}</span>
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  {/* Feedback form for ready orders */}
                  {order.status === "ready" && !feedbackMap[order.id] && (
                    <FeedbackForm
                      orderId={order.id}
                      userId={session.user.id}
                      onSubmitted={() => setFeedbackMap((m) => ({ ...m, [order.id]: true }))}
                    />
                  )}
                  {order.status === "ready" && feedbackMap[order.id] && (
                    <div className="mt-2 text-green-600 text-sm">Thank you for your feedback!</div>
                  )}
                </li>
              ))}
            </ul>
          )}
          <Button className="mt-6 w-full" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;