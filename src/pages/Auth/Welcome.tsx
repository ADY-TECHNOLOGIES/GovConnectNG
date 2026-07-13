import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Flag, ArrowRight, Shield, FileText, Bell } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Report Community Issues",
      desc: "Roads, drainage, electricity, crime and more."
    },
    {
      icon: Shield,
      title: "Secure Citizen Account",
      desc: "Verified users help improve accountability."
    },
    {
      icon: Bell,
      title: "Real-Time Updates",
      desc: "Receive notifications as your report progresses."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-white to-white">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20 mb-8"
        >
          <Flag className="text-white" size={40} />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-900 mb-3"
        >
          <div className="mb-4">
    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
        GovConnect NG • Smart Citizen Platform
    </span>
</div>
         Connecting Citizens with Government
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-500 text-center max-w-sm mb-10"
        >
          Report road damage, insecurity, corruption, blocked drainage and other community issues. Track government response in real time and help build a better Nigeria.
        </motion.p>

        {/* Feature Cards */}
        <div className="w-full max-w-sm space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <feature.icon className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-8">
    <div className="bg-gray-50 rounded-xl p-4 text-center">
        <h2 className="text-2xl font-bold text-primary">24/7</h2>
        <p className="text-xs text-gray-500">Available</p>
    </div>

    <div className="bg-gray-50 rounded-xl p-4 text-center">
        <h2 className="text-2xl font-bold text-primary">36</h2>
        <p className="text-xs text-gray-500">States</p>
    </div>

    <div className="bg-gray-50 rounded-xl p-4 text-center">
        <h2 className="text-2xl font-bold text-primary">100%</h2>
        <p className="text-xs text-gray-500">Digital</p>
    </div>
</div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="px-6 pb-10 space-y-3"
      >
        <Button
          onClick={() => navigate('/register')}
          className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl font-semibold text-base shadow-lg shadow-primary/20"
        >
          Create Free Account
          <ArrowRight size={20} className="ml-2" />
        </Button>
        <Button
          onClick={() => navigate('/login')}
          variant="ghost"
          className="w-full h-14 rounded-2xl text-gray-600 font-medium text-base"
        >
          Sign In
        </Button>
      </motion.div>
      
      <div className="text-center pb-6 text-gray-400 text-xs">
  GovConnect NG © 2026
  <br />
  Empowering Citizens Through Transparency
</div>
    </div>
  );
};

export default Welcome;
