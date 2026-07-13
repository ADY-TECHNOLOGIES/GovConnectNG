import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
  loadNotifications();
}, []);

const loadNotifications = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!error && data) {
    setNotifications(data);
  }

  setLoading(false);
};

if (loading) {
  return (
    <div className="text-center py-10">
      Loading notifications...
    </div>
  );
}
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">{notifications.filter(n => !n.is_read).length} New</span>
      </div>

      <div className="space-y-4">

  {notifications.length === 0 && (
    <Card>
      <CardContent className="p-10 text-center text-gray-500">
        <Bell className="mx-auto mb-3" size={40} />
        <p>No notifications yet.</p>
      </CardContent>
    </Card>
  )}

  {notifications.map((notif) => (
    <Card
      key={notif.id}
      
      onClick={async () => {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", notif.id);
      
        loadNotifications();
      
        if (notif.report_id) {
          navigate(`/reports/${notif.report_id}`);
        }
      }}

      className={`border-none shadow-sm cursor-pointer transition
        ${
          !notif.is_read
            ? "bg-blue-50 border-l-4 border-l-blue-600"
            : "hover:bg-gray-50"
        }`}
    >
      <CardContent className="p-4 flex gap-4">

        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-100 text-blue-600 shrink-0">
          <Bell size={24} />
        </div>

        <div className="flex-1 space-y-1">

          <div className="flex justify-between">

            <h3 className="font-bold">
              {notif.title}
            </h3>

            <span className="text-xs text-gray-400">
              {new Date(notif.created_at).toLocaleString()}
            </span>

          </div>

          <p className="text-gray-600">
            {notif.description}
          </p>

        </div>

      </CardContent>
    </Card>
  ))}

</div>
    </div>
  );
};

export default Notifications;
