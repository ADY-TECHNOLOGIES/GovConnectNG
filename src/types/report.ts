export type ReportStatus =
  | "Pending"
  | "Under Review"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "Closed";

export type ReportCategory =
  | "Roads"
  | "Water"
  | "Electricity"
  | "Healthcare"
  | "Education"
  | "Security"
  | "Environment"
  | "Waste"
  | "Corruption"
  | "Others";

  export interface Report {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    location: string;
    state?: string;
    lga?: string;
    priority?: string;
    tracking_id: string;
    image_urls: string[];
    created_at: string;
  }