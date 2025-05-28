
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BookOpen, ExternalLink, Search, Star, Clock, Users, Github, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  topics: string[];
}

interface AIResource {
  title: string;
  description: string;
  url: string;
  type: string;
  difficulty: string;
  rating: number;
  isFree: boolean;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Frontend");
  const [selectedApi, setSelectedApi] = useState("openai");
  const [loading, setLoading] = useState(false);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [aiResources, setAiResources] = useState<AIResource[]>([]);

  const categories = ["Frontend", "Backend", "AI/ML", "Mobile", "Database", "DevOps", "Design"];

  const fetchResources = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-resources', {
        body: {
          category: selectedCategory,
          searchTerm: searchTerm,
          selectedApi: selectedApi
        }
      });

      if (error) throw error;

      if (data) {
        setGithubRepos(data.githubRepos || []);
        setAiResources(data.aiResources || []);
        toast({
          title: "Resources Updated!",
          description: `Found ${data.githubRepos?.length || 0} GitHub repositories and ${data.aiResources?.length || 0} learning resources.`,
        });
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to fetch resources. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "course": return "bg-[#90CAF9] text-blue-800";
      case "tutorial": return "bg-[#CE93D8] text-purple-800";
      case "documentation": return "bg-[#A5D6A7] text-green-800";
      case "book": return "bg-[#FFAB91] text-orange-800";
      case "community": return "bg-[#FFE082] text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "bg-[#A5D6A7] text-green-800";
      case "intermediate": return "bg-[#FFE082] text-yellow-800";
      case "advanced": return "bg-[#EF9A9A] text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-[#90CAF9] to-[#2196F3] p-3 rounded-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#212121]">Learning Resources</h1>
              <p className="text-lg text-[#616161]">AI-curated tutorials, courses, and GitHub repositories</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label className="text-[#212121] font-medium mb-2">AI Provider</Label>
                <RadioGroup value={selectedApi} onValueChange={setSelectedApi} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="openai" id="openai-res" />
                    <Label htmlFor="openai-res">OpenAI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="claude" id="claude-res" />
                    <Label htmlFor="claude-res">Claude</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gemini" id="gemini-res" />
                    <Label htmlFor="gemini-res">Gemini</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-[#212121] font-medium mb-2">Category</Label>
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

              <div>
                <Label className="text-[#212121] font-medium mb-2">Search</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#616161]" />
                    <Input
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-[#E0E0E0] focus:border-[#4FC3F7]"
                    />
                  </div>
                  <Button
                    onClick={fetchResources}
                    disabled={loading}
                    className="bg-[#4FC3F7] hover:bg-[#29B6F6] text-white"
                  >
                    {loading ? "..." : "Search"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* GitHub Repositories */}
        {githubRepos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#212121] mb-4 flex items-center">
              <Github className="w-6 h-6 mr-2" />
              GitHub Repositories
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {githubRepos.map((repo, index) => (
                <Card key={index} className="border-[#E0E0E0] shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold text-[#212121] line-clamp-2">
                        {repo.name}
                      </CardTitle>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{repo.stars}</span>
                      </div>
                    </div>
                    <p className="text-[#616161] text-sm line-clamp-3">
                      {repo.description || "No description available"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {repo.language && (
                        <Badge variant="outline" className="border-[#4FC3F7] text-[#4FC3F7]">
                          {repo.language}
                        </Badge>
                      )}
                      {repo.topics.slice(0, 2).map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="outline" className="border-[#90CAF9] text-[#616161]">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      onClick={() => window.open(repo.url, '_blank')}
                      className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Repository
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Learning Resources */}
        {aiResources.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#212121] mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-2" />
              Learning Resources
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiResources.map((resource, index) => (
                <Card key={index} className="border-[#E0E0E0] shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-semibold text-[#212121] line-clamp-2">
                        {resource.title}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-[#FFE082] text-[#FFE082]" />
                        <span className="text-sm">{resource.rating}</span>
                      </div>
                    </div>
                    <p className="text-[#616161] text-sm line-clamp-3">
                      {resource.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                      {resource.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                      )}
                      {resource.isFree && (
                        <Badge variant="outline" className="border-green-500 text-green-700">
                          Free
                        </Badge>
                      )}
                    </div>
                    <Button 
                      onClick={() => window.open(resource.url, '_blank')}
                      className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Access Resource
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FC3F7] mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-[#212121] mb-2">Fetching Resources...</h3>
            <p className="text-[#616161]">Please wait while we gather the latest resources for you.</p>
          </div>
        )}

        {!loading && githubRepos.length === 0 && aiResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-[#90CAF9] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#212121] mb-2">No resources found</h3>
            <p className="text-[#616161]">Try selecting a different category or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
