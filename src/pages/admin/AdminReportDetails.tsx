import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_review: "In Review",
  assigned: "Assigned",
  resolved: "Resolved",
  rejected: "Rejected",
};

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

export default function AdminReportDetails() {
  const { id } = useParams();

  const [report, setReport] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [status, setStatus] = useState("");
const [adminComment, setAdminComment] = useState("");
const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    // Load report
    const { data: reportData } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (reportData) {
      setReport(reportData);
      setStatus(reportData.status);
setAdminComment(reportData.admin_comment ?? "");
    }

    const saveUpdate = async () => {
      setSaving(true);
    
      const updates: any = {
        status,
        admin_comment: adminComment,
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
        setSaving(false);
        return;
      }
    
      await supabase
        .from("report_timeline")
        .insert({
          report_id: report.id,
          status,
          note: adminComment || `Status changed to ${status}`,
        });
    
      await supabase
        .from("notifications")
        .insert({
          user_id: report.user_id,
          report_id: report.id,
          title: "Report Status Updated",
          description: `Your report "${report.title}" is now ${status.replace("_"," ")}.`,
          type: "info",
          is_read: false,
        });
    
      alert("Report updated successfully.");
    
      await loadReport();
    
      setSaving(false);
    };

<Card className="mt-8">

<CardContent className="p-6">

<h2 className="text-2xl font-bold mb-6">
Admin Action
</h2>

<div className="space-y-5">

<div>

<label className="font-semibold">
Status
</label>

<select
  value={status}
  onChange={(e)=>setStatus(e.target.value)}
  className="w-full border rounded-lg p-3 mt-2"
>

<option value="pending">Pending</option>
<option value="in_review">In Review</option>
<option value="assigned">Assigned</option>
<option value="resolved">Resolved</option>
<option value="rejected">Rejected</option>

</select>

</div>

<div>

<label className="font-semibold">
Admin Comment
</label>

<textarea
  rows={5}
  value={adminComment}
  onChange={(e)=>setAdminComment(e.target.value)}
  className="w-full border rounded-lg p-3 mt-2"
/>

</div>

<button
  onClick={saveUpdate}
  disabled={saving}
  className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3"
>

{saving ? "Saving..." : "Save Update"}

</button>

</div>

</CardContent>

</Card>

    // Load timeline
    const { data: timelineData } = await supabase
      .from("report_timeline")
      .select("*")
      .eq("report_id", id)
      .order("created_at", { ascending: true });

    if (timelineData) {
      setTimeline(timelineData);
    }
  };

  if (!report) {
    return (
      <div className="text-center py-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <CardContent className="p-8 space-y-6">

          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-bold">{report.title}</h1>
              <p className="text-gray-500">{report.category}</p>
            </div>

            <Badge className={statusColor(report.status)}>
              {statusLabels[report.status]}
            </Badge>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

<div>

  <Badge className="mb-3 bg-green-600">
    GovConnect NG Report
  </Badge>

  <h1 className="text-4xl font-bold">
    {report.title}
  </h1>

  <p className="text-gray-500 mt-2">
    Tracking ID: <strong>{report.tracking_id}</strong>
  </p>

</div>

<div className="flex flex-col gap-2">

  <Badge className={statusColor(report.status)}>
    {statusLabels[report.status]}
  </Badge>

  <Badge variant="outline">
    Priority: {report.priority}
  </Badge>

</div>

</div>
<div className="grid md:grid-cols-2 gap-6">

<Card>

<CardContent className="p-6 space-y-3">

<h2 className="font-bold text-lg">
📍 Location Information
</h2>

<p><strong>Location:</strong> {report.location}</p>

<p><strong>LGA:</strong> {report.lga}</p>

<p><strong>State:</strong> {report.state}</p>

</CardContent>

</Card>

<Card>

<CardContent className="p-6 space-y-3">

<h2 className="font-bold text-lg">
📋 Report Details
</h2>

<p><strong>Category:</strong> {report.category}</p>

<p><strong>Priority:</strong> {report.priority}</p>

<p><strong>Status:</strong> {statusLabels[report.status]}</p>

<p>
<strong>Submitted:</strong><br/>
{new Date(report.created_at).toLocaleString()}
</p>

</CardContent>

</Card>

</div>
          

          <div>
          <h2 className="text-2xl font-bold mb-3">
📝 Incident Description
</h2><div className="bg-gray-50 rounded-xl p-5">

<p className="leading-8 text-gray-700">
{report.description}
</p>

</div>
</div>

          {report.image_urls?.length > 0 && (
            <div>
              <h2 className="font-bold mb-3">Evidence</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {report.image_urls.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt=""
                    className="rounded-xl border shadow hover:shadow-lg hover:scale-105 transition cursor-pointer object-cover h-56 w-full"
                  />
                ))}
              </div>
            </div>
          )}

          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">
📈 Activity Timeline
</h2>

              {timeline.length === 0 ? (
                <p className="text-gray-500">
                <div className="text-center py-10">

<div className="text-5xl mb-3">
📭
</div>

<p className="text-gray-500">
No updates have been recorded yet.
</p>

</div>
                </p>
              ) : (
                <div className="space-y-4">
                  {timeline.map((item) => (
                    <div
                      key={item.id}
                      className="relative pl-8 pb-8 border-l-2 border-green-300"
                    >
                      <p className="font-semibold capitalize">
                        {item.status.replace("_", " ")}
                      </p>

                      <p className="text-gray-600">
                        {item.note}
                      </p>

                      <p className="text-sm text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}