import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "student" | "admin";
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // We use setTimeout to prevent potential auth deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      // For now, we'll assign student as default role
      // In a real app, you would store and fetch actual roles
      setProfile({
        ...data,
        role: "student" // Default role
      });
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
        toast({
          title: "Google Sign In Failed",
          description: error.message || "Unable to sign in with Google. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      
      // If no redirected session, show a message
      if (!data.url) {
        toast({
          title: "Authentication Error",
          description: "There was a problem with Google authentication. Please check your Supabase configuration.",
          variant: "destructive",
        });
      } else {
        // Let the user know they're being redirected
        toast({
          title: "Redirecting to Google...",
          description: "You will be redirected to Google for authentication.",
        });
        
        // Add a small delay before redirecting to ensure toast is shown
        setTimeout(() => {
          window.location.href = data.url;
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        console.error("GitHub sign in error:", error);
        toast({
          title: "GitHub Sign In Failed",
          description: error.message || "Unable to sign in with GitHub. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      
      // If no redirected session, show a message
      if (!data.url) {
        toast({
          title: "Authentication Error",
          description: "There was a problem with GitHub authentication. Please check your Supabase configuration.",
          variant: "destructive",
        });
      } else {
        // Let the user know they're being redirected
        toast({
          title: "Redirecting to GitHub...",
          description: "You will be redirected to GitHub for authentication.",
        });
        
        // Add a small delay before redirecting to ensure toast is shown
        setTimeout(() => {
          window.location.href = data.url;
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid email or password.",
          variant: "destructive",
        });
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message || "Unable to create account.",
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Signup Successful",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Logout Failed",
          description: error.message || "Unable to log out.",
          variant: "destructive",
        });
      }
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const isAdmin = () => profile?.role === "admin";

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signInWithPassword,
    signUp,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
