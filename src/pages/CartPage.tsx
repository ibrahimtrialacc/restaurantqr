import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";
import React, { useState } from "react";
import { placeOrder } from "@/integrations/supabase/orders";
import { useSession } from "@/components/SessionContextProvider";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const { session } = useSession();

  if (!session) {
    navigate("/login");
    return null;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // New: Collect customer info
  const [customer, setCustomer] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!customer.trim() || !location.trim()) {
      showError("Please enter your name and location.");
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        customer,
        items: cart.map(({ id, name, quantity, price }) => ({ id, name, quantity, price })),
        total,
        location,
        notes,
      };
      const newOrder = await placeOrder(orderData);
      showSuccess("Order placed! Your Order ID: " + newOrder.id);
      // Store last order in localStorage for confirmation page
      const lastOrder = {
        items: cart,
        total,
        timestamp: Date.now(),
        orderId: newOrder.id,
        customer,
        location,
        notes,
      };
      localStorage.setItem("lastOrder", JSON.stringify(lastOrder));
      // Store all orders in localStorage array (for order history page)
      const prevOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify([lastOrder, ...prevOrders]));
      clearCart();
      setTimeout(() => {
        navigate("/order-confirmation");
      }, 800);
    } catch (err) {
      showError("Failed to place order. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Your Order</h2>
          <Button variant="secondary" onClick={() => navigate("/menu")}>
            Back to Menu
          </Button>
        </div>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center text-center text-gray-500 py-12">
            <div className="mb-4 text-4xl">🛒</div>
            <div className="mb-2">Your cart is empty.</div>
            <Button className="mt-4" onClick={() => navigate("/menu")}>
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <ul className="divide-y">
              {cart.map((item) => (
                <li key={item.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mt-6">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
            {/* Customer info form */}
            <div className="mt-6 space-y-3">
              <Input
                placeholder="Your Name"
                value={customer}
                onChange={e => setCustomer(e.target.value)}
                disabled={loading}
              />
              <Input
                placeholder="Table/Flat/House Number"
                value={location}
                onChange={e => setLocation(e.target.value)}
                disabled={loading}
              />
              <Input
                placeholder="Notes (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button className="w-full" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={clearCart}
                disabled={loading}
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;