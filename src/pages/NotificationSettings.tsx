import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const NotificationSettings: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="font-semibold mb-1">Push Notifications</div>
            <p className="text-gray-600 text-sm mb-2">
              Push notifications are not enabled yet. To enable push notifications, integration with a third-party provider (like OneSignal or Firebase Cloud Messaging) is required.
            </p>
            <Button disabled className="w-full mb-2">
              Enable Push Notifications
            </Button>
            <div className="text-xs text-gray-400">
              <strong>Note:</strong> This is a placeholder. Please contact your administrator to enable push notifications for your app.
            </div>
          </div>
          <div className="mt-6">
            <div className="font-semibold mb-1">Email/SMS Notifications</div>
            <p className="text-gray-600 text-sm">
              You will continue to receive important updates via email or SMS (if enabled).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;