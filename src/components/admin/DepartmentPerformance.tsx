import { Card, CardContent } from "@/components/ui/card";

const departments = [
  { name: "Works", value: 92 },
  { name: "Environment", value: 81 },
  { name: "Security", value: 74 },
  { name: "Health", value: 89 },
  { name: "Education", value: 66 },
];

const DepartmentPerformance = () => {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">

        <h2 className="text-xl font-bold mb-6">
          Department Performance
        </h2>

        <div className="space-y-5">

          {departments.map((dept) => (

            <div key={dept.name}>

              <div className="flex justify-between mb-2">

                <span>{dept.name}</span>

                <span className="font-semibold">
                  {dept.value}%
                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-gray-200">

                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${dept.value}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </CardContent>
    </Card>
  );
};

export default DepartmentPerformance;