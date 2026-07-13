import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ReportTimeline from "@/components/reports/ReportTimeline";

const ReportDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
const [loading, setLoading] = useState(true);
useEffect(() => {
    loadReport();
  }, []);
  
  const loadReport = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();
  
    if (!error) {
      setReport(data);
    }
  
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        Loading report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">
          Report not found
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="rounded-2xl shadow-md">
  <CardContent className="p-6 space-y-6">

    <div className="flex justify-between items-start">

      <div>

        <h1 className="text-3xl font-bold">

          {report.title}

        </h1>

        <p className="text-gray-500 mt-2">

          Tracking ID #{report.id}

        </p>

      </div>

      <Badge>

        {report.status}

      </Badge>

    </div>

    <div className="grid md:grid-cols-2 gap-6">

      <div className="flex items-center gap-3">

        <Tag className="text-primary"/>

        <div>

          <p className="text-sm text-gray-500">

            Category

          </p>

          <p>{report.category}</p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        <MapPin className="text-primary"/>

        <div>

          <p className="text-sm text-gray-500">

            Location

          </p>

          <p>{report.location}</p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        <Calendar className="text-primary"/>

        <div>

          <p className="text-sm text-gray-500">

            Submitted

          </p>

          <p>

            {new Date(report.created_at).toLocaleString()}

          </p>

        </div>

      </div>

    </div>

    <div>
  <h2 className="font-semibold">Description</h2>
  <p>{report.description}</p>
</div>

<div className="mt-10">
  <ReportTimeline
    status={report.status}
    createdAt={report.created_at}
    resolvedAt={report.resolved_at}
  />
</div>

  </CardContent>
</Card>
    </div>
  );
};

export default ReportDetails;