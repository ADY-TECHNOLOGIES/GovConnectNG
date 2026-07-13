import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Report } from "@/types/report";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Tag } from "lucide-react";

interface Props {
  report: Report;
}

export default function ReportCard({ report }: Props) {
  const navigate = useNavigate();

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    in_review: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const priorityColor: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    in_review: "In Review",
    assigned: "Assigned",
    resolved: "Resolved",
    rejected: "Rejected",
  };

  return (
    <Card
      onClick={() => navigate(`/reports/${report.id}`)}
      className="rounded-2xl shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">
              {report.title}
            </h3>

            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
              <MapPin size={14} />
              {report.location}
            </div>
          </div>

          <Badge
  className={statusColor[report.status] || ""}
>
  {statusLabels[report.status] ?? report.status}
</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Tag size={14} />
          <span className="capitalize">
            {report.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
        <Badge className={priorityColor[report.priority]}>
  {report.priority}
</Badge>
</div>

        <p className="text-sm text-gray-700 line-clamp-3">
          {report.description}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {new Date(report.created_at).toLocaleDateString()}
          </span>

          <span className="font-medium">
            {report.tracking_id}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}