import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Flag } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();
  const { user, isLoading, isProfileComplete } = useAuth();

  useEffect(() => {
    if (isLoading) return;
  
    const timer = setTimeout(() => {
      if (user && isProfileComplete) {
        navigate('/home', { replace: true });
    } else if (user) {
        navigate('/complete-profile', { replace: true });
      } else {
        navigate('/welcome', { replace: true });
      }
    }, 2000);
  
    return () => clearTimeout(timer);
  }, [isLoading, user, isProfileComplete, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6"
        >
          <Flag className="text-primary" size={48} />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-white mb-2"
        >
          GovConnect NG
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white/70 text-sm"
        >
          Connecting Citizens with Government
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-12"
      >
        <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
      </motion.div>
    </div>
  );
};

export default Splash;
