import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Filter,
  FileSearch,
} from "lucide-react";

import { useReports } from "@/hooks/useReports";
import ReportCard from "@/components/reports/ReportCard";
import ReportStats from "@/components/reports/ReportStats";

const Reports = () => {
  const navigate = useNavigate();

  const { reports, loading } = useReports();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const filteredReports = useMemo(() => {
    return reports.filter((report: any) => {
      const matchesSearch =
        report.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        report.location
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        report.tracking_id
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "all"
          ? true
          : report.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[350px]">
        <div className="text-center">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />

          <p className="text-gray-500">
            Loading reports...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Hero */}

      <div className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-600 text-white p-8 shadow-lg">

        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

          <div>

            <h1 className="text-4xl font-bold">
              My Reports
            </h1>

            <p className="mt-2 text-green-100">
              Track every issue you've reported to your Local Government.
            </p>

          </div>

          <Button
            size="lg"
            className="bg-white text-green-700 hover:bg-green-50"
            onClick={() => navigate("/reports/new")}
          >
            <Plus className="mr-2 h-5 w-5" />
            New Report
          </Button>

        </div>

      </div>

      {/* Statistics */}

      <ReportStats reports={reports} />

      {/* Filters */}

      <div className="bg-white rounded-2xl shadow-sm border p-5">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <Input
              className="pl-10"
              placeholder="Search by title, tracking ID or location..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="relative">

            <Filter
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="border rounded-lg pl-10 pr-4 py-2 w-full md:w-52"
            >
              <option value="all">
                All Status
              </option>

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

          </div>

        </div>

      </div>

      {/* Results */}

      {filteredReports.length === 0 ? (

        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-16 text-center">

          <FileSearch
            size={70}
            className="mx-auto text-gray-400 mb-6"
          />

          <h2 className="text-2xl font-bold">

            No reports found

          </h2>

          <p className="text-gray-500 mt-3">

            Try changing your search or create a new report.

          </p>

          <Button
            className="mt-8"
            onClick={() => navigate("/reports/new")}
          >
            <Plus className="mr-2 h-4 w-4" />

            Submit Report

          </Button>

        </div>

      ) : (

        <div className="space-y-5">

          {filteredReports.map((report: any) => (

            <ReportCard
              key={report.id}
              report={report}
            />

          ))}

        </div>

      )}

    </div>
  );
};

export default Reports;