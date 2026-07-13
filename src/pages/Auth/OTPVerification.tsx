import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOtp, signInWithPhone } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone') || '';

  useEffect(() => {
    if (!phone) {
      navigate('/login');
      return;
    }
  }, [phone, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }
    setLoading(true);
    const { error } = await verifyOtp(phone, token);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Phone verified successfully!');
      navigate('/');
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    const { error } = await signInWithPhone(phone);
    if (error) {
      toast.error(error);
    } else {
      toast.success('New OTP sent!');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const maskedPhone = phone.length > 4
    ? phone.slice(0, 4) + '****' + phone.slice(-2)
    : phone;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
    >
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="text-primary" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verify Your Phone</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to <strong>{maskedPhone}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  disabled={loading}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-semibold"
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              Verify & Continue
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                disabled={resendTimer > 0}
                className="text-primary font-semibold"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </Button>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-gray-500"
              >
                <ArrowLeft size={16} className="mr-2" />
                Change phone number
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OTPVerification;
