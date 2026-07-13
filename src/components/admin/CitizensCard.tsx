import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const CitizensCard = () => {

  const [count, setCount] = useState(0);

  useEffect(() => {

    load();

  }, []);

  const load = async () => {

    const { count } = await supabase
      .from("users")
      .select("*", {
        count: "exact",
        head: true,
      });

    setCount(count || 0);

  };

  return (

    <Card className="rounded-2xl">

      <CardContent className="p-6">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-gray-500">
              Registered Citizens
            </p>

            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {count}
            </h2>

          </div>

          <Users
            className="text-blue-600"
            size={42}
          />

        </div>

      </CardContent>

    </Card>

  );

};

export default CitizensCard;