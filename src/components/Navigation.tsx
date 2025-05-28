
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  Settings, 
  BookOpen, 
  Star, 
  FileText, 
  Lightbulb,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface NavigationProps {
  user?: any;
}

export const Navigation = ({ user }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: User,
      description: "Your project overview"
    },
    {
      title: "Project Advisor", 
      href: "/project-advisor",
      icon: Sparkles,
      description: "AI-powered project suggestions"
    },
    {
      title: "Project Ideas",
      href: "/project-recommendations", 
      icon: Lightbulb,
      description: "Browse curated projects"
    },
    {
      title: "Documentation",
      href: "/documentation",
      icon: FileText,
      description: "Generate project docs"
    },
    {
      title: "Resources",
      href: "/resources",
      icon: BookOpen,
      description: "Learning materials"
    },
    {
      title: "Saved Projects",
      href: "/saved-projects",
      icon: Star,
      description: "Your saved projects"
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Account preferences"
    }
  ];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive"
      });
    }
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-[#E0E0E0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-[#4FC3F7]" />
            <span className="text-2xl font-bold text-[#212121]">Dev Genie</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`text-sm ${
                      isActive(item.href)
                        ? "bg-[#4FC3F7] text-white"
                        : "text-[#616161] hover:text-[#212121] hover:bg-[#F5F5F5]"
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <span className="text-sm text-[#616161]">
                    Welcome, {user.email?.split('@')[0]}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
                
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-[#616161] hover:text-[#212121]">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#4FC3F7] hover:bg-[#29B6F6] text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {user && isMenuOpen && (
        <div className="lg:hidden border-t border-[#E0E0E0]">
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                <Card className={`cursor-pointer transition-colors ${
                  isActive(item.href) ? "bg-[#E3F2FD] border-[#4FC3F7]" : "hover:bg-[#F5F5F5]"
                }`}>
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-5 h-5 ${
                        isActive(item.href) ? "text-[#4FC3F7]" : "text-[#616161]"
                      }`} />
                      <div>
                        <h3 className={`font-medium ${
                          isActive(item.href) ? "text-[#4FC3F7]" : "text-[#212121]"
                        }`}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#616161]">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-[#E0E0E0]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#616161]">
                  {user.email?.split('@')[0]}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
