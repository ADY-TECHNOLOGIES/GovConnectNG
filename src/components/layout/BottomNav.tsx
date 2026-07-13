import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  FileText,
  LayoutGrid,
  Bell,
  User,
  Shield,
} from "lucide-react";
import { useLocation } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useAuth();

  const navItems = [
    { label: "Home", icon: Home, path: "/home" },
    { label: "Reports", icon: FileText, path: "/reports" },
    { label: "Services", icon: LayoutGrid, path: "/services" },
    { label: "Notifications", icon: Bell, path: "/notifications" },
    { label: "Profile", icon: User, path: "/profile" },
  
    ...(user?.role === "admin"
      ? [{ label: "Admin", icon: Shield, path: "/admin" }]
      : []),
  ];

  useEffect(() => {
    const idx = navItems.findIndex(item => item.path === location.pathname);
    if (idx !== -1) setActiveIndex(idx);
  }, [location.pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-2 py-1 z-50 md:hidden safe-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto relative">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className="flex flex-col items-center justify-center w-full h-full relative group"
          >
            {({ isActive }) => (
              <>
                <div className={`absolute -top-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all duration-300 ${isActive ? 'w-8' : 'w-0'}`} />
                <item.icon size={22} className={`mb-0.5 transition-all duration-200 ${isActive ? 'text-primary scale-110' : 'text-gray-400 group-active:scale-95'}`} />
                <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-400'}`}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
