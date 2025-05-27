
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bookmark, 
  Search, 
  Calendar, 
  Tag, 
  Trash2, 
  ExternalLink,
  Filter,
  Star,
  Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SavedProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mock saved projects data
  const [savedProjects] = useState([
    {
      id: 1,
      title: "AI-Powered Plant Disease Detector",
      description: "Build a machine learning application that can identify plant diseases from leaf images using computer vision and provide treatment recommendations.",
      difficulty: "Intermediate",
      tags: ["Python", "TensorFlow", "OpenCV", "Flask"],
      category: "AI/ML",
      savedDate: "2024-01-15",
      status: "Not Started",
      progress: 0,
      estimatedTime: "3-4 weeks"
    },
    {
      id: 2,
      title: "Social Media Analytics Dashboard",
      description: "Create a comprehensive dashboard that analyzes social media metrics, tracks engagement, and provides insights for content creators.",
      difficulty: "Advanced",
      tags: ["React", "Node.js", "MongoDB", "Chart.js"],
      category: "Web Development",
      savedDate: "2024-01-12",
      status: "In Progress",
      progress: 35,
      estimatedTime: "4-6 weeks"
    },
    {
      id: 3,
      title: "Personal Finance Tracker",
      description: "Build a comprehensive financial management app with budget tracking, expense categorization, and investment portfolio monitoring.",
      difficulty: "Beginner",
      tags: ["JavaScript", "HTML/CSS", "Chart.js", "Local Storage"],
      category: "Web Development",
      savedDate: "2024-01-10",
      status: "Completed",
      progress: 100,
      estimatedTime: "2-3 weeks"
    },
    {
      id: 4,
      title: "Smart Home Automation System",
      description: "Develop an IoT-based home automation system that controls lights, temperature, and security through a mobile app interface.",
      difficulty: "Intermediate",
      tags: ["Arduino", "React Native", "Firebase", "IoT"],
      category: "IoT",
      savedDate: "2024-01-08",
      status: "Planning",
      progress: 10,
      estimatedTime: "5-7 weeks"
    }
  ]);

  const categories = ["All", "Web Development", "AI/ML", "IoT", "Mobile Apps", "Blockchain"];

  const filteredProjects = savedProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-[#A5D6A7] text-green-800";
      case "Intermediate": return "bg-[#FFE082] text-yellow-800";
      case "Advanced": return "bg-[#EF9A9A] text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-[#A5D6A7] text-green-800";
      case "In Progress": return "bg-[#FFE082] text-yellow-800";
      case "Planning": return "bg-[#90CAF9] text-blue-800";
      case "Not Started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleRemoveProject = (projectId: number) => {
    toast({
      title: "Project Removed",
      description: "Project has been removed from your saved list.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-[#A5D6A7] to-[#4CAF50] p-3 rounded-lg">
              <Bookmark className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#212121]">Saved Projects</h1>
              <p className="text-lg text-[#616161]">Manage your saved project ideas and track progress</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#616161]" />
              <Input
                placeholder="Search saved projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#E0E0E0] focus:border-[#4FC3F7]"
              />
            </div>
            <Button variant="outline" className="border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-[#4FC3F7] hover:bg-[#29B6F6]" 
                  : "border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-[#E0E0E0] shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#212121]">{savedProjects.length}</div>
              <div className="text-sm text-[#616161]">Total Saved</div>
            </CardContent>
          </Card>
          <Card className="border-[#E0E0E0] shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#4CAF50]">
                {savedProjects.filter(p => p.status === "Completed").length}
              </div>
              <div className="text-sm text-[#616161]">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-[#E0E0E0] shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#FF9800]">
                {savedProjects.filter(p => p.status === "In Progress").length}
              </div>
              <div className="text-sm text-[#616161]">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-[#E0E0E0] shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#2196F3]">
                {savedProjects.filter(p => p.status === "Planning" || p.status === "Not Started").length}
              </div>
              <div className="text-sm text-[#616161]">Planned</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="border-[#E0E0E0] shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-semibold text-[#212121] group-hover:text-[#4FC3F7] transition-colors">
                    {project.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveProject(project.id)}
                    className="text-[#616161] hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[#616161] text-sm leading-relaxed mb-3">
                  {project.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-[#90CAF9] text-[#4FC3F7] text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-[#616161] mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Saved {project.savedDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{project.estimatedTime}</span>
                  </div>
                </div>

                {project.status === "In Progress" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#616161]">Progress</span>
                      <span className="text-[#212121]">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#4FC3F7] h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-[#4FC3F7] hover:bg-[#29B6F6] text-white">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-[#90CAF9] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#212121] mb-2">No saved projects found</h3>
            <p className="text-[#616161] mb-6">Start exploring project ideas and save your favorites!</p>
            <Button className="bg-[#4FC3F7] hover:bg-[#29B6F6] text-white">
              Explore Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProjects;
