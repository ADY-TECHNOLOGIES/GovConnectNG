import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  User,
  FileText,
  CheckCircle2,
  Clock,
  Search,
  Bell,
  Building2,
  LogOut,
  ArrowRight,
  Pencil,
  Camera,
  Loader2,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  status: string;
  priority: string;
  tracking_id: string;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    logout,
    updateAvatar,
  } = useAuth();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    review: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    setAvatarUploading(true);
  
    try {
      const result = await updateAvatar(file);
  
      if (result?.error) {
        toast.error(result.error);
        return;
      }
  
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Avatar change error:", error);
  
      toast.error("Unable to update profile picture.");
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);

    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setReports(data);

      setStats({
        total: data.length,
        resolved: data.filter(r => r.status === "resolved").length,
        pending: data.filter(r => r.status === "pending").length,
        review: data.filter(r => r.status === "in_review").length,
      });
    }

    setLoading(false);
  };

  const initials =
    user?.full_name
      ?.split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase() || "U";

  const citizenLevel =
    stats.total >= 10
      ? "Community Champion"
      : stats.total >= 5
      ? "Active Citizen"
      : "New Citizen";

      return (
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
    
          {/* Hero */}
    
          <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 text-white">
    
            <CardContent className="p-8">
    
              <div className="flex flex-col md:flex-row items-center gap-6">
    
              <div className="relative">
  <div
    style={{
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      overflow: "hidden",
      background: "white",
      border: "4px solid white",
      position: "relative",
    }}
  >
    {user?.avatar_url ? (
      <img
        src={user.avatar_url}
        alt="Profile"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    ) : (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          fontWeight: "bold",
          color: "green",
        }}
      >
        {initials}
      </div>
    )}
  </div>

  <label
    htmlFor="avatar-upload"
    style={{
      position: "absolute",
      right: "0",
      bottom: "0",
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "white",
      color: "green",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: avatarUploading ? "not-allowed" : "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      opacity: avatarUploading ? 0.6 : 1,
    }}
  >
    {avatarUploading ? (
      <Loader2 size={18} className="animate-spin" />
    ) : (
      <Camera size={18} />
    )}
  </label>

  <input
    id="avatar-upload"
    type="file"
    accept="image/jpeg,image/png,image/webp"
    className="hidden"
    onChange={handleAvatarChange}
    disabled={avatarUploading}
  />
