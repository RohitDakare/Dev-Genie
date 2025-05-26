
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Code, BookOpen, ExternalLink, Github } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDetails } from "@/components/ProjectDetails";
import { ResearchPaper } from "@/components/ResearchPaper";

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  category: string;
}

interface ProjectDetail {
  title: string;
  description: string;
  structure: string;
  flow: string;
  roadmap: string;
  pseudoCode: string;
  resources: string[];
  githubLinks: string[];
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
  const [apiKey, setApiKey] = useState("");
  const [selectedApi, setSelectedApi] = useState("openai");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateProjects = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key to generate project suggestions.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const prompt = `Generate 3 unique project ideas based on these preferences:
      Project Type: ${formData.projectType}
      Interests: ${formData.interests}
      Skills: ${formData.skills}
      Difficulty: ${formData.difficulty}
      
      Return a JSON array with objects containing: id, title, description, difficulty, tags (array), category`;

      let response;
      
      if (selectedApi === "openai") {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
          }),
        });
      } else if (selectedApi === "claude") {
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }],
          }),
        });
      }

      if (response?.ok) {
        const data = await response.json();
        let content;
        
        if (selectedApi === "openai") {
          content = data.choices[0].message.content;
        } else if (selectedApi === "claude") {
          content = data.content[0].text;
        }

        try {
          const projectsData = JSON.parse(content);
          setProjects(projectsData);
          toast({
            title: "Projects Generated!",
            description: "Here are your personalized project suggestions.",
          });
        } catch {
          // Fallback mock data if JSON parsing fails
          const mockProjects = [
            {
              id: "1",
              title: "Personal Finance Tracker",
              description: "A web application to track expenses, income, and budget planning with data visualization.",
              difficulty: formData.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
              tags: ["React", "Chart.js", "Local Storage"],
              category: "Web Development"
            },
            {
              id: "2", 
              title: "Weather Forecast App",
              description: "Real-time weather application with location-based forecasts and weather alerts.",
              difficulty: formData.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
              tags: ["JavaScript", "API Integration", "Geolocation"],
              category: "Web Development"
            },
            {
              id: "3",
              title: "Task Management System",
              description: "Collaborative task management with team features, deadlines, and progress tracking.",
              difficulty: formData.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
              tags: ["CRUD Operations", "Database", "User Authentication"],
              category: "Full Stack"
            }
          ];
          setProjects(mockProjects);
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Error generating projects:', error);
      toast({
        title: "Error",
        description: "Failed to generate projects. Please check your API key and try again.",
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
      const detailPrompt = `Provide detailed information for the project "${project.title}":
      
      Return JSON with:
      - title
      - description (detailed)
      - structure (project architecture)
      - flow (user flow/workflow)
      - roadmap (development phases)
      - pseudoCode (key algorithms)
      - resources (array of helpful links)
      - githubLinks (array of relevant GitHub repositories)`;

      let response;
      
      if (selectedApi === "openai") {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: detailPrompt }],
            temperature: 0.7,
          }),
        });
      }

      if (response?.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
          const details = JSON.parse(content);
          setProjectDetails(details);
        } catch {
          // Fallback mock data
          setProjectDetails({
            title: project.title,
            description: `${project.description} This project involves modern web development practices and user-centered design principles.`,
            structure: "Frontend: React.js with TypeScript\nBackend: Node.js with Express\nDatabase: MongoDB\nAuthentication: JWT",
            flow: "1. User Registration/Login\n2. Dashboard Overview\n3. Core Functionality\n4. Data Management\n5. Settings & Profile",
            roadmap: "Phase 1: Setup & Authentication (Week 1)\nPhase 2: Core Features (Week 2-3)\nPhase 3: UI/UX Polish (Week 4)\nPhase 4: Testing & Deployment (Week 5)",
            pseudoCode: "// Main Application Logic\nfunction initializeApp() {\n  authenticateUser();\n  loadUserData();\n  renderDashboard();\n}",
            resources: [
              "https://reactjs.org/docs",
              "https://nodejs.org/en/docs",
              "https://developer.mozilla.org/",
              "https://stackoverflow.com/"
            ],
            githubLinks: [
              "https://github.com/topics/react",
              "https://github.com/topics/nodejs",
              "https://github.com/topics/" + project.category.toLowerCase().replace(' ', '-')
            ]
          });
        }
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

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
                  <Label htmlFor="apiKey" className="text-[#212121] font-medium">API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="border-[#E0E0E0] focus:border-[#4FC3F7]"
                  />
                </div>

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
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="projectType" className="text-[#212121] font-medium">Project Type</Label>
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
                  <Label htmlFor="interests" className="text-[#212121] font-medium">Interests</Label>
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
                  <Label htmlFor="skills" className="text-[#212121] font-medium">Skills</Label>
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
                  disabled={loading || !apiKey}
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
