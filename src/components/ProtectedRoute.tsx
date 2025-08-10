import React from "react";
import { useSession } from "./SessionContextProvider";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useSession();
  const location = useLocation();

  // Only check admin for /admin and /kitchen
  const needsAdmin = ["/admin", "/kitchen"].some((path) =>
    location.pathname.startsWith(path)
  );

  const userId = session?.user?.id;
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => (userId ? fetchProfile(userId) : Promise.resolve(null)),
    enabled: !!userId && needsAdmin,
  });

  if (loading || (needsAdmin && isLoading)) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;
  if (needsAdmin && !profile?.is_admin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;