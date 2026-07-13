import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  reports: any[];
  updateStatus: (
    report: any,
    status: string,
    adminComment?: string
  ) => void;
  statusColor: (status: string) => string;
  statusLabels: Record<string, string>;
}

const ReportsList = ({
  reports,
  updateStatus,
  statusColor,
  statusLabels,
}: Props) => {
  const navigate = useNavigate();

  if (!reports.length) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Reports Found
          </h2>

          <p className="text-gray-500 mt-2">
            There are currently no reports.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {reports.map((report) => (
        <Card
          key={report.id}
          className="hover:shadow-xl transition cursor-pointer"
          onClick={() => navigate(`/admin/reports/${report.id}`)}
        >
          <CardContent className="p-6">

            <div className="flex flex-col lg:flex-row justify-between gap-6">

              {/* LEFT SIDE */}

              <div className="flex-1">

                <h2 className="text-2xl font-bold">
                  {report.title}
                </h2>

                <div className="flex flex-wrap gap-2 mt-2">

                  <Badge>
                    {report.category}
                  </Badge>

                  <Badge variant="secondary">
                    {report.priority}
                  </Badge>

                </div>

                <div className="mt-4 space-y-2 text-gray-700">

                  <p>
                    📍 <strong>Location:</strong>{" "}
                    {report.location || "N/A"}
                  </p>

                  <p>
                    🏛 <strong>LGA:</strong>{" "}
                    {report.lga || "N/A"}
                  </p>

                  <p>
                    🌍 <strong>State:</strong>{" "}
                    {report.state || "N/A"}
                  </p>

                  <p>
                    🎫 <strong>Tracking ID:</strong>{" "}
                    {report.tracking_id || "N/A"}
                  </p>

                  <p>
                    🕒{" "}
                    {new Date(report.created_at).toLocaleString()}
                  </p>

                </div>

                <p className="mt-4 text-gray-600 whitespace-pre-wrap">
                  {report.description}
                </p>

                {report.image_urls &&
                  report.image_urls.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-5">

                      {report.image_urls.map(
                        (url: string, index: number) => (
                          <img
                            key={index}
                            src={url}
                            alt=""
                            onClick={(e) => e.stopPropagation()}
                            className="w-28 h-28 object-cover rounded-xl border"
                          />
                        )
                      )}

                    </div>
                  )}

              </div>

              {/* RIGHT SIDE */}

              <div className="flex flex-col gap-4 min-w-[220px]">

                <Badge
                  className={`${statusColor(
                    report.status
                  )} text-center justify-center py-2`}
                >
                  {statusLabels[report.status]}
                </Badge>

                <select
                  value={report.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    updateStatus(report, e.target.value)
                  }
                  className="border rounded-lg p-3"
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="in_review">
                    In Review
                  </option>

                  <option value="assigned">
                    Assigned
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                </select>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/reports/${report.id}`);
                  }}
                  className="bg-green-600 text-white rounded-lg py-3 hover:bg-green-700"
                >
                  View Details
                </button>

              </div>

            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportsList;