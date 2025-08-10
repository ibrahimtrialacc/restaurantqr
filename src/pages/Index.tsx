import { MadeWithDyad } from "@/components/made-with-dyad";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import RestaurantInfo from "@/components/RestaurantInfo";
import PushNotificationOptIn from "@/components/PushNotificationOptIn";
import BranchSelector from "@/components/BranchSelector";
import { useBranch } from "@/components/BranchContext";
import { useSession } from "@/components/SessionContextProvider";

const Index = () => {
  const navigate = useNavigate();
  const { branch } = useBranch();
  const { session } = useSession();
  const QR_URL = window.location.origin + "/menu?branch=" + branch.id;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center w-full max-w-md">
        <BranchSelector />
        <h1 className="text-3xl font-bold mb-2 text-primary">{branch.name}</h1>
        <p className="mb-4 text-gray-600">Scan the QR code to view our menu!</p>
        <QRCodeDisplay value={QR_URL} />
        <Button className="mt-6 w-full" onClick={() => navigate("/menu")}>
          View Menu
        </Button>
        <Button className="mt-2 w-full" variant="outline" onClick={() => navigate("/offers")}>
          View Offers
        </Button>
        <Button className="mt-2 w-full" variant="outline" onClick={() => navigate("/admin")}>
          Admin Panel
        </Button>
        <Button className="mt-2 w-full" variant="secondary" onClick={() => navigate("/kitchen")}>
          Kitchen Dashboard
        </Button>
        <Button className="mt-2 w-full" variant="ghost" onClick={() => navigate("/order-history")}>
          Order History
        </Button>
        {session ? (
          <Button className="mt-2 w-full" variant="ghost" onClick={() => navigate("/profile")}>
            Profile
          </Button>
        ) : (
          <Button className="mt-2 w-full" variant="ghost" onClick={() => navigate("/login")}>
            Login / Sign Up
          </Button>
        )}
        <Button className="mt-2 w-full" variant="ghost" onClick={() => navigate("/notification-settings")}>
          Notification Settings
        </Button>
        <RestaurantInfo />
        <PushNotificationOptIn />
      </div>
      <div className="mt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;