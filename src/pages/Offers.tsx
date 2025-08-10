import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOffers, Offer } from "@/integrations/supabase/offers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Offers: React.FC = () => {
  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ["offers"],
    queryFn: fetchOffers,
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Current Offers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-gray-500">Loading offers...</div>
          ) : error ? (
            <div className="text-red-500">Failed to load offers.</div>
          ) : offers.length === 0 ? (
            <div className="text-gray-500">No current offers.</div>
          ) : (
            <ul className="space-y-4">
              {offers.map((offer) => (
                <li key={offer.id} className="border-b pb-2 last:border-b-0">
                  <div className="font-semibold">{offer.title}</div>
                  <div className="text-sm text-gray-600">{offer.message}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {offer.date ? new Date(offer.date).toLocaleDateString() : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Offers;