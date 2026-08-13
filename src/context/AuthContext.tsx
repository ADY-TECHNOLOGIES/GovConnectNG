import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

/* =========================================================
   USER PROFILE
========================================================= */

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

/* =========================================================
   AUTH CONTEXT TYPE
========================================================= */

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isProfileComplete: boolean;

  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;

  signInWithPhone: (
    phone: string
  ) => Promise<{ error: string | null }>;

  verifyOtp: (
    phone: string,
    token: string
  ) => Promise<{ error: string | null }>;

  signInWithGoogle: () => Promise<{
    error: string | null;
  }>;

  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null }>;

  resetPassword: (
    email: string
  ) => Promise<{ error: string | null }>;

  updatePassword: (
    newPassword: string
  ) => Promise<{ error: string | null }>;

  completeProfile: (data: {
    full_name: string;
    phone?: string;
    state?: string;
    lga?: string;
  }) => Promise<{ error: string | null }>;

  updateAvatar: (
    file: File
  ) => Promise<{ error: string | null }>;

  logout: () => Promise<void>;
}

/* =========================================================
   CONTEXT
========================================================= */

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

/* =========================================================
   AUTH PROVIDER
========================================================= */

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [session, setSession] =
    useState<Session | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isProfileComplete, setIsProfileComplete] =
    useState(false);

  /*
   * Prevent state updates after component unmounts.
   */
  const mountedRef = useRef(true);

  /*
   * Prevent duplicate profile requests for the same user.
   */
  const profileRequestRef =
    useRef<string | null>(null);

  /* =========================================================
     FETCH USER PROFILE
  ========================================================= */

  const fetchProfile = useCallback(
    async (userId: string) => {
      if (!userId) {
        return null;
      }

      console.log(
        "FETCHING USER PROFILE:",
        userId
      );

      try {
        const {
          data,
          error,
        } = await supabase
          .from("users")
          .select(
            `
              id,
              email,
              full_name,
              phone,
              avatar_url,
              role,
              is_verified,
              state,
              lga,
              created_at
            `
          )
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error(
            "PROFILE FETCH ERROR:",
            error
          );

          if (mountedRef.current) {
            setUser(null);
            setIsProfileComplete(false);
          }

          return null;
        }

        if (!data) {
          console.warn(
            "NO USER PROFILE FOUND:",
            userId
          );

          if (mountedRef.current) {
            setUser(null);
            setIsProfileComplete(false);
          }

          return null;
        }

        const profile: UserProfile = {
          id: data.id,
          email: data.email ?? "",
          full_name: data.full_name ?? "",
          phone: data.phone ?? null,
          avatar_url: data.avatar_url ?? null,
          role: data.role ?? "citizen",
          is_verified:
            data.is_verified ?? false,
          state: data.state ?? null,
          lga: data.lga ?? null,
          created_at:
            data.created_at ?? "",
        };

        console.log(
          "PROFILE LOADED:",
          profile
        );

        if (mountedRef.current) {
          setUser(profile);

          /*
           * Profile is considered complete when:
           *
           * 1. Full name exists
           * 2. Full name isn't simply the email username
           */
          const emailUsername =
            splitPartFallback(profile.email);

          const complete =
            Boolean(
              profile.full_name?.trim()
            ) &&
            profile.full_name.trim() !==
              emailUsername;

          setIsProfileComplete(complete);
        }

        return profile;
      } catch (error) {
        console.error(
          "FETCH PROFILE EXCEPTION:",
          error
        );

        if (mountedRef.current) {
          setUser(null);
          setIsProfileComplete(false);
        }

        return null;
      }
    },
    []
  );

  /* =========================================================
     LOAD PROFILE SAFELY
  ========================================================= */

  const loadProfile = useCallback(
    async (session: Session | null) => {
      if (!session?.user) {
        if (mountedRef.current) {
          setUser(null);
          setIsProfileComplete(false);
        }

        return;
      }

      const userId = session.user.id;

      /*
       * Avoid duplicate simultaneous requests.
       */
      if (
        profileRequestRef.current === userId
      ) {
        return;
      }

      profileRequestRef.current = userId;

      try {
        await fetchProfile(userId);
      } finally {
        if (
          profileRequestRef.current ===
          userId
        ) {
          profileRequestRef.current = null;
        }
      }
    },
    [fetchProfile]
  );

  /* =========================================================
     INITIALIZE AUTH
  ========================================================= */

  useEffect(() => {
    mountedRef.current = true;

    console.log(
      "INITIALIZING AUTH..."
    );

    /*
     * IMPORTANT:
     *
     * We intentionally use onAuthStateChange()
     * as the single source of truth.
     *
     * Supabase sends INITIAL_SESSION when
     * the subscription is created.
     *
     * This avoids:
     *
     * getSession()
     * +
     * INITIAL_SESSION
     *
     * both fetching the profile.
     */

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          console.log(
            "AUTH EVENT:",
            event
          );

          if (!mountedRef.current) {
            return;
          }

          setSession(currentSession);

          /*
           * Do not perform Supabase queries
           * directly inside the auth callback.
           *
           * Schedule profile loading after
           * the callback has returned.
           */
          setTimeout(() => {
            if (!mountedRef.current) {
              return;
            }

            if (currentSession?.user) {
              loadProfile(
                currentSession
              ).finally(() => {
                if (
                  mountedRef.current
                ) {
                  setIsLoading(false);
                }
              });
            } else {
              setUser(null);
              setIsProfileComplete(
                false
              );
              setIsLoading(false);
            }
          }, 0);
        }
      );

    return () => {
      console.log(
        "AUTH PROVIDER CLEANUP"
      );

      mountedRef.current = false;

      subscription.unsubscribe();
    };
  }, [loadProfile]);

  /* =========================================================
     SIGN IN WITH EMAIL
  ========================================================= */

  const signInWithEmail = async (
    email: string,
    password: string
  ) => {
    try {
      const {
        error,
      } =
        await supabase.auth.signInWithPassword(
          {
            email: email.trim(),
            password,
          }
        );

      if (error) {
        console.error(
          "EMAIL LOGIN ERROR:",
          error
        );

        return {
          error: friendlyError(
            error.message
          ),
        };
      }

      return {
        error: null,
      };
    } catch (error) {
      console.error(
        "EMAIL LOGIN EXCEPTION:",
        error
      );

      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to sign in. Please try again.",
      };
    }
  };

  /* =========================================================
     SIGN IN WITH PHONE
  ========================================================= */

  const signInWithPhone = async (
    phone: string
  ) => {
    try {
      const {
        error,
      } =
        await supabase.auth.signInWithOtp({
          phone: phone.trim(),
          options: {
            channel: "sms",
          },
        });

      if (error) {
        return {
          error: friendlyError(
            error.message
          ),
        };
      }

      return {
        error: null,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send verification code.",
      };
    }
  };

  /* =========================================================
     VERIFY OTP
  ========================================================= */

  const verifyOtp = async (
    phone: string,
    token: string
  ) => {
    try {
      const {
        error,
      } =
        await supabase.auth.verifyOtp({
          phone: phone.trim(),
          token: token.trim(),
          type: "sms",
        });

      if (error) {
        return {
          error: friendlyError(
            error.message
          ),
        };
      }

      return {
        error: null,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify the code.",
      };
    }
  };

  /* =========================================================
     GOOGLE SIGN IN
  ========================================================= */

  const signInWithGoogle = async () => {
    try {
      const {
        error,
      } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo:
              `${window.location.origin}/login`,
          },
        });

      if (error) {
        console.error(
          "GOOGLE OAUTH ERROR:",
          error
        );

        return {
          error: friendlyError(
            error.message
          ),
        };
      }

      return {
        error: null,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to sign in with Google.",
      };
    }
  };

  /* =========================================================
     SIGN UP
  ========================================================= */

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      const {
        error,
      } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name:
                fullName.trim(),
              name: fullName.trim(),
            },
          },
        });

      if (error) {
        return {
          error: friendlyError(
            error.message
          ),
        };
      }

      return {
        error: null,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create account.",
      };
    }
  };

  /* =========================================================
     RESET PASSWORD
  ========================================================= */

  const resetPassword = async (
    email: string
  ) => {
    try {
      const {
        error,
      } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo:
              `${window.location.origin}/reset-password`,
          }
        );

      if (error) {
        return {
          error: friendlyError(
            error.message
          ),
        };
      }

      return {
        error: null,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send password reset email.",
      };
    }
  };

  /* =========================================================
     UPDATE PASSWORD
  ========================================================= */

  const updatePassword = async (
    newPassword: string
  ) => {
    try {
      const {
        error,
      } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (error) {
        return {
          error: friendlyError(
            error.message
          ),
        };
      }

      return {
        error: null,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update password.",
      };
    }
  };

  /* =========================================================
     COMPLETE / UPDATE PROFILE
  ========================================================= */

  const completeProfile = async (data: {
    full_name: string;
    phone?: string;
    state?: string;
    lga?: string;
  }) => {
    if (!user) {
      return {
        error: "Not authenticated",
      };
    }

    try {
      const updateData = {
        full_name:
          data.full_name.trim(),

        phone:
          data.phone?.trim() || null,

        state:
          data.state?.trim() || null,

        lga:
          data.lga?.trim() || null,
      };

      const {
        error,
      } =
        await supabase
          .from("users")
          .update(updateData)
          .eq("id", user.id);

      if (error) {
        console.error(
          "PROFILE UPDATE ERROR:",
          error
        );

        return {
          error: friendlyError(
            error.message
          ),
        };
      }

      await fetchProfile(user.id);

      return {
        error: null,
      };
    } catch (error) {
      console.error(
        "PROFILE UPDATE EXCEPTION:",
        error
      );

      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update profile. Please try again.",
      };
    }
  };

  /* =========================================================
     UPDATE AVATAR
  ========================================================= */

  const updateAvatar = async (
    file: File
  ) => {
    if (!user) {
      return {
        error: "Not authenticated",
      };
    }

    try {
      /* Validate image */

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        return {
          error:
            "Please select a valid image file.",
        };
      }

      /* Maximum 5 MB */

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        return {
          error:
            "Image size must be less than 5MB.",
        };
      }

      /* Get extension */

      const fileExt =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      /*
       * Store avatar under the user's ID.
       */
      const filePath =
        `${user.id}/avatar.${fileExt}`;

      console.log(
        "Uploading avatar:",
        filePath
      );

      /* Upload */

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from("avatars")
          .upload(
            filePath,
            file,
            {
              cacheControl:
                "3600",
              upsert: true,
              contentType:
                file.type,
            }
          );

      if (uploadError) {
        console.error(
          "AVATAR UPLOAD ERROR:",
          uploadError
        );

        return {
          error: friendlyError(
            uploadError.message
          ),
        };
      }

      console.log(
        "Avatar uploaded successfully."
      );

      /* Get public URL */

      const {
        data: {
          publicUrl,
        },
      } =
        supabase.storage
          .from("avatars")
          .getPublicUrl(
            filePath
          );

      /*
       * Cache busting.
       */
      const avatarUrl =
        `${publicUrl}?t=${Date.now()}`;

      console.log(
        "Avatar public URL:",
        avatarUrl
      );

      /* Save URL */

      const {
        error: updateError,
      } =
        await supabase
          .from("users")
          .update({
            avatar_url:
              avatarUrl,
          })
          .eq("id", user.id);

      if (updateError) {
        console.error(
          "AVATAR DATABASE UPDATE ERROR:",
          updateError
        );

        return {
          error: friendlyError(
            updateError.message
          ),
        };
      }

      /*
       * Update local state immediately.
       */
      setUser(
        (currentUser) => {
          if (!currentUser) {
            return currentUser;
          }

          return {
            ...currentUser,
            avatar_url:
              avatarUrl,
          };
        }
      );

      /*
       * Refresh from database.
       */
      await fetchProfile(
        user.id
      );

      console.log(
        "AVATAR UPDATED SUCCESSFULLY"
      );

      return {
        error: null,
      };
    } catch (error) {
      console.error(
        "AVATAR UPDATE EXCEPTION:",
        error
      );

      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update profile picture.",
      };
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = async () => {
    try {
      const {
        error,
      } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "LOGOUT ERROR:",
          error
        );
      }
    } finally {
      if (mountedRef.current) {
        setUser(null);
        setSession(null);
        setIsProfileComplete(
          false
        );
        setIsLoading(false);
      }
    }
  };

  /* =========================================================
     PROVIDER
  ========================================================= */

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
        updateAvatar,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================================================
   USE AUTH
