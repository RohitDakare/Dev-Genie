
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in to Dev Genie.",
        });
        // Navigation will be handled by AuthGuard
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80" 
              alt="Student working on laptop"
              className="rounded-2xl shadow-2xl mx-auto max-w-lg w-full"
            />
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-[#212121]">Welcome back to Dev Genie!</h2>
              <p className="text-lg text-[#616161] max-w-md mx-auto">
                Continue your development journey with personalized AI guidance and project recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-8 h-8 text-[#4FC3F7]" />
                <span className="text-2xl font-bold text-[#212121]">Dev Genie</span>
              </div>
              <CardTitle className="text-2xl text-[#212121]">Sign In</CardTitle>
              <p className="text-[#616161]">Enter your credentials to access your account</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#212121] font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-[#E0E0E0] focus:border-[#4FC3F7] focus:ring-[#4FC3F7]/20"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#212121] font-medium">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-[#E0E0E0] focus:border-[#4FC3F7] focus:ring-[#4FC3F7]/20"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="rememberMe" 
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))}
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-[#616161]">Remember me</Label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-[#4FC3F7] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white py-3 text-lg font-medium disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-[#616161]">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-[#4FC3F7] hover:underline font-medium">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
