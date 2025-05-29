
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { ProjectDetails } from "@/components/ProjectDetails";

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  category: string;
  user_id: string;
  api_source: string;
  created_at: string;
  estimated_time?: string;
  market_demand?: string;
}

const ProjectRecommendations = () => {
  const [filters, setFilters] = useState({
    skills: "",
    experience: "",
    domain: "",
    goal: ""
  });
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const skillsOptions = ["JavaScript", "Python", "React", "Node.js", "Java", "C++", "SQL"];
  const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
  const domainOptions = ["Web Development", "Mobile Apps", "AI/ML", "Game Development", "IoT", "Blockchain"];
  const goalOptions = ["Portfolio", "Practice", "Academic", "Freelance"];

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setProjects(data || []);
        setFilteredProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = projects;

    if (filters.experience) {
      filtered = filtered.filter(p => p.difficulty === filters.experience);
    }

    if (filters.domain) {
      filtered = filtered.filter(p => p.category === filters.domain);
    }

    if (filters.skills) {
      filtered = filtered.filter(p => 
        p.tags.some(tag => tag.toLowerCase().includes(filters.skills.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  }, [filters, projects]);

  const handleViewDetails = async (project: Project) => {
    setSelectedProject(project);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('project-details', {
        body: { project: project }
      });

      if (error) throw error;

      if (data?.details) {
        const transformedDetails = {
          id: data.details.id,
          title: project.title,
          description: project.description,
          structure: data.details.structure || '',
          flow: data.details.flow || '',
          roadmap: data.details.roadmap || '',
          pseudoCode: data.details.pseudo_code || '',
          resources: data.details.resources || [],
          githubLinks: data.details.github_links || [],
          project_id: data.details.project_id,
          created_at: data.details.created_at
        };
        setProjectDetails(transformedDetails);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocumentation = async (project: Project) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-documentation', {
        body: {
          projectTitle: project.title,
          projectDescription: project.description,
          requirements: "Standard project requirements",
          features: project.tags.join(", "),
          techStack: project.tags.join(", "),
          documentType: "srs"
        }
      });

      if (error) throw error;

      if (data?.documentation) {
        // Create and download the document
        const blob = new Blob([data.documentation], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_research_paper.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Documentation Generated!",
          description: "Research paper has been downloaded",
        });
      }
    } catch (error) {
      console.error('Error generating documentation:', error);
      toast({
        title: "Error",
        description: "Failed to generate documentation",
        variant: "destructive"
      });
    }
  };

  const toggleSaveProject = async (projectId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (savedProjects.includes(projectId)) {
        // Remove from saved
        await supabase
          .from('saved_projects')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', projectId);
        
        setSavedProjects(prev => prev.filter(id => id !== projectId));
        
        toast({
          title: "Project Removed",
          description: "Project removed from saved projects",
        });
      } else {
        // Add to saved
        await supabase
          .from('saved_projects')
          .insert({
            user_id: user.id,
            project_id: projectId
          });
        
        setSavedProjects(prev => [...prev, projectId]);
        
        toast({
          title: "Project Saved!",
          description: "Project added to saved projects",
        });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
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

  if (selectedProject && projectDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              onClick={() => {
                setSelectedProject(null);
                setProjectDetails(null);
              }}
              variant="outline"
            >
              ← Back to Projects
            </Button>
            <h1 className="text-3xl font-bold text-[#212121]">Project Details</h1>
          </div>
          <ProjectDetails details={projectDetails} />
        </div>
      </div>
    );
  }

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

                <Button 
                  onClick={() => setFilters({ skills: "", experience: "", domain: "", goal: "" })}
                  className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="all">All Projects ({filteredProjects.length})</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FC3F7] mx-auto mb-4"></div>
                    <p className="text-[#616161]">Loading projects...</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {filteredProjects.map((project) => (
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
                                <span className="text-sm">{project.estimated_time || '2-4 weeks'}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-[#616161]">
                                <Star className="w-4 h-4 fill-[#FFE082] text-[#FFE082]" />
                                <span className="text-sm">{project.market_demand || 'Medium'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <Button 
                              onClick={() => handleViewDetails(project)}
                              className="bg-[#4FC3F7] hover:bg-[#29B6F6] text-white"
                            >
                              <Code2 className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button 
                              onClick={() => handleGenerateDocumentation(project)}
                              variant="outline" 
                              className="border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Generate Documentation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trending">
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-[#FFE082] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#212121] mb-2">Trending Projects</h3>
                  <p className="text-[#616161]">Most popular projects from the community</p>
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
