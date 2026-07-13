import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  is_verified: boolean;
  state: string | null;
  lga: string | null;
  created_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isProfileComplete: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: string | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  completeProfile: (data: { full_name: string; phone?: string; state?: string; lga?: string }) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        const profile: UserProfile = {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          avatar_url: data.avatar_url,
          role: data.role,
          is_verified: data.is_verified,
          state: data.state,
          lga: data.lga,
          created_at: data.created_at,
        };
      
        setUser(profile);
      
        setIsProfileComplete(
          !!data.full_name &&
          data.full_name !== split_part_fallback(data.email)
        );
      }
      
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setIsProfileComplete(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: friendlyError(error.message) };
    return { error: null };
  };

  const signInWithPhone = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: 'sms' },
    });
    if (error) return { error: friendlyError(error.message) };
    return { error: null };
  };

  const verifyOtp = async (phone: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    if (error) return { error: friendlyError(error.message) };
    return { error: null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) return { error: friendlyError(error.message) };
    return { error: null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, name: fullName } },
    });
    if (error) return { error: friendlyError(error.message) };
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: friendlyError(error.message) };
    return { error: null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: friendlyError(error.message) };
    return { error: null };
  };

  const completeProfile = async (data: { full_name: string; phone?: string; state?: string; lga?: string }) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('users')
      .update({
        full_name: data.full_name,
        phone: data.phone || null,
        state: data.state || null,
        lga: data.lga || null,
      })
      .eq('id', user.id);
    if (error) return { error: friendlyError(error.message) };
    await fetchProfile(user.id);
    setIsProfileComplete(true);
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsProfileComplete(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isProfileComplete,
        signInWithEmail,
        signInWithPhone,
        verifyOtp,
        signInWithGoogle,
        signUpWithEmail,
        resetPassword,
        updatePassword,
        completeProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function split_part_fallback(email: string): string {
  return email.split('@')[0];
}

function friendlyError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('invalid login credentials')) return 'Invalid email or password. Please try again.';
  if (lower.includes('email not confirmed')) return 'Please verify your email before signing in.';
  if (lower.includes('user not found')) return 'No account found with these credentials.';
  if (lower.includes('password')) return 'Password must be at least 6 characters.';
  if (lower.includes('rate limit')) return 'Too many attempts. Please wait a moment.';
  if (lower.includes('otp')) return 'Invalid or expired verification code.';
  return msg;
}
