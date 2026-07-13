export const exportReportsCSV = (reports: any[]) => {

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
  
    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((v) => `"${v}"`).join(",")),
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