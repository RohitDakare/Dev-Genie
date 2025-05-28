
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const Layout = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF]">
      <Navigation user={user} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
