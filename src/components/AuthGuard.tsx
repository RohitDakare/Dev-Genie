
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Redirect to dashboard after successful login
          if (location.pathname === '/login' || location.pathname === '/signup') {
            navigate('/dashboard');
          }
        } else if (event === 'SIGNED_OUT') {
          // Redirect to home after logout
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to login if auth is required but user is not logged in
        navigate('/login');
      } else if (!requireAuth && user && location.pathname === '/') {
        // Redirect logged-in users away from landing page to dashboard
        navigate('/dashboard');
      }
    }
  }, [user, loading, requireAuth, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4FC3F7]"></div>
      </div>
    );
  }

  // Don't render protected content if auth is required but user is not logged in
  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
};
