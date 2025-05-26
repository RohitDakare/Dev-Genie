
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Sparkles, 
  FileText, 
  BookOpen, 
  Settings, 
  LogOut, 
  Lightbulb, 
  Code,
  Clock,
  Trophy,
  ChevronRight,
  Menu
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: "Projects Completed", value: 3, icon: Trophy, color: "text-[#A5D6A7]" },
    { label: "Docs Created", value: 8, icon: FileText, color: "text-[#90CAF9]" },
    { label: "Hours Saved", value: 24, icon: Clock, color: "text-[#FFE082]" }
  ];

  const quickActions = [
    { 
      title: "Get Project Idea", 
      description: "Discover your next project with AI recommendations", 
      icon: Lightbulb, 
      color: "bg-gradient-to-br from-[#FFE082] to-[#FFC107]",
      href: "/project-recommendations"
    },
    { 
      title: "Generate SRS", 
      description: "Create comprehensive software requirement specs", 
      icon: FileText, 
      color: "bg-gradient-to-br from-[#90CAF9] to-[#2196F3]",
      href: "/documentation"
    },
    { 
      title: "My Saved Projects", 
      description: "View and manage your project collection", 
      icon: Code, 
      color: "bg-gradient-to-br from-[#A5D6A7] to-[#4CAF50]",
      href: "/saved-projects"
    }
  ];

  const recentProjects = [
    { name: "E-commerce Mobile App", status: "In Progress", lastUpdated: "2 hours ago" },
    { name: "Weather Dashboard", status: "Documentation Ready", lastUpdated: "1 day ago" },
    { name: "Task Management System", status: "Completed", lastUpdated: "3 days ago" }
  ];

  const sidebarItems = [
    { name: "Dashboard", icon: Sparkles, href: "/dashboard", active: true },
    { name: "Project Ideas", icon: Lightbulb, href: "/project-recommendations" },
    { name: "Documentation", icon: FileText, href: "/documentation" },
    { name: "Resources", icon: BookOpen, href: "/resources" },
    { name: "Saved Projects", icon: Code, href: "/saved-projects" },
    { name: "Settings", icon: Settings, href: "/settings" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF]">
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0]">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-[#4FC3F7]" />
              <span className="text-xl font-bold text-[#212121]">Dev Genie</span>
            </div>
          </div>
          
          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-left hover:bg-[#E3F2FD] transition-colors ${
                  item.active ? 'bg-[#E3F2FD] border-r-4 border-[#4FC3F7] text-[#4FC3F7]' : 'text-[#616161]'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Button variant="ghost" className="w-full justify-start text-[#616161] hover:text-[#212121]">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-[#E0E0E0] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Menu className="w-6 h-6" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-[#212121]">Dashboard</h1>
                  <p className="text-[#616161]">Welcome back! Ready to build something amazing?</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback className="bg-[#4FC3F7] text-white">SW</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="font-medium text-[#212121]">Swati Sharma</p>
                  <p className="text-sm text-[#616161]">Computer Science Student</p>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#212121] mb-2">
                Hi Swati 👋 Ready to build your next big idea?
              </h2>
              <p className="text-lg text-[#616161]">
                Let's continue your development journey with personalized recommendations and tools.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="border-[#E0E0E0] shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#616161] mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-[#212121]">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gradient-to-br from-white to-gray-50`}>
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-[#616161] mt-2">+12% from last month</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#212121] mb-6">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <Card className="border-[#E0E0E0] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-semibold text-[#212121] mb-2">{action.title}</h4>
                        <p className="text-[#616161] mb-4">{action.description}</p>
                        <div className="flex items-center text-[#4FC3F7] font-medium">
                          <span>Get Started</span>
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div>
              <h3 className="text-2xl font-bold text-[#212121] mb-6">Recent Projects</h3>
              <Card className="border-[#E0E0E0] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-[#212121]">Your Latest Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProjects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-[#E0E0E0] rounded-lg hover:bg-[#F9FBFD] transition-colors">
                        <div>
                          <h4 className="font-semibold text-[#212121]">{project.name}</h4>
                          <p className="text-[#616161] text-sm">{project.lastUpdated}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === 'Completed' ? 'bg-[#A5D6A7] text-green-800' :
                            project.status === 'In Progress' ? 'bg-[#FFE082] text-yellow-800' :
                            'bg-[#90CAF9] text-blue-800'
                          }`}>
                            {project.status}
                          </span>
                          <ChevronRight className="w-5 h-5 text-[#616161]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
