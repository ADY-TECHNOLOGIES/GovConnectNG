import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  reports: any[];
}

const EmergencyAlerts = ({ reports }: Props) => {

  const critical = reports.filter(
    r => r.priority === "critical"
  );

  return (

    <Card className="border-red-200 bg-red-50 rounded-2xl">

      <CardContent className="p-6">

        <h2 className="text-xl font-bold text-red-700 mb-5">
          🚨 Emergency Alerts
        </h2>

        {critical.length === 0 ? (

          <p className="text-gray-500">
            No emergency reports.
          </p>

        ) : (

          <div className="space-y-3">

            {critical.slice(0,5).map(report => (

              <div
                key={report.id}
                className="flex justify-between items-center bg-white rounded-xl p-4"
              >

                <div>

                  <p className="font-semibold">
                    {report.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    {report.location}
                  </p>

                </div>

                <Badge className="bg-red-600">
                  Critical
                </Badge>

              </div>

            ))}

          </div>

        )}

      </CardContent>

    </Card>

  );

};

export default EmergencyAlerts;