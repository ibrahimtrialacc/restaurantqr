import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MenuItem } from "./MenuItemCard";

type Props = {
  item: MenuItem | null;
  open: boolean;
  onAdd: (item: MenuItem) => void;
  onOpenChange: (open: boolean) => void;
};

const MenuItemDetailDialog: React.FC<Props> = ({ item, open, onAdd, onOpenChange }) => {
  if (!item) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>{item.description}</DialogDescription>
        </DialogHeader>
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-lg text-primary">${item.price.toFixed(2)}</span>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button onClick={() => onAdd(item)}>Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDetailDialog;