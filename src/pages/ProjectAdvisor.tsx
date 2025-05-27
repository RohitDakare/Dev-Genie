import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Code, BookOpen } from "lucide-react";
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
}

// Interface matching the actual database structure
interface ProjectDetail {
  id: string;
  project_id: string;
  structure: string;
  flow: string;
  roadmap: string;
  pseudo_code: string;
  resources: string[];
  github_links: string[];
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
  const [selectedApi, setSelectedApi] = useState("openai");

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to generate projects
  const generateProjects = async () => {
    if (!formData.projectType || !formData.interests || !formData.skills) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate project suggestions.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-projects', {
        body: {
          projectType: formData.projectType,
          interests: formData.interests,
          skills: formData.skills,
          difficulty: formData.difficulty,
          selectedApi: selectedApi
        }
      });

      if (error) throw error;

      if (data?.projects) {
        setProjects(data.projects);
        toast({
          title: "Projects Generated!",
          description: "Here are your personalized project suggestions.",
        });
      }
    } catch (error) {
      console.error('Error generating projects:', error);
      toast({
        title: "Error",
        description: "Failed to generate projects. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle project selection
  const handleProjectSelect = async (project: Project) => {
    setSelectedProject(project);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('project-details', {
        body: {
          project: project,
          selectedApi: selectedApi
        }
      });

      if (error) throw error;

      if (data?.details) {
        setProjectDetails(data.details);
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

  // Conditional rendering based on selectedProject and projectDetails
  if (selectedProject && projectDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-4">
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
              ← Back to Projects
            </Button>
            <h1 className="text-3xl font-bold text-[#212121]">Project Details</h1>
          </div>

          <div className="flex space-x-4 mb-6">
            <Button 
              onClick={() => setShowResearchPaper(false)}
              variant={!showResearchPaper ? "default" : "outline"}
            >
              <Code className="w-4 h-4 mr-2" />
              Project Details
            </Button>
            <Button 
              onClick={() => setShowResearchPaper(true)}
              variant={showResearchPaper ? "default" : "outline"}
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
            <Sparkles className="w-8 h-8 text-[#4FC3F7]" />
            <h1 className="text-4xl font-bold text-[#212121]">Project Advisor</h1>
          </div>
          <p className="text-lg text-[#616161]">Get AI-powered project suggestions tailored to your skills and interests</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#212121]">Tell us about your preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-[#212121] font-medium">AI Provider</Label>
                  <RadioGroup value={selectedApi} onValueChange={setSelectedApi}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="openai" id="openai" />
                      <Label htmlFor="openai">OpenAI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="claude" id="claude" />
                      <Label htmlFor="claude">Claude</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gemini" id="gemini" />
                      <Label htmlFor="gemini">Gemini</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="projectType" className="text-[#212121] font-medium">Project Type *</Label>
                  <Input
                    id="projectType"
                    name="projectType"
                    placeholder="e.g., Web App, Mobile App, AI/ML, Game"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="border-[#E0E0E0] focus:border-[#4FC3F7]"
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
                    className="border-[#E0E0E0] focus:border-[#4FC3F7]"
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
                    className="border-[#E0E0E0] focus:border-[#4FC3F7]"
                  />
                </div>

                <div>
                  <Label className="text-[#212121] font-medium">Difficulty Level</Label>
                  <RadioGroup value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
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

                <Button 
                  onClick={generateProjects}
                  disabled={loading}
                  className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white py-3"
                >
                  {loading ? "Generating..." : "Generate Project Ideas"}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Suggestions */}
          <div className="space-y-6">
            {projects.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#212121] mb-4">Suggested Projects</h2>
                <div className="space-y-4">
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

            {projects.length === 0 && !loading && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-[#90CAF9] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#212121] mb-2">Ready to get started?</h3>
                  <p className="text-[#616161]">Fill out the form and click "Generate Project Ideas" to see personalized suggestions.</p>
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
