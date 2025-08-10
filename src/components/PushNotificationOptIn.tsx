import React from "react";
import { Button } from "@/components/ui/button";

const PushNotificationOptIn: React.FC = () => {
  // Supabase does not natively support browser push notifications.
  // You can use Supabase Edge Functions to trigger notifications via third-party services (e.g., OneSignal, Expo, or email/SMS).
  // If you want to integrate a specific provider, let us know!

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2 text-primary">Push Notifications</h2>
      <p className="text-gray-600 mb-2">
        Push notifications are now managed by Supabase. 
        Direct browser push is not supported natively by Supabase.
      </p>
      <Button disabled>
        Enable Notifications
      </Button>
      <div className="mt-2 text-xs text-gray-400">
        <span>
          <strong>Note:</strong> To enable push notifications, integrate a third-party provider (e.g., OneSignal, Expo, or email/SMS) via Supabase Edge Functions.
        </span>
      </div>
    </div>
  );
};

export default PushNotificationOptIn;