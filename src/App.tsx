import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import NotFound from "./pages/NotFound";
import CartPage from "./pages/CartPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import { CartProvider } from "@/components/CartContext";
import AdminPanel from "./pages/AdminPanel";
import KitchenDashboard from "./pages/KitchenDashboard";
import { BranchProvider } from "@/components/BranchContext";
import TrackOrderPage from "./pages/TrackOrderPage";
import OrderHistory from "./pages/OrderHistory";
import { SessionContextProvider } from "@/components/SessionContextProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";
import NotificationSettings from "./pages/NotificationSettings";
import AdminSettings from "./pages/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SessionContextProvider>
        <BranchProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/admin-settings" element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                } />
                <Route path="/kitchen" element={
                  <ProtectedRoute>
                    <KitchenDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/offers" element={<Offers />} />
                <Route path="/notification-settings" element={<NotificationSettings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </BranchProvider>
      </SessionContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;