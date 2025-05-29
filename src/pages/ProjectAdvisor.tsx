
import { useState } from "react";
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
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  category: string;
  user_id: string;
  api_source: string;
  created_at: string;
  estimated_time?: string;
  market_demand?: string;
}

// Fixed interface to match what's expected by the components
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetail | null>(null);
  const [showResearchPaper, setShowResearchPaper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Clear error when user starts typing
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
    
    try {
      console.log('Generating projects with data:', formData);
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-projects', {
        body: {
          projectType: formData.projectType,
          interests: formData.interests,
          skills: formData.skills,
          difficulty: formData.difficulty
        }
      });

      console.log('Function response:', data, functionError);

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message || 'Failed to generate projects');
      }

      if (data?.projects && Array.isArray(data.projects)) {
        setProjects(data.projects);
        toast({
          title: "Projects Generated!",
          description: `Generated ${data.projects.length} personalized project suggestions from multiple AI models.`,
        });
      } else {
        throw new Error('No projects received from the API');
      }
    } catch (error: any) {
      console.error('Error generating projects:', error);
      const errorMessage = error?.message || 'Failed to generate projects. Please try again.';
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
      const { data, error } = await supabase.functions.invoke('project-details', {
        body: {
          project: project
        }
      });

      if (error) throw error;

      if (data?.details) {
        // Transform the database response to match our interface
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
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast({
        title: "Error",
        description: "Failed to load project details. Please try again.",
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
          <p className="text-base sm:text-lg text-[#616161] px-4">Get AI-powered project suggestions from multiple AI models (OpenAI, Claude, Gemini)</p>
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
                    <span className="font-semibold">🤖 Multi-AI Generation:</span> We use OpenAI, Claude, and Gemini simultaneously to provide diverse and comprehensive project suggestions.
                  </p>
                </div>

                <Button 
                  onClick={generateProjects}
                  disabled={loading}
                  className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white py-3"
                >
                  {loading ? "Generating from Multiple AIs..." : "Generate Project Ideas"}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {projects.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#212121] mb-4">
                  Suggested Projects ({projects.length})
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

            {projects.length === 0 && !loading && !error && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="text-center py-8 sm:py-12">
                  <Sparkles className="w-12 sm:w-16 h-12 sm:h-16 text-[#90CAF9] mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-[#212121] mb-2">Ready to get started?</h3>
                  <p className="text-[#616161] px-4">Fill out the form and click "Generate Project Ideas" to see personalized suggestions.</p>
                </CardContent>
              </Card>
            )}

            {loading && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="text-center py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FC3F7] mx-auto mb-4"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#212121] mb-2">Generating Projects...</h3>
                  <p className="text-[#616161] px-4">Please wait while we create personalized project suggestions for you using multiple AI models.</p>
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
