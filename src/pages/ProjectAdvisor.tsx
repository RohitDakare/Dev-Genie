
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Code, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDetails } from "@/components/ProjectDetails";
import { ResearchPaper } from "@/components/ResearchPaper";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: string;
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
  const [formData, setFormData] = useState({
    projectType: "",
    interests: "",
    skills: "",
    difficulty: "Beginner"
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetail | null>(null);
  const [showResearchPaper, setShowResearchPaper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMockData, setShowMockData] = useState(true);

  // Fetch all projects from database on component mount
  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setAllProjects(data);
        setProjects(data.slice(0, 8)); // Show first 8 projects initially
        setShowMockData(false);
      } else {
        // If no projects in database, show empty state
        setAllProjects([]);
        setProjects([]);
        setShowMockData(false);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects from database",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const generateProjects = async () => {
    if (!formData.projectType || !formData.interests || !formData.skills) {
      setError("Please fill in all required fields to generate project suggestions.");
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate project suggestions.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);
    setShowMockData(false);
    
    try {
      console.log('Filtering projects based on preferences:', formData);
      
      // Filter projects based on user preferences
      let filteredProjects = allProjects;

      // Filter by difficulty
      if (formData.difficulty) {
        filteredProjects = filteredProjects.filter(project => 
          project.difficulty.toLowerCase() === formData.difficulty.toLowerCase()
        );
      }

      // Filter by project type/category
      if (formData.projectType) {
        filteredProjects = filteredProjects.filter(project => 
          project.category.toLowerCase().includes(formData.projectType.toLowerCase()) ||
          project.title.toLowerCase().includes(formData.projectType.toLowerCase())
        );
      }

      // Filter by interests
      if (formData.interests) {
        const interests = formData.interests.toLowerCase().split(',').map(i => i.trim());
        filteredProjects = filteredProjects.filter(project => 
          interests.some(interest => 
            project.description.toLowerCase().includes(interest) ||
            project.category.toLowerCase().includes(interest) ||
            project.tags.some(tag => tag.toLowerCase().includes(interest))
          )
        );
      }

      // Filter by skills
      if (formData.skills) {
        const skills = formData.skills.toLowerCase().split(',').map(s => s.trim());
        filteredProjects = filteredProjects.filter(project => 
          skills.some(skill => 
            project.tags.some(tag => tag.toLowerCase().includes(skill))
          )
        );
      }

      // If no matches found, show similar projects
      if (filteredProjects.length === 0) {
        filteredProjects = allProjects.filter(project => 
          project.difficulty.toLowerCase() === formData.difficulty.toLowerCase()
        ).slice(0, 5);
      }

      setProjects(filteredProjects.slice(0, 8));
      
      toast({
        title: "Projects Found!",
        description: `Found ${filteredProjects.length} projects matching your preferences.`,
      });
    } catch (error: any) {
      console.error('Error filtering projects:', error);
      const errorMessage = error?.message || 'Failed to filter projects. Please try again.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = async (project: Project) => {
    setSelectedProject(project);
    setLoading(true);
    
    try {
      console.log('Fetching project details for:', project.id);
      
      const { data, error } = await supabase.functions.invoke('project-details', {
        body: {
          project: project
        }
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

  const generateDocumentation = async (project: Project, details: ProjectDetail) => {
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

  if (selectedProject && projectDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Button 
              onClick={() => {
                setSelectedProject(null);
                setProjectDetails(null);
                setShowResearchPaper(false);
              }}
              variant="outline"
              className="w-full sm:w-auto"
            >
              ← Back to Projects
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#212121]">Project Details</h1>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Button 
              onClick={() => setShowResearchPaper(false)}
              variant={!showResearchPaper ? "default" : "outline"}
              className="w-full sm:w-auto"
            >
              <Code className="w-4 h-4 mr-2" />
              Project Details
            </Button>
            <Button 
              onClick={() => setShowResearchPaper(true)}
              variant={showResearchPaper ? "default" : "outline"}
              className="w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Research Paper
            </Button>
            <Button 
              onClick={() => generateDocumentation(selectedProject, projectDetails)}
              variant="outline"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Documentation
            </Button>
          </div>

          {!showResearchPaper ? (
            <ProjectDetails details={projectDetails} />
          ) : (
            <ResearchPaper project={selectedProject} details={projectDetails} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-[#4FC3F7]" />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#212121]">Project Advisor</h1>
          </div>
          <p className="text-base sm:text-lg text-[#616161] px-4">Get AI-powered project suggestions from our database of {allProjects.length} projects</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-[#212121]">Tell us about your preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectType" className="text-[#212121] font-medium">Project Type *</Label>
                  <Input
                    id="projectType"
                    name="projectType"
                    placeholder="e.g., Web App, Mobile App, AI/ML, Game"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="border-[#E0E0E0] focus:border-[#4FC3F7] mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="interests" className="text-[#212121] font-medium">Interests *</Label>
                  <Textarea
                    id="interests"
                    name="interests"
                    placeholder="e.g., Healthcare, Finance, Education, Gaming"
                    value={formData.interests}
                    onChange={handleInputChange}
                    className="border-[#E0E0E0] focus:border-[#4FC3F7] mt-2 min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="skills" className="text-[#212121] font-medium">Skills *</Label>
                  <Textarea
                    id="skills"
                    name="skills"
                    placeholder="e.g., JavaScript, Python, React, Machine Learning"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="border-[#E0E0E0] focus:border-[#4FC3F7] mt-2 min-h-[80px]"
                  />
                </div>

                <div>
                  <Label className="text-[#212121] font-medium">Difficulty Level</Label>
                  <RadioGroup value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Beginner" id="beginner" />
                      <Label htmlFor="beginner">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Advanced" id="advanced" />
                      <Label htmlFor="advanced">Advanced</Label>
                    </div>
                  </RadioGroup>
                </div>

                {error && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">🎯 Smart Matching:</span> We'll find projects from our database that match your preferences and skill level.
                  </p>
                </div>

                <Button 
                  onClick={generateProjects}
                  disabled={loading}
                  className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white py-3"
                >
                  {loading ? "Finding Matching Projects..." : "Find Matching Projects"}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {projects.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#212121] mb-4">
                  {showMockData ? 'Sample Projects' : 'Suggested Projects'} ({projects.length})
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {projects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onSelect={handleProjectSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="text-center py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FC3F7] mx-auto mb-4"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#212121] mb-2">Loading Projects...</h3>
                  <p className="text-[#616161] px-4">Please wait while we find the best projects for you.</p>
                </CardContent>
              </Card>
            )}

            {!loading && projects.length === 0 && allProjects.length === 0 && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="text-center py-8 sm:py-12">
                  <AlertCircle className="w-12 h-12 text-[#FFE082] mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-[#212121] mb-2">No Projects Found</h3>
                  <p className="text-[#616161] px-4">No projects are currently available in the database. Please check back later.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAdvisor;
