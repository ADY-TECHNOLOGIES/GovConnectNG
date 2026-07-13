import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Props = {
  reports: any[];
};

const COLORS = [
  "#eab308",
  "#3b82f6",
  "#8b5cf6",
  "#22c55e",
  "#ef4444",
];

export default function AnalyticsCharts({ reports }: Props) {
  const statusData = [
    {
      name: "Pending",
      value: reports.filter((r) => r.status === "pending").length,
    },
    {
      name: "Review",
      value: reports.filter((r) => r.status === "in_review").length,
    },
    {
      name: "Assigned",
      value: reports.filter((r) => r.status === "assigned").length,
    },
    {
      name: "Resolved",
      value: reports.filter((r) => r.status === "resolved").length,
    },
    {
      name: "Rejected",
      value: reports.filter((r) => r.status === "rejected").length,
    },
  ];

  const categoryMap: Record<string, number> = {};

  reports.forEach((r) => {
    categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-bold mb-4">
          Reports by Status
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="value">
              {statusData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>

      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-bold mb-4">
          Reports by Category
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>

            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {categoryData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}