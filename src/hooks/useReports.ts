import { useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
import { Report } from "@/types/report";
import { useAuth } from "@/context/AuthContext";

export function useReports() {

  const { user } = useAuth();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {

    if (!user) return;

    setLoading(true);

    try {

      const data = await reportService.getReports(user.id);

      setReports(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadReports();

  }, [user]);

  return {

    reports,

    loading,

    refreshReports: loadReports

  };

}