import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React from "react";
import QRCodeDisplay from "@/components/QRCodeDisplay";

type LastOrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type LastOrder = {
  items: LastOrderItem[];
  total: number;
  timestamp: number;
  orderId?: string;
};

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState<LastOrder | null>(null);

  React.useEffect(() => {
    const data = localStorage.getItem("lastOrder");
    if (data) {
      setOrder(JSON.parse(data));
    }
  }, []);

  const trackUrl = order?.orderId
    ? `${window.location.origin}/track-order?orderId=${order.orderId}`
    : "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-primary">Thank you for your order!</h1>
        <p className="mb-6 text-gray-600">Your order has been placed and will be ready soon.</p>
        {order?.orderId && (
          <div className="mb-6 w-full flex flex-col items-center">
            <div className="font-semibold mb-2">Track your order:</div>
            <QRCodeDisplay value={trackUrl} />
            <div className="text-xs text-gray-500 mt-2 break-all">{trackUrl}</div>
          </div>
        )}
        {order && order.items.length > 0 && (
          <div className="w-full mb-6">
            <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
            <ul className="divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="py-2 flex justify-between">
                  <span>
                    {item.name} <span className="text-xs text-gray-500">× {item.quantity}</span>
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4 font-bold">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        )}
        <Button className="w-full mb-2" onClick={() => navigate("/")}>
          Back to Home
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => navigate("/menu")}
        >
          Order Again
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;