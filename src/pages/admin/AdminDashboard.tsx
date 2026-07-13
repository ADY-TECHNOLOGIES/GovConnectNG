import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import { Download } from "lucide-react";
import ReportsMap from "@/components/admin/ReportsMap";

const AdminDashboard = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [search, setSearch] = useState("");
const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    in_review: "In Review",
    assigned: "Assigned",
    resolved: "Resolved",
    rejected: "Rejected",
  };

  useEffect(() => {
    loadReports();
  
    const channel = supabase
      .channel("reports-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reports",
        },
        () => {
          loadReports();
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in_review":
        return "bg-blue-100 text-blue-700";
      case "assigned":
        return "bg-purple-100 text-purple-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  const loadReports = async () => {
    setLoading(true);
  
    const { data, error } = await supabase
      .from("reports")
      .select(`
        id,
        title,
        category,
        priority,
        location,
        lga,
        state,
        latitude,
        longitude,
        tracking_id,
        description,
        status,
        created_at,
        image_urls,
        user_id
      `)
      .order("created_at", { ascending: false });
  
    if (error) {
      console.error(error);
    } else {
      setReports(data || []);
      console.table(
        data?.map(r => ({
          title: r.title,
          lat: r.latitude,
          lng: r.longitude,
        }))
      );
    }
  
    setLoading(false);
  };

  const updateStatus = async (report: any, status: string) => {
    const updates: any = {
      status,
    };
    
    if (status === "resolved") {
      updates.resolved_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from("reports")
      .update(updates)
      .eq("id", report.id);
    
    if (error) {
      alert(error.message);
      return;
    }
  
    await supabase.from("report_timeline").insert({
      report_id: report.id,
      status,
      note: `Status changed to ${status.replace("_", " ")}`,
    });
  
    await supabase.from("notifications").insert({
      user_id: report.user_id,
      title: "Report Status Updated",
      description: `Your report "${report.title}" is now ${status.replace("_"," ")}.`,
      type: "info",
      is_read: false,
    });
    await loadReports();
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
    (report.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (report.tracking_id ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (report.location ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;
  
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  const exportCSV = () => {

    const headers = [
      "Tracking ID",
      "Title",
      "Category",
      "Priority",
      "Status",
      "Location",
      "State",
      "LGA",
      "Date Submitted",
    ];
  
    const rows = reports.map((r) => [
      r.tracking_id,
      r.title,
      r.category,
      r.priority,
      r.status,
      r.location,
      r.state,
      r.lga,
      new Date(r.created_at).toLocaleString(),
    ]);
  
    const csv =
      [
        headers.join(","),
        ...rows.map(row =>
          row.map(value => `"${value}"`).join(",")
        ),
      ].join("\n");
  
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
  
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
  
    link.href = url;
    link.download = "GovConnect_Reports.csv";
  
    link.click();
  
    URL.revokeObjectURL(url);
  
  };
  
  console.log("Reports sent to map:", reports);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
  
      <div className="flex justify-between items-center">
  
        <div>
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>
  
          <p className="text-gray-500">
            Monitor reports across Nigeria
          </p>
        </div>
  
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
        >
          <Download size={18}/>
          Export CSV
        </button>
  
      </div>

  
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

<Card>
  <CardContent className="p-6">
    <h2 className="text-gray-500">Total Reports</h2>
    <p className="text-3xl font-bold">
      {reports.length}
    </p>
  </CardContent>
</Card>

<Card>
  <CardContent className="p-6">
    <h2 className="text-gray-500">Pending</h2>
    <p className="text-3xl font-bold text-yellow-600">
      {reports.filter(r => r.status === "pending").length}
    </p>
  </CardContent>
</Card>

<Card>
  <CardContent className="p-6">
    <h2 className="text-gray-500">In Review</h2>
    <p className="text-3xl font-bold text-blue-600">
      {reports.filter(r => r.status === "in_review").length}
    </p>
  </CardContent>
</Card>

<Card>
  <CardContent className="p-6">
    <h2 className="text-gray-500">Assigned</h2>
    <p className="text-3xl font-bold text-purple-600">
      {reports.filter(r => r.status === "assigned").length}
    </p>
  </CardContent>
</Card>

<Card>
  <CardContent className="p-6">
    <h2 className="text-gray-500">Resolved</h2>
    <p className="text-3xl font-bold text-green-600">
      {reports.filter(r => r.status === "resolved").length}
    </p>
  </CardContent>
</Card>

<Card>
  <CardContent className="p-6">
    <h2 className="text-gray-500">Rejected</h2>
    <p className="text-3xl font-bold text-red-600">
      {reports.filter(r => r.status === "rejected").length}
    </p>
  </CardContent>
</Card>

</div>

<AnalyticsCharts reports={reports} />
<div className="grid md:grid-cols-3 gap-4">
  

  <Card>
    <CardContent className="p-6">
      <h2 className="text-gray-500">Resolution Rate</h2>
      <p className="text-3xl font-bold text-green-600">
        {reports.length
          ? Math.round(
              (reports.filter(r => r.status === "resolved").length /
                reports.length) *
                100
            )
          : 0}
        %
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <h2 className="text-gray-500">High Priority</h2>
      <p className="text-3xl font-bold text-red-600">
        {reports.filter(
  r => r.priority === "high" || r.priority === "critical"
).length}
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <h2 className="text-gray-500">Categories</h2>
      <p className="text-3xl font-bold text-blue-600">
        {[...new Set(reports.map(r => r.category))].length}
      </p>
    </CardContent>
  </Card>

</div>

<div className="mt-8">
  <h2 className="text-2xl font-bold mb-4">
    Reports Map
  </h2>

  <ReportsMap reports={reports} />
</div>

  
      {/* Reports */}

      
      <div className="flex flex-col md:flex-row gap-4">

  <input
    type="text"
    placeholder="Search title, tracking ID or location..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 border rounded-lg px-4 py-2"
  />

  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="border rounded-lg px-4 py-2"
  >
    <option value="all">All Status</option>
    <option value="pending">Pending</option>
    <option value="in_review">In Review</option>
    <option value="assigned">Assigned</option>
    <option value="resolved">Resolved</option>
    <option value="rejected">Rejected</option>
  </select>

</div>

{filteredReports.map((report) => (
  
  <Card
  key={report.id}
  onClick={() => navigate(`/admin/reports/${report.id}`)}
  className="cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all"
>
          <CardContent className="p-6">
  
            <div className="flex justify-between">
  
              {/* Left */}
              <div className="space-y-2">
  
                <h2 className="text-xl font-bold">
                  {report.title}
                </h2>
  
                <div className="flex gap-2 flex-wrap">
                  <Badge>{report.category}</Badge>
                  <Badge variant="secondary">
                    {report.priority}
                  </Badge>
                </div>
  
                <p>📍 {report.location}</p>
  
                <p>🏛 {report.lga}, {report.state}</p>
  
                <p className="text-gray-600">
                  {report.description}
                </p>
  
                {report.image_urls?.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {report.image_urls.map((url: string, index: number) => (
                      <img
                      onClick={(e) => e.stopPropagation()}
                        key={index}
                        src={url}
                        alt=""
                        className="w-24 h-24 rounded-lg object-cover border"
                      />
                    ))}
                  </div>
                )}
  
                <p>
                  Tracking:
                  <strong> {report.tracking_id}</strong>
                </p>
  
                <p className="text-sm text-gray-500">
                  Submitted:
                  {new Date(report.created_at).toLocaleString()}
                </p>
  
              </div>
  
              {/* Right */}
              <div className="flex flex-col items-end gap-4">
  
                <Badge className={statusColor(report.status)}>
                 {statusLabels[report.status] ?? report.status}
                </Badge>
  
                <select
  value={report.status}
  onClick={(e) => e.stopPropagation()}
  onChange={(e) => updateStatus(report, e.target.value)}
  className="border rounded-lg p-2"
>
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="assigned">Assigned</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
  
              </div>
  
            </div>
  
            </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDashboard;