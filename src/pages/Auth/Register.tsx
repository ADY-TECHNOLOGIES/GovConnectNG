import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Flag, Mail, User, Lock, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Phone } from "lucide-react";


const Register = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const { error } = await signUpWithEmail(email, password, fullName);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success(
        "Account created successfully! Please verify your email to activate your GovConnect NG account."
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b
from-green-50
via-white
to-white p-4"
    >
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/login')} className="rounded-full">
              <ArrowLeft size={28} />
            </Button>
            <span className="text-sm text-gray-500">Back to Login</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
              <Flag className="text-white" size={28} />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>Create your citizen account to report community issues, track government responses, and access public services.</CardDescription>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
  <p className="text-green-700 text-sm">
    🇳🇬 Join thousands of citizens helping improve communities across Nigeria.
  </p>
</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="reg-name"
                  placeholder="John Doe"
                  className="pl-10 h-12"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
  <Label htmlFor="reg-phone">Phone Number</Label>

  <div className="relative">
    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

    <Input
      id="reg-phone"
      placeholder="+2348012345678"
      className="pl-10 h-12"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      disabled={loading}
    />
  </div>
</div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  className="pl-10 pr-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-confirm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="reg-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="pl-10 h-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="mt-2">
  <div className="h-2 rounded bg-gray-200 overflow-hidden">
    <div
      className={`h-full transition-all ${
        password.length < 6
          ? "w-1/3 bg-red-500"
          : password.length < 10
          ? "w-2/3 bg-yellow-500"
          : "w-full bg-green-600"
      }`}
    />
  </div>

  <p className="text-xs mt-1 text-gray-500">
    {password.length < 6
      ? "Weak Password"
      : password.length < 10
      ? "Medium Password"
      : "Strong Password"}
  </p>
</div>
<div className="flex items-start gap-2 text-sm">
  <input type="checkbox" required className="mt-1" />

  <p className="text-gray-500">
    I agree to the
    <span className="text-primary font-semibold">
      {" "}Terms of Service
    </span>
    {" "}and{" "}
    <span className="text-primary font-semibold">
      Privacy Policy
    </span>
  </p>
</div>
<button
    type="button"
    onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
    }
    className="absolute right-3 top-3 text-gray-400"
>
    {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
</button>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-semibold mt-4"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-50 mt-4 pt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Register;
