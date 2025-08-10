import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSetting, setSetting } from "@/integrations/supabase/settings";
import { showSuccess, showError } from "@/utils/toast";

const AdminSettings: React.FC = () => {
  const [sendgridKey, setSendgridKey] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSetting("SENDGRID_API_KEY").then((val) => setSendgridKey(val || ""));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await setSetting("SENDGRID_API_KEY", sendgridKey);
      showSuccess("SendGrid API key saved!");
    } catch {
      showError("Failed to save key.");
    }
    setLoading(false);
  };

  const handleTest = async () => {
    setLoading(true);
    try {
      // Call edge function to send test email
      const res = await fetch("https://ddqqvpujkspvkhjcdych.supabase.co/functions/v1/order-status-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          orderId: "test",
          status: "test"
        }),
      });
      if (res.ok) {
        showSuccess("Test email sent (check SendGrid logs).");
      } else {
        showError("Failed to send test email.");
      }
    } catch {
      showError("Failed to send test email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="font-semibold mb-1">SendGrid API Key</div>
            <Input
              value={sendgridKey}
              onChange={e => setSendgridKey(e.target.value)}
              placeholder="SG.xxxxx"
              className="mb-2"
            />
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
          <div className="mt-6">
            <div className="font-semibold mb-1">Test Order Status Email</div>
            <Button onClick={handleTest} disabled={loading}>
              {loading ? "Sending..." : "Send Test Email"}
            </Button>
            <div className="text-xs text-gray-400 mt-2">
              Sends a test email to <b>test@example.com</b> using the configured SendGrid key.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;