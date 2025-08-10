import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, BarChart2, ShoppingBag, Bell, Menu as MenuIcon, Save, X, MapPin, Settings } from "lucide-react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import {
  fetchMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  MenuItem as SupabaseMenuItem,
} from "@/integrations/supabase/menu";
import {
  fetchOffers,
  addOffer,
  updateOffer,
  deleteOffer,
  Offer as SupabaseOffer,
} from "@/integrations/supabase/offers";
import {
  fetchOrders,
  Order as SupabaseOrder,
} from "@/integrations/supabase/orders";
import {
  fetchBranches,
  addBranch,
  updateBranch,
  deleteBranch,
  Branch as SupabaseBranch,
} from "@/integrations/supabase/branches";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const AdminPanel: React.FC = () => {
  const [tab, setTab] = useState("offers");
  const navigate = useNavigate();

  // ... existing code unchanged ...

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MenuIcon className="w-5 h-5" />
              Restaurant Admin Panel
              <Button
                size="icon"
                variant="ghost"
                className="ml-auto"
                onClick={() => navigate("/admin-settings")}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* ... rest of the code unchanged ... */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;