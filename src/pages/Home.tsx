import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  MapPin,
  Shield,
  Heart,
  AlertTriangle,
  Building2,
  ArrowRight,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  location: string;
  tracking_id: string;
  created_at: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    critical: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    const { data } = await supabase
.from("reports")
.select("*")
.eq("user_id", user?.id)
.order("created_at",{ascending:false});

    if (data) {
      setReports(data);

      setStats({
        total: data.length,
        resolved: data.filter((r) => r.status === "resolved").length,
        pending: data.filter((r) => r.status === "pending").length,
        critical: data.filter((r) => r.priority === "critical").length,
      });
    }

    setLoading(false);
  };

  const categories = [
    {
      title: "Infrastructure",
      icon: Building2,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Security",
      icon: Shield,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Health",
      icon: Heart,
      color: "bg-pink-100 text-pink-700",
    },
    {
      title: "Environment",
      icon: MapPin,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Corruption",
      icon: AlertTriangle,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Others",
      icon: FileText,
      color: "bg-gray-100 text-gray-700",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

      {/* HERO */}

      <section className="rounded-3xl bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 text-white p-10 shadow-xl">

        <Badge className="bg-white text-green-700 mb-5">
          🇳🇬 GovConnect NG
        </Badge>

        <h1 className="text-5xl font-bold leading-tight">
  Welcome,
  <br />
  {user?.full_name || "Citizen"}
</h1>

<p className="mt-2 text-green-100">
  Together we're building a better Nigeria.
</p>

        <p className="mt-5 text-lg text-green-50 max-w-2xl">
          Report bad roads, flooding, insecurity, corruption,
          healthcare issues and environmental problems.
          Track every report from submission until resolution.
        </p>

        <div className="flex gap-4 mt-8 flex-wrap">

          <Button
            size="lg"
            className="bg-white text-green-700 hover:bg-gray-100"
            onClick={() => navigate("/reports/new")}
          >
            <Plus className="mr-2 h-5 w-5" />
            Report Issue
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-green-700"
            onClick={() => navigate("/reports")}
          >
            Track Reports
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

        </div>

      </section>

           {/* Statistics */}

           <section className="grid grid-cols-2 md:grid-cols-4 gap-5">

<Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
  <CardContent className="p-6 text-center">
    <TrendingUp className="mx-auto mb-3 text-green-600" size={30} />
    <p className="text-4xl font-bold">{stats.total}</p>
    <p className="text-gray-500">Total Reports</p>
  </CardContent>
</Card>

<Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
  <CardContent className="p-6 text-center">
    <CheckCircle2 className="mx-auto mb-3 text-green-600" size={30} />
    <p className="text-4xl font-bold text-green-600">
      {stats.resolved}
    </p>
    <p className="text-gray-500">Resolved</p>
  </CardContent>
</Card>

<Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
  <CardContent className="p-6 text-center">
    <Clock className="mx-auto mb-3 text-yellow-600" size={30} />
    <p className="text-4xl font-bold text-yellow-600">
      {stats.pending}
    </p>
    <p className="text-gray-500">Pending</p>
  </CardContent>
</Card>

<Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
  <CardContent className="p-6 text-center">
    <AlertTriangle className="mx-auto mb-3 text-red-600" size={30} />
    <p className="text-4xl font-bold text-red-600">
      {stats.critical}
    </p>
    <p className="text-gray-500">Critical</p>
  </CardContent>
</Card>

</section>

<div className="space-y-2">

<div className="flex justify-between">

<span>Resolved Reports</span>

<span>

{stats.resolved}/{stats.total}

</span>

</div>

<div className="w-full bg-gray-200 rounded-full h-3">

<div

className="bg-green-600 h-3 rounded-full"

style={{

width:`${stats.total
? (stats.resolved/stats.total)*100
:0}%`

}}

></div>

</div>

</div>

<section className="grid md:grid-cols-3 gap-6">

<Card
className="cursor-pointer hover:shadow-xl"
onClick={()=>navigate("/reports/new")}
>

<CardContent className="p-6">

<h3 className="font-bold text-lg">
📝 Submit Report
</h3>

<p className="text-gray-500 mt-2">
Report roads, flooding,
crime, hospitals,
environment etc.
</p>

</CardContent>

</Card>

<Card
className="cursor-pointer hover:shadow-xl"
onClick={()=>navigate("/reports")}
>

<CardContent className="p-6">

<h3 className="font-bold text-lg">
📍 Track Reports
</h3>

<p className="text-gray-500 mt-2">
View report progress in
real time.
</p>

</CardContent>

</Card>

<Card
className="cursor-pointer hover:shadow-xl"
onClick={()=>navigate("/services")}
>

<CardContent className="p-6">

<h3 className="font-bold text-lg">
🏛 Government Services
</h3>

<p className="text-gray-500 mt-2">
Access citizen services.
</p>

</CardContent>

</Card>

</section>

{/* Quick Report Categories */}

<section>

<div className="flex justify-between items-center mb-6">

  <h2 className="text-2xl font-bold">
    Report Categories
  </h2>

  <Button
    variant="ghost"
    onClick={() => navigate("/reports/new")}
  >
    New Report
  </Button>

</div>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

  {categories.map((category) => {

    const Icon = category.icon;

    return (

      <Card
        key={category.title}
        className="cursor-pointer rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all"
        onClick={() => navigate("/reports/new")}
      >

        <CardContent className="p-6 text-center">

          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${category.color}`}
          >
            <Icon size={26} />
          </div>

          <h3 className="font-semibold">
            {category.title}
          </h3>

        </CardContent>

      </Card>

    );

  })}

</div>

</section>

{/* Recent Reports */}

<section>

<div className="flex justify-between items-center mb-5">

  <h2 className="text-2xl font-bold">
    Recent Community Reports
  </h2>

  <Button
    variant="outline"
    onClick={() => navigate("/reports")}
  >
    View All
  </Button>

</div>

<div className="grid md:grid-cols-3 gap-5">

  {loading ? (

    <p>Loading reports...</p>

  ) : reports.length === 0 ? (

    <Card>

      <CardContent className="p-8 text-center">

        <FileText
          size={50}
          className="mx-auto mb-4 text-gray-400"
        />

        <h3 className="font-semibold text-lg">
          No Reports Yet
        </h3>

        <p className="text-gray-500 mt-2">
          Be the first citizen to report an issue.
        </p>

      </CardContent>

    </Card>

  ) : (

    reports.slice(0, 3).map((report) => (

      <Card
        key={report.id}
        onClick={() => navigate(`/reports/${report.id}`)}
        className="cursor-pointer rounded-2xl hover:shadow-xl transition"
      >

        <CardContent className="p-6 space-y-3">

          <Badge>
            {report.category}
          </Badge>

          <h3 className="font-bold text-lg">
            {report.title}
          </h3>

          <p className="text-gray-500">
            📍 {report.location}
          </p>

          <div className="flex justify-between">

            <Badge variant="secondary">
              {report.priority}
            </Badge>

            <Badge>
              {report.status.replace("_", " ")}
            </Badge>

          </div>

          <p className="text-xs text-gray-400">
            {report.tracking_id}
          </p>

        </CardContent>

      </Card>

    ))

  )}

</div>

</section>

{/* How GovConnect Works */}

<section>

<h2 className="text-2xl font-bold mb-6">
  How GovConnect Works
</h2>

<div className="grid md:grid-cols-3 gap-6">

  <Card>

    <CardContent className="p-8 text-center">

      <div className="text-5xl mb-4">
        📝
      </div>

      <h3 className="font-bold text-lg">
        1. Report
      </h3>

      <p className="text-gray-500 mt-2">
        Submit community issues with photos and location.
      </p>

    </CardContent>

  </Card>

  <Card>

    <CardContent className="p-8 text-center">

      <div className="text-5xl mb-4">
        🏛
      </div>

      <h3 className="font-bold text-lg">
        2. Government Reviews
      </h3>

      <p className="text-gray-500 mt-2">
        Officials verify and assign your report.
      </p>

    </CardContent>

  </Card>

  <Card>

    <CardContent className="p-8 text-center">

      <div className="text-5xl mb-4">
        📍
      </div>

      <h3 className="font-bold text-lg">
        3. Track Progress
      </h3>

      <p className="text-gray-500 mt-2">
        Receive live status updates until the issue is resolved.
      </p>

    </CardContent>

  </Card>

</div>

</section>

      {/* Government Services */}

      <section>

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Government Services
          </h2>

          <Button variant="outline" onClick={() => navigate("/services")}>
            View All
          </Button>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

          {[
            "National ID",
            "Passport",
            "Tax Payment",
            "Healthcare",
            "Education",
            "Legal Aid",
          ].map((service) => (

            <Card
              key={service}
              className="rounded-2xl hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
              onClick={() => navigate("/services")}
            >

              <CardContent className="p-6 text-center">

                <div className="text-4xl mb-3">🏛️</div>

                <h3 className="font-semibold">
                  {service}
                </h3>

              </CardContent>

            </Card>

          ))}

        </div>

      </section>

      {/* Why GovConnect */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-10">

        <h2 className="text-3xl font-bold mb-8 text-center">
          Why Choose GovConnect NG?
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          <div className="text-center">

            <div className="text-5xl mb-4">
              📍
            </div>

            <h3 className="font-bold mb-2">
              GPS Location
            </h3>

            <p className="text-gray-300">
              Every report includes precise location data.
            </p>

          </div>

          <div className="text-center">

            <div className="text-5xl mb-4">
              📷
            </div>

            <h3 className="font-bold mb-2">
              Photo Evidence
            </h3>

            <p className="text-gray-300">
              Upload images to support every complaint.
            </p>

          </div>

          <div className="text-center">

            <div className="text-5xl mb-4">
              🔔
            </div>

            <h3 className="font-bold mb-2">
              Live Tracking
            </h3>

            <p className="text-gray-300">
              Receive notifications whenever status changes.
            </p>

          </div>

          <div className="text-center">

            <div className="text-5xl mb-4">
              🤝
            </div>

            <h3 className="font-bold mb-2">
              Transparency
            </h3>

            <p className="text-gray-300">
              Citizens and government stay connected.
            </p>

          </div>

        </div>

      </section>

      {/* Footer */}

      <footer className="text-center py-10 border-t">

        <h2 className="text-2xl font-bold text-green-700">
          🇳🇬 GovConnect NG
        </h2>

        <p className="text-gray-500 mt-3">
          Connecting Citizens with Local Government.
        </p>

        <p className="text-gray-400 text-sm mt-2">
          Built for transparency, accountability and better public service.
        </p>

        <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500">

          <span>Reports</span>

          <span>Services</span>

          <span>Notifications</span>

          <span>Profile</span>

        </div>

        <p className="mt-8 text-xs text-gray-400">
          © 2026 GovConnect NG. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
};
<Button

size="lg"

className="fixed bottom-8 right-8 rounded-full shadow-2xl h-16 w-16"



>

<Plus />

</Button>
export default Home;