========================================================= */

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};

/* =========================================================
   PROFILE COMPLETION HELPER
========================================================= */

function splitPartFallback(
  email: string
): string {
  return email
    .split("@")[0]
    .trim();
}

/* =========================================================
   FRIENDLY ERROR
========================================================= */

function friendlyError(
  msg: string
): string {
  const lower =
    msg.toLowerCase();

  if (
    lower.includes(
      "invalid login credentials"
    )
  ) {
    return "Invalid email or password. Please try again.";
  }

  if (
    lower.includes(
      "email not confirmed"
    )
  ) {
    return "Please verify your email before signing in.";
  }

  if (
    lower.includes(
      "user not found"
    )
  ) {
    return "No account found with these credentials.";
  }

  if (
    lower.includes(
      "password"
    )
  ) {
    return "Password must be at least 6 characters.";
  }

  if (
    lower.includes(
      "rate limit"
    )
  ) {
    return "Too many attempts. Please wait a moment.";
  }

  if (
    lower.includes("otp")
  ) {
    return "Invalid or expired verification code.";
  }

  if (
    lower.includes(
      "row-level security"
    )
  ) {
    return "You do not have permission to perform this action.";
  }

  if (
    lower.includes(
      "not authenticated"
    )
  ) {
    return "Your session has expired. Please sign in again.";
  }

  return msg;
}