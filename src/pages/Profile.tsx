import React, { useState, useEffect } from "react";
import { useSession } from "@/components/SessionContextProvider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";

const Profile = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setAvatarUrl(data.avatar_url || "");
      }
    };
    fetchProfile();
  }, [session]);

  const handleSave = async () => {
    if (!session) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
      })
      .eq("id", session.user.id);
    setLoading(false);
    if (error) {
      showError("Failed to update profile.");
    } else {
      showSuccess("Profile updated!");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-primary">Profile</h1>
        <div className="mb-4">
          <div className="font-semibold">Email:</div>
          <div>{session.user.email}</div>
        </div>
        <div className="mb-4">
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Avatar URL"
            value={avatarUrl}
            onChange={e => setAvatarUrl(e.target.value)}
            className="mb-2"
          />
          {avatarUrl && (
            <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full mt-2" />
          )}
        </div>
        <Button className="w-full mb-2" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button className="w-full" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;