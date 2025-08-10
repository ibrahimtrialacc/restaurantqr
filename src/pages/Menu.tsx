import MenuItemCard, { MenuItem as LocalMenuItem } from "@/components/MenuItemCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/components/CartContext";
import { ShoppingCart } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import React from "react";
import MenuItemDetailDialog from "@/components/MenuItemDetailDialog";
import { fetchMenuItems } from "@/integrations/supabase/menu";
import { useQuery } from "@tanstack/react-query";
import { useBranch } from "@/components/BranchContext";

type Category = "All" | "Pizza" | "Salad" | "Pasta" | string;

const Menu = () => {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { branch } = useBranch();
  const [selectedCategory, setSelectedCategory] = React.useState<Category>("All");
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<LocalMenuItem | null>(null);

  const { data: menuItems = [], isLoading, error } = useQuery({
    queryKey: ["menu_items", branch.id],
    queryFn: () => fetchMenuItems(branch.id),
  });

  const handleAdd = (item: LocalMenuItem) => {
    addToCart(item);
    showSuccess(`${item.name} added to cart`);
    setDetailOpen(false);
  };

  const mappedItems: LocalMenuItem[] = menuItems.map((item) => ({
    id: typeof item.id === "string" ? item.id : String(item.id),
    name: item.name,
    description: item.description || "",
    price: typeof item.price === "number" ? item.price : 0,
    image: item.image_url,
    is_special: item.is_special,
    available: item.available,
  }));

  const dynamicCategories = [
    "All",
    ...Array.from(new Set(menuItems.map((item) => item.category).filter(Boolean))),
  ] as Category[];

  const filteredItems =
    selectedCategory === "All"
      ? mappedItems
      : mappedItems.filter((item, idx) =>
          menuItems[idx]?.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Menu</h2>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/")}>
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/cart")}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {dynamicCategories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <div className="text-center text-gray-500 py-12">Loading menu...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">Failed to load menu.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredItems.length === 0 ? (
              <div className="col-span-2 text-center text-gray-500">No items in this category.</div>
            ) : (
              filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedItem(item);
                    setDetailOpen(true);
                  }}
                >
                  <MenuItemCard
                    item={item}
                    onAdd={(e) => {
                      e?.stopPropagation?.();
                      handleAdd(item);
                    }}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <MenuItemDetailDialog
        item={selectedItem}
        open={detailOpen}
        onAdd={handleAdd}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
};

export default Menu;