</div>

    
                <div className="flex-1 text-center md:text-left">
    
                  <h1 className="text-3xl font-bold">
                    {user?.full_name || "Citizen"}
                  </h1>
    
                  <p className="opacity-90 mt-2">
                    {user?.email}
                  </p>
    
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
    
                    <Badge className="bg-white text-green-700">
                      Verified Citizen
                    </Badge>
    
                    <Badge className="bg-green-900 text-white">
                      {citizenLevel}
                    </Badge>
    
                  </div>
    
                  <p className="text-green-100 mt-4">
  Member since{" "}
  {user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently"}
</p>

<Button
  onClick={() => navigate("/profile/edit")}
  className="mt-5 bg-white text-green-700 hover:bg-green-50 rounded-xl font-semibold"
>
  <Pencil className="mr-2" size={18} />
  Edit Profile
</Button>

    
                </div>
    
              </div>
    
            </CardContent>
    
          </Card>
    
          {/* Statistics */}
    
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
    
            <Card className="rounded-2xl">
    
              <CardContent className="p-6 text-center">
    
                <FileText className="mx-auto text-blue-600 mb-3" size={30} />
    
                <p className="text-3xl font-bold">
                  {stats.total}
                </p>
    
                <p className="text-gray-500">
                  Reports
                </p>
    
              </CardContent>
    
            </Card>
    
            <Card className="rounded-2xl">
    
              <CardContent className="p-6 text-center">
    
                <CheckCircle2
                  className="mx-auto text-green-600 mb-3"
                  size={30}
                />
    
                <p className="text-3xl font-bold text-green-600">
                  {stats.resolved}
                </p>
    
                <p className="text-gray-500">
                  Resolved
                </p>
    
              </CardContent>
    
            </Card>
    
            <Card className="rounded-2xl">
    
              <CardContent className="p-6 text-center">
    
                <Clock
                  className="mx-auto text-yellow-600 mb-3"
                  size={30}
                />
    
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
    
                <p className="text-gray-500">
                  Pending
                </p>
    
              </CardContent>
    
            </Card>
    
            <Card className="rounded-2xl">
    
              <CardContent className="p-6 text-center">
    
                <Search
                  className="mx-auto text-purple-600 mb-3"
                  size={30}
                />
    
                <p className="text-3xl font-bold text-purple-600">
                  {stats.review}
                </p>
    
                <p className="text-gray-500">
                  In Review
                </p>
    
              </CardContent>
    
            </Card>
    
          </section>

                {/* Quick Actions */}

      <section>

<h2 className="text-2xl font-bold mb-5">
  Quick Actions
</h2>

<div className="grid grid-cols-2 md:grid-cols-4 gap-5">

  <Button
    className="h-20 rounded-2xl flex-col gap-2"
    onClick={() => navigate("/reports/new")}
  >
    <FileText size={24} />
    Report Issue
  </Button>

  <Button
    variant="outline"
    className="h-20 rounded-2xl flex-col gap-2"
    onClick={() => navigate("/reports")}
  >
    <Search size={24} />
    My Reports
  </Button>

  <Button
    variant="outline"
    className="h-20 rounded-2xl flex-col gap-2"
    onClick={() => navigate("/notifications")}
  >
    <Bell size={24} />
    Notifications
  </Button>

  <Button
    variant="outline"
    className="h-20 rounded-2xl flex-col gap-2"
    onClick={() => navigate("/services")}
  >
    <Building2 size={24} />
    Services
  </Button>

</div>

</section>

{/* Recent Reports */}

<section>

<div className="flex justify-between items-center mb-5">

  <h2 className="text-2xl font-bold">
    Recent Reports
  </h2>

  <Button
    variant="ghost"
    onClick={() => navigate("/reports")}
  >
    View All
    <ArrowRight className="ml-2" size={18} />
  </Button>

</div>

{loading ? (

  <Card>

    <CardContent className="p-8 text-center">
      Loading reports...
    </CardContent>

  </Card>

) : reports.length === 0 ? (

  <Card>

    <CardContent className="p-10 text-center">

      <FileText
        className="mx-auto text-gray-400 mb-4"
        size={50}
      />

      <h3 className="text-xl font-bold">
        No Reports Yet
      </h3>

      <p className="text-gray-500 mt-2">
        Start improving your community by submitting your first report.
      </p>

      <Button
        className="mt-6"
        onClick={() => navigate("/reports/new")}
      >
        Report an Issue
      </Button>

    </CardContent>

  </Card>

) : (

  <div className="space-y-4">

    {reports.slice(0, 5).map((report) => (

      <Card
        key={report.id}
        className="rounded-2xl hover:shadow-lg transition cursor-pointer"
        onClick={() => navigate(`/reports/${report.id}`)}
      >

        <CardContent className="p-5">

          <div className="flex justify-between items-start">

            <div>

              <h3 className="font-bold text-lg">
                {report.title}
              </h3>

              <p className="text-gray-500 mt-1">
                {report.tracking_id}
              </p>

            </div>

            <Badge>

              {report.status.replace("_", " ")}

            </Badge>

          </div>

          <div className="mt-4 flex justify-between items-center">

            <Badge variant="secondary">

              {report.priority}

            </Badge>

            <span className="text-sm text-gray-400">

              {new Date(report.created_at).toLocaleDateString()}

            </span>

          </div>

        </CardContent>

      </Card>

    ))}

  </div>

)}

</section>

      {/* Logout */}

      <section>

        <Card className="rounded-2xl border-red-100">

          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">

            <div>

              <h3 className="font-bold text-lg">
                Account
              </h3>

              <p className="text-gray-500">
                You can securely sign out of your GovConnect NG account.
              </p>

            </div>

            <Button
              variant="destructive"
              onClick={logout}
            >
              <LogOut className="mr-2" size={18} />
              Log Out
            </Button>

          </CardContent>

        </Card>

      </section>

      {/* Footer */}

      <footer className="text-center border-t pt-8 pb-6">

        <h2 className="text-2xl font-bold text-green-700">
          🇳🇬 GovConnect NG
        </h2>

        <p className="text-gray-500 mt-2">
          Connecting Citizens with Local Government
        </p>

        <p className="text-gray-400 text-sm mt-2">
          Empowering transparency, accountability and better public service delivery.
        </p>

        <div className="mt-5 flex justify-center gap-6 text-sm text-gray-500 flex-wrap">

          <span>Reports</span>

          <span>Services</span>

          <span>Notifications</span>

          <span>Dashboard</span>

        </div>

        <p className="mt-8 text-xs text-gray-400">
          © 2026 GovConnect NG. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
};

export default Profile;