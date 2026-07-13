import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExport: () => void;
}

const DashboardHeader = ({ onExport }: Props) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-5">

      <div>

        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor citizen reports across Nigeria in real-time.
        </p>

      </div>

      <Button
        onClick={onExport}
        className="bg-green-600 hover:bg-green-700"
      >
        <Download className="mr-2 h-4 w-4" />
        Export Reports
      </Button>

    </div>
  );
};

export default DashboardHeader;