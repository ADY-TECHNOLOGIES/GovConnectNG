import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { NavLink } from 'react-router-dom';
import { Home, FileText, LayoutGrid, Bell, User, Flag } from 'lucide-react';
import { Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";


const MainLayout = () => {
  const location = useLocation();
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-30">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Flag className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-primary">GovConnect NG</span>
        </div>
        <nav className="mt-8 px-4 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-semibold border-l-[3px] border-primary' 
                    : 'text-gray-600 hover:bg-gray-50 border-l-[3px] border-transparent'
                }`
              }
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;
