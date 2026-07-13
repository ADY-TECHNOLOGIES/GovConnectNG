import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface Props {
  reports: any[];
}

const StatsCards = ({ reports }: Props) => {

  const total = reports.length;

  const pending = reports.filter(
    r => r.status === "pending"
  ).length;

  const review = reports.filter(
    r => r.status === "in_review"
  ).length;

  const assigned = reports.filter(
    r => r.status === "assigned"
  ).length;

  const resolved = reports.filter(
    r => r.status === "resolved"
  ).length;

  const rejected = reports.filter(
    r => r.status === "rejected"
  ).length;

  const cards = [
    {
      title: "Total Reports",
      value: total,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "In Review",
      value: review,
      icon: Eye,
      color: "text-indigo-600",
    },
    {
      title: "Assigned",
      value: assigned,
      icon: AlertTriangle,
      color: "text-purple-600",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  return (

    <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">

      {cards.map(card => {

        const Icon = card.icon;

        return (

          <Card
            key={card.title}
            className="hover:shadow-xl transition-all duration-300 rounded-2xl"
          >

            <CardContent className="p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {card.value}
                  </h2>

                </div>

                <Icon
                  className={card.color}
                  size={34}
                />

              </div>

            </CardContent>

          </Card>

        );

      })}

    </div>

  );

};

export default StatsCards;