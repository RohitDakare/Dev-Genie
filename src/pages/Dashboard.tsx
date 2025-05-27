
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  Target,
  Clock,
  Star,
  ArrowRight,
  User,
  Code,
  Lightbulb
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user's recent projects
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        
        setRecentProjects(projects || []);
        
        // Fetch saved projects count
        const { data: saved } = await supabase
          .from('saved_projects')
          .select('*')
          .eq('user_id', user.id);
        
        setSavedProjects(saved || []);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const quickActions = [
    {
      title: "Generate New Project",
      description: "Get AI-powered project suggestions",
      icon: Sparkles,
      link: "/project-advisor",
      color: "bg-[#4FC3F7]"
    },
    {
      title: "Browse Ideas",
      description: "Explore curated project recommendations",
      icon: Lightbulb,
      link: "/project-recommendations",
      color: "bg-[#FFE082]"
    },
    {
      title: "Create Documentation",
      description: "Generate comprehensive project docs",
      icon: BookOpen,
      link: "/documentation",
      color: "bg-[#A5D6A7]"
    },
    {
      title: "Learning Resources",
      description: "Access tutorials and guides",
      icon: Code,
      link: "/resources",
      color: "bg-[#CE93D8]"
    }
  ];

  const stats = [
    {
      title: "Generated Projects",
      value: recentProjects.length,
      icon: Target,
      color: "text-[#4FC3F7]"
    },
    {
      title: "Saved Projects",
      value: savedProjects.length,
      icon: Star,
      color: "text-[#FFB74D]"
    },
    {
      title: "Learning Progress",
      value: "75%",
      icon: TrendingUp,
      color: "text-[#81C784]"
    },
    {
      title: "Time Saved",
      value: "24h",
      icon: Clock,
      color: "text-[#BA68C8]"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4FC3F7]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-[#4FC3F7] to-[#29B6F6] p-3 rounded-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#212121]">
                Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
              </h1>
              <p className="text-lg text-[#616161]">Ready to build something amazing today?</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-[#E0E0E0] shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#616161] mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-[#212121]">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-[#E0E0E0] shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#212121]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.link}>
                      <Card className="border-[#E0E0E0] hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                              <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#212121] group-hover:text-[#4FC3F7] transition-colors">
                                {action.title}
                              </h3>
                              <p className="text-sm text-[#616161] mt-1">{action.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#616161] group-hover:text-[#4FC3F7] transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card className="border-[#E0E0E0] shadow-lg mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-[#212121]">Recent Projects</CardTitle>
                  <Link to="/project-advisor">
                    <Button variant="outline" className="border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentProjects.length > 0 ? (
                  <div className="space-y-4">
                    {recentProjects.map((project: any) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                        <div>
                          <h3 className="font-semibold text-[#212121]">{project.title}</h3>
                          <p className="text-sm text-[#616161] mt-1">{project.description.substring(0, 100)}...</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="border-[#90CAF9] text-[#4FC3F7]">
                              {project.difficulty}
                            </Badge>
                            <Badge variant="outline" className="border-[#90CAF9] text-[#4FC3F7]">
                              {project.category}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-[#90CAF9] mx-auto mb-4" />
                    <p className="text-[#616161]">No projects yet. Generate your first project!</p>
                    <Link to="/project-advisor">
                      <Button className="mt-4 bg-[#4FC3F7] hover:bg-[#29B6F6] text-white">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="border-[#E0E0E0] shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#212121]">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#616161]">Projects Generated</span>
                      <span className="text-[#212121]">{recentProjects.length}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#4FC3F7] h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((recentProjects.length / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#616161]">Learning Path</span>
                      <span className="text-[#212121]">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#81C784] h-2 rounded-full w-3/4 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-[#E0E0E0] shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#212121]">💡 Pro Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#616161] text-sm leading-relaxed">
                  Start with beginner projects and gradually increase difficulty. This helps build confidence and ensures steady progress in your learning journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
