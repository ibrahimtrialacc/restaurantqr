import React from "react";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  is_special?: boolean;
  available?: boolean;
};

const MenuItemCard: React.FC<{ item: MenuItem; onAdd?: (e?: React.MouseEvent) => void }> = ({
  item,
  onAdd,
}) => (
  <div className={`bg-white rounded-lg shadow p-4 flex flex-col items-center ${item.available === false ? "opacity-50" : ""}`}>
    {item.image && (
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded mb-2"
      />
    )}
    <h3 className="font-semibold text-lg flex items-center gap-2">
      {item.name}
      {item.is_special && (
        <span className="bg-yellow-400 text-xs text-white px-2 py-0.5 rounded-full ml-2">Special</span>
      )}
    </h3>
    <p className="text-gray-500 text-sm mb-2">{item.description}</p>
    <div className="flex items-center justify-between w-full">
      <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
      {onAdd && item.available !== false && (
        <button
          className="ml-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition"
          onClick={onAdd}
        >
          Add
        </button>
      )}
      {item.available === false && (
        <span className="ml-2 text-xs text-red-500 font-semibold">Unavailable</span>
      )}
    </div>
  </div>
);

export default MenuItemCard;