
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  Heart, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  Filter,
  Star,
  Clock,
  Users,
  Code2,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProjectRecommendations = () => {
  const [filters, setFilters] = useState({
    skills: "",
    experience: "",
    domain: "",
    goal: ""
  });
  const [savedProjects, setSavedProjects] = useState<number[]>([]);

  const skillsOptions = ["JavaScript", "Python", "React", "Node.js", "Java", "C++", "SQL"];
  const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
  const domainOptions = ["Web Development", "Mobile Apps", "AI/ML", "Game Development", "IoT", "Blockchain"];
  const goalOptions = ["Portfolio", "Practice", "Academic", "Freelance"];

  const projectSuggestions = [
    {
      id: 1,
      title: "AI-Powered Plant Disease Detector",
      description: "Build a machine learning application that can identify plant diseases from leaf images using computer vision and provide treatment recommendations.",
      difficulty: "Intermediate",
      tags: ["Python", "TensorFlow", "OpenCV", "Flask"],
      category: "AI/ML",
      estimatedTime: "3-4 weeks",
      popularity: 4.8,
      saves: 234,
      aiReason: "Suggested based on your Python skills and interest in AI projects"
    },
    {
      id: 2,
      title: "Social Media Analytics Dashboard",
      description: "Create a comprehensive dashboard that analyzes social media metrics, tracks engagement, and provides insights for content creators.",
      difficulty: "Advanced",
      tags: ["React", "Node.js", "MongoDB", "Chart.js"],
      category: "Web Development",
      estimatedTime: "4-6 weeks",
      popularity: 4.6,
      saves: 189,
      aiReason: "Perfect for building a strong portfolio with modern web technologies"
    },
    {
      id: 3,
      title: "Smart Home Automation System",
      description: "Develop an IoT-based home automation system that controls lights, temperature, and security through a mobile app interface.",
      difficulty: "Intermediate",
      tags: ["Arduino", "React Native", "Firebase", "IoT"],
      category: "IoT",
      estimatedTime: "5-7 weeks",
      popularity: 4.7,
      saves: 156,
      aiReason: "Great for learning hardware-software integration"
    },
    {
      id: 4,
      title: "Personal Finance Tracker",
      description: "Build a comprehensive financial management app with budget tracking, expense categorization, and investment portfolio monitoring.",
      difficulty: "Beginner",
      tags: ["JavaScript", "HTML/CSS", "Chart.js", "Local Storage"],
      category: "Web Development",
      estimatedTime: "2-3 weeks",
      popularity: 4.4,
      saves: 298,
      aiReason: "Ideal beginner project with practical real-world applications"
    },
    {
      id: 5,
      title: "Multiplayer Quiz Game",
      description: "Create a real-time multiplayer quiz game with different categories, leaderboards, and social features for competitive learning.",
      difficulty: "Intermediate",
      tags: ["Socket.io", "Express", "MongoDB", "React"],
      category: "Game Development",
      estimatedTime: "4-5 weeks",
      popularity: 4.5,
      saves: 167,
      aiReason: "Combines fun with learning, great for portfolio diversity"
    },
    {
      id: 6,
      title: "Blockchain-based Voting System",
      description: "Develop a secure, transparent voting system using blockchain technology to ensure tamper-proof elections and transparent results.",
      difficulty: "Advanced",
      tags: ["Solidity", "Web3.js", "Ethereum", "React"],
      category: "Blockchain",
      estimatedTime: "6-8 weeks",
      popularity: 4.9,
      saves: 143,
      aiReason: "High-impact project showcasing cutting-edge technology skills"
    }
  ];

  const toggleSaveProject = (projectId: number) => {
    setSavedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
    
    const project = projectSuggestions.find(p => p.id === projectId);
    toast({
      title: savedProjects.includes(projectId) ? "Project Removed" : "Project Saved!",
      description: savedProjects.includes(projectId) 
        ? `${project?.title} removed from your saved projects`
        : `${project?.title} has been added to your saved projects`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-[#A5D6A7] text-green-800";
      case "Intermediate": return "bg-[#FFE082] text-yellow-800";
      case "Advanced": return "bg-[#EF9A9A] text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Web Development": "bg-[#90CAF9]",
      "AI/ML": "bg-[#A5D6A7]",
      "IoT": "bg-[#FFE082]",
      "Game Development": "bg-[#FFAB91]",
      "Blockchain": "bg-[#CE93D8]",
      "Mobile Apps": "bg-[#80DEEA]"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-[#FFE082] to-[#FFC107] p-3 rounded-lg">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#212121]">Project Recommendations</h1>
              <p className="text-lg text-[#616161]">Discover your next project with AI-powered suggestions</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-[#E0E0E0] shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-[#212121]">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-[#212121] mb-2 block">Skills</label>
                  <Select onValueChange={(value) => setFilters(prev => ({ ...prev, skills: value }))}>
                    <SelectTrigger className="border-[#E0E0E0]">
                      <SelectValue placeholder="Select skills" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillsOptions.map(skill => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#212121] mb-2 block">Experience Level</label>
                  <Select onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger className="border-[#E0E0E0]">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceOptions.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#212121] mb-2 block">Domain</label>
                  <Select onValueChange={(value) => setFilters(prev => ({ ...prev, domain: value }))}>
                    <SelectTrigger className="border-[#E0E0E0]">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domainOptions.map(domain => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#212121] mb-2 block">Goal</label>
                  <Select onValueChange={(value) => setFilters(prev => ({ ...prev, goal: value }))}>
                    <SelectTrigger className="border-[#E0E0E0]">
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalOptions.map(goal => (
                        <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Ideas
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="saved">Saved Projects</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid gap-6">
                  {projectSuggestions.map((project) => (
                    <Card key={project.id} className="border-[#E0E0E0] shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-2xl font-bold text-[#212121] group-hover:text-[#4FC3F7] transition-colors">
                                {project.title}
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSaveProject(project.id)}
                                className="ml-4"
                              >
                                {savedProjects.includes(project.id) ? (
                                  <BookmarkCheck className="w-5 h-5 text-[#4FC3F7]" />
                                ) : (
                                  <Bookmark className="w-5 h-5 text-[#616161]" />
                                )}
                              </Button>
                            </div>
                            
                            <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium mb-3 ${getCategoryColor(project.category)}`}>
                              {project.category}
                            </div>
                            
                            <p className="text-[#616161] text-lg leading-relaxed mb-4">
                              {project.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="border-[#90CAF9] text-[#4FC3F7]">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1">
                              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
                                {project.difficulty}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-[#616161]">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{project.estimatedTime}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-[#616161]">
                              <Star className="w-4 h-4 fill-[#FFE082] text-[#FFE082]" />
                              <span className="text-sm">{project.popularity}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-[#616161]">
                              <Users className="w-4 h-4" />
                              <span className="text-sm">{project.saves} saves</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#E3F2FD] border-l-4 border-[#4FC3F7] p-3 mb-4">
                          <div className="flex items-start space-x-2">
                            <Sparkles className="w-4 h-4 text-[#4FC3F7] mt-0.5" />
                            <p className="text-sm text-[#212121]">
                              <span className="font-medium">AI Insight:</span> {project.aiReason}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Button className="bg-[#4FC3F7] hover:bg-[#29B6F6] text-white">
                            <Code2 className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" className="border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]">
                            <FileText className="w-4 h-4 mr-2" />
                            Generate Documentation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center pt-8">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]"
                  >
                    Load More Projects
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="saved">
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-[#90CAF9] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#212121] mb-2">Your Saved Projects</h3>
                  <p className="text-[#616161] mb-6">
                    {savedProjects.length === 0 
                      ? "You haven't saved any projects yet. Start exploring and save your favorites!"
                      : `You have ${savedProjects.length} saved project${savedProjects.length !== 1 ? 's' : ''}`
                    }
                  </p>
                  {savedProjects.length === 0 && (
                    <Button className="bg-[#4FC3F7] hover:bg-[#29B6F6] text-white">
                      Explore Projects
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="trending">
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-[#FFE082] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#212121] mb-2">Trending Projects</h3>
                  <p className="text-[#616161]">Discover the most popular projects in the community</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRecommendations;
