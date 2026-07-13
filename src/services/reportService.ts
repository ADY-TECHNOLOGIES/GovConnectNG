import { supabase } from "@/integrations/supabase/client";
import { Report } from "@/types/report";

export const reportService = {

  async getReports(userId: string) {

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as Report[];
  },

  async createReport(report: Partial<Report>) {

    const { data, error } = await supabase
      .from("reports")
      .insert(report)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateStatus(id: string, status: string) {

    const { error } = await supabase
      .from("reports")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
  },

  async deleteReport(id: string) {

    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

};