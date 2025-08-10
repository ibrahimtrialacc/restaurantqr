import React from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import { useBranch } from "./BranchContext";

const RestaurantInfo: React.FC = () => {
  const { branch } = useBranch();

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2 text-primary">Contact & Info</h2>
      <div className="flex items-center mb-2 text-gray-700">
        <MapPin className="w-4 h-4 mr-2" />
        <span>{branch.address}</span>
      </div>
      <div className="flex items-center mb-2 text-gray-700">
        <Phone className="w-4 h-4 mr-2" />
        <span>{branch.phone}</span>
      </div>
      <div className="flex items-center text-gray-700">
        <Clock className="w-4 h-4 mr-2" />
        <span>{branch.hours}</span>
      </div>
    </div>
  );
};

export default RestaurantInfo;