import { Card, CardContent } from "@/components/ui/card";
import { Report } from "@/types/report";
import {
  FileText,
  Clock,
  Loader,
  CheckCircle
} from "lucide-react";

interface Props {
  reports: Report[];
}

export default function ReportStats({ reports }: Props) {

  const total = reports.length;

  const pending = reports.filter(
    r => r.status === "Pending"
  ).length;

  const progress = reports.filter(
    r => r.status === "In Progress"
  ).length;

  const resolved = reports.filter(
    r => r.status === "Resolved"
  ).length;

  const cards = [
    {
      title: "Total",
      value: total,
      icon: FileText
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock
    },
    {
      title: "In Progress",
      value: progress,
      icon: Loader
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle
    }
  ];

  return (

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {cards.map((card) => (

        <Card key={card.title}>

          <CardContent className="p-5">

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500 text-sm">

                  {card.title}

                </p>

                <h2 className="text-3xl font-bold">

                  {card.value}

                </h2>

              </div>

              <card.icon className="text-primary"/>

            </div>

          </CardContent>

        </Card>

      ))}

    </div>

  );

}