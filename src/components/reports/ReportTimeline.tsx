import { CheckCircle, Clock, Eye } from "lucide-react";

interface Props {
  status: string;
  createdAt: string;
  resolvedAt?: string | null;
}

export default function ReportTimeline({
  status,
  createdAt,
  resolvedAt,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="flex items-start gap-3">
        <CheckCircle className="text-green-600" />
        <div>
          <h3 className="font-semibold">
            Report Submitted
          </h3>
          <p className="text-gray-500 text-sm">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {(status === "In Review" || status === "Resolved") && (
        <div className="flex items-start gap-3">
          <Eye className="text-blue-600" />
          <div>
            <h3 className="font-semibold">
              Under Review
            </h3>
            <p className="text-gray-500 text-sm">
              Government officials are reviewing your report.
            </p>
          </div>
        </div>
      )}

      {status === "Resolved" && (
        <div className="flex items-start gap-3">
          <Clock className="text-green-600" />
          <div>
            <h3 className="font-semibold">
              Resolved
            </h3>
            <p className="text-gray-500 text-sm">
              {resolvedAt
                ? new Date(resolvedAt).toLocaleString()
                : "Completed"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}