import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Lightbulb, 
  Sparkles, 
  RefreshCw, 
  Filter,
  Star,
  Clock,
  Code2,
  FileText,
  Trash2,
  Download
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProjectDetails } from "@/components/ProjectDetails";
import { ResearchPaper } from "@/components/ResearchPaper";

interface DatabaseProject {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  category: string;
  user_id: string;
  api_source: string;
  created_at: string;
  estimated_time?: string;
  market_demand?: string;
}

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  structure: string;
  flow: string;
  roadmap: string;
  pseudoCode: string;
  resources: string[];
  githubLinks: string[];
  project_id: string;
  created_at: string;
}

const ProjectAdvisor = () => {
  const [preferences, setPreferences] = useState({
    skills: "",
    interests: "",
    difficulty: "",
    projectType: ""
  });
  
  const [allProjects, setAllProjects] = useState<DatabaseProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<DatabaseProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<DatabaseProject | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetail | null>(null);
  const [showResearchPaper, setShowResearchPaper] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log('Fetched projects:', data);
        // Type assertion to handle the string -> union type conversion
        const typedProjects = (data || []).map(project => ({
          ...project,
          difficulty: project.difficulty as "Beginner" | "Intermediate" | "Advanced"
        }));
        setAllProjects(typedProjects);
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

  // Filter projects based on preferences
  useEffect(() => {
    let filtered = allProjects;

    if (preferences.skills) {
      filtered = filtered.filter(project => 
        project.tags.some(tag => tag.toLowerCase().includes(preferences.skills.toLowerCase()))
      );
    }

    if (preferences.interests) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(preferences.interests.toLowerCase()) ||
        project.description.toLowerCase().includes(preferences.interests.toLowerCase()) ||
        project.category.toLowerCase().includes(preferences.interests.toLowerCase())
      );
    }

    if (preferences.difficulty) {
      filtered = filtered.filter(project => project.difficulty === preferences.difficulty);
    }

    if (preferences.projectType) {
      filtered = filtered.filter(project => project.category === preferences.projectType);
    }

    setFilteredProjects(filtered);
  }, [preferences, allProjects]);

  const handleClearFilters = () => {
    setPreferences({
      skills: "",
      interests: "",
      difficulty: "",
      projectType: ""
    });
  };

  const handleExportData = () => {
    try {
      const dataToExport = {
        preferences,
        recommendedProjects: filteredProjects,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project_advisor_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your project advisor data has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePreferences = () => {
    setPreferences({
      skills: "",
      interests: "",
      difficulty: "",
      projectType: ""
    });
    
    toast({
      title: "Preferences Cleared",
      description: "All your preferences have been reset.",
    });
  };

  const handleViewDetails = async (project: DatabaseProject) => {
    setSelectedProject(project);
    setShowResearchPaper(false);
    setLoading(true);
    
    try {
      console.log('Fetching project details for:', project.id);
      
      const { data, error } = await supabase.functions.invoke('project-details', {
        body: { project: project }
      });

      console.log('Project details response:', data, error);

      if (error) {
        console.error('Function error:', error);
        // Create mock details if API fails
        const mockDetails: ProjectDetail = {
          id: 'detail-' + project.id,
          title: project.title,
          description: project.description,
          structure: `Project Structure for ${project.title}:\n\n1. Frontend Components\n2. Backend Services\n3. Database Schema\n4. API Endpoints\n5. Testing Suite`,
          flow: `Development Flow:\n\n1. Setup development environment\n2. Create project structure\n3. Implement core features\n4. Add advanced functionality\n5. Testing and deployment`,
          roadmap: `Development Roadmap:\n\nWeek 1-2: Setup & Planning\nWeek 3-4: Core Development\nWeek 5-6: Feature Implementation\nWeek 7-8: Testing & Polish`,
          pseudoCode: `// Main application logic\nfunction main() {\n  // Initialize application\n  setupEnvironment();\n  \n  // Load core modules\n  loadModules();\n  \n  // Start application\n  startApp();\n}`,
          resources: [
            'Official Documentation',
            'GitHub Repositories',
            'Online Tutorials',
            'Community Forums',
            'Best Practices Guide'
          ],
          githubLinks: [
            'https://github.com/example/starter-template',
            'https://github.com/example/similar-project',
            'https://github.com/example/component-library'
          ],
          project_id: project.id,
          created_at: new Date().toISOString()
        };
        setProjectDetails(mockDetails);
      } else if (data?.details) {
        const transformedDetails: ProjectDetail = {
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
      } else {
        throw new Error('No project details received');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      // Create mock details as fallback
      const mockDetails: ProjectDetail = {
        id: 'detail-' + project.id,
        title: project.title,
        description: project.description,
        structure: `Project Structure for ${project.title}:\n\n1. Frontend Components\n2. Backend Services\n3. Database Schema\n4. API Endpoints\n5. Testing Suite`,
        flow: `Development Flow:\n\n1. Setup development environment\n2. Create project structure\n3. Implement core features\n4. Add advanced functionality\n5. Testing and deployment`,
        roadmap: `Development Roadmap:\n\nWeek 1-2: Setup & Planning\nWeek 3-4: Core Development\nWeek 5-6: Feature Implementation\nWeek 7-8: Testing & Polish`,
        pseudoCode: `// Main application logic\nfunction main() {\n  // Initialize application\n  setupEnvironment();\n  \n  // Load core modules\n  loadModules();\n  \n  // Start application\n  startApp();\n}`,
        resources: [
          'Official Documentation',
          'GitHub Repositories',
          'Online Tutorials',
          'Community Forums',
          'Best Practices Guide'
        ],
        githubLinks: [
          'https://github.com/example/starter-template',
          'https://github.com/example/similar-project',
          'https://github.com/example/component-library'
        ],
        project_id: project.id,
        created_at: new Date().toISOString()
      };
      setProjectDetails(mockDetails);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResearchPaper = async (project: DatabaseProject) => {
    await handleViewDetails(project);
    setShowResearchPaper(true);
  };

  const generateDocumentation = async (project: DatabaseProject, details: ProjectDetail) => {
    setLoading(true);
    try {
      console.log('Generating documentation for project:', project.title);
      
      const { data, error } = await supabase.functions.invoke('generate-documentation', {
        body: {
          projectTitle: project.title,
          projectDescription: project.description,
          requirements: details.structure,
          features: details.flow,
          techStack: project.tags.join(', '),
          documentType: 'srs'
        }
      });

      if (error) {
        console.error('Documentation generation error:', error);
        throw error;
      }

      if (data?.documentation) {
        // Create a blob and download the documentation
        const blob = new Blob([data.documentation], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_documentation.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Documentation Generated!",
          description: "Project documentation has been downloaded.",
        });
      }
    } catch (error) {
      console.error('Error generating documentation:', error);
      toast({
        title: "Error",
        description: "Failed to generate documentation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
      "Mobile Development": "bg-[#80DEEA]"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100";
  };

  // Show project details page
  if (selectedProject && projectDetails && !showResearchPaper) {
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
              ← Back to Advisor
            </Button>
            <h1 className="text-3xl font-bold text-[#212121]">Project Details</h1>
            <Button 
              onClick={() => generateDocumentation(selectedProject, projectDetails)}
              variant="outline"
              disabled={loading}
              className="ml-auto"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Documentation
            </Button>
          </div>
          <ProjectDetails details={projectDetails} />
        </div>
      </div>
    );
  }

  // Show research paper page
  if (selectedProject && projectDetails && showResearchPaper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              onClick={() => {
                setSelectedProject(null);
                setProjectDetails(null);
                setShowResearchPaper(false);
              }}
              variant="outline"
            >
              ← Back to Advisor
            </Button>
            <h1 className="text-3xl font-bold text-[#212121]">Research Paper</h1>
            <Button 
              onClick={() => generateDocumentation(selectedProject, projectDetails)}
              variant="outline"
              disabled={loading}
              className="ml-auto"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Documentation
            </Button>
          </div>
          <ResearchPaper project={selectedProject} details={projectDetails} />
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
            <div className="bg-gradient-to-br from-[#CE93D8] to-[#9C27B0] p-3 rounded-lg">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#212121]">Project Advisor</h1>
              <p className="text-lg text-[#616161]">Get personalized project recommendations based on your skills and interests</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Preferences Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-[#E0E0E0] shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-[#212121]">
                  <Filter className="w-5 h-5" />
                  <span>Your Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-[#212121] mb-2 block">Skills</Label>
                  <Input
                    placeholder="e.g., React, Python, Unity"
                    value={preferences.skills}
                    onChange={(e) => setPreferences(prev => ({ ...prev, skills: e.target.value }))}
                    className="border-[#E0E0E0]"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#212121] mb-2 block">Interests</Label>
                  <Input
                    placeholder="e.g., AI, Gaming, Finance"
                    value={preferences.interests}
                    onChange={(e) => setPreferences(prev => ({ ...prev, interests: e.target.value }))}
                    className="border-[#E0E0E0]"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#212121] mb-2 block">Difficulty Level</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="border-[#E0E0E0]">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#212121] mb-2 block">Project Type</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, projectType: value }))}>
                    <SelectTrigger className="border-[#E0E0E0]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                      <SelectItem value="AI/ML">AI/ML</SelectItem>
                      <SelectItem value="Game Development">Game Development</SelectItem>
                      <SelectItem value="IoT">IoT</SelectItem>
                      <SelectItem value="Blockchain">Blockchain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleClearFilters}
                    className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                  
                  <Button 
                    onClick={handleExportData}
                    variant="outline"
                    className="w-full border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  
                  <Button 
                    onClick={handleDeletePreferences}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#212121] mb-2">
                Recommended Projects ({filteredProjects.length})
              </h2>
              <p className="text-[#616161]">
                {filteredProjects.length === 0 
                  ? "No projects match your criteria. Try adjusting your preferences."
                  : "Based on your preferences, here are the best project matches for you."
                }
              </p>
            </div>

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
                          onClick={() => handleGenerateResearchPaper(project)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAdvisor;
