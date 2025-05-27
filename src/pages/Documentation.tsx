
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Share, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Documentation = () => {
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectDescription: "",
    requirements: "",
    features: "",
    techStack: "",
    documentType: "srs"
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateDocumentation = async () => {
    if (!formData.projectTitle || !formData.projectDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the project title and description.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Documentation Generated!",
        description: "Your project documentation has been created successfully.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="w-8 h-8 text-[#4FC3F7]" />
            <h1 className="text-4xl font-bold text-[#212121]">Documentation Generator</h1>
          </div>
          <p className="text-lg text-[#616161]">Create comprehensive project documentation with AI assistance</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#212121]">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="projectTitle" className="text-[#212121] font-medium">Project Title *</Label>
                <Input
                  id="projectTitle"
                  name="projectTitle"
                  placeholder="Enter your project title"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  className="border-[#E0E0E0] focus:border-[#4FC3F7]"
                />
              </div>

              <div>
                <Label htmlFor="projectDescription" className="text-[#212121] font-medium">Project Description *</Label>
                <Textarea
                  id="projectDescription"
                  name="projectDescription"
                  placeholder="Describe your project in detail"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  className="border-[#E0E0E0] focus:border-[#4FC3F7] h-32"
                />
              </div>

              <div>
                <Label htmlFor="requirements" className="text-[#212121] font-medium">Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="List your functional and non-functional requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="border-[#E0E0E0] focus:border-[#4FC3F7]"
                />
              </div>

              <div>
                <Label htmlFor="features" className="text-[#212121] font-medium">Key Features</Label>
                <Textarea
                  id="features"
                  name="features"
                  placeholder="Describe the main features of your project"
                  value={formData.features}
                  onChange={handleInputChange}
                  className="border-[#E0E0E0] focus:border-[#4FC3F7]"
                />
              </div>

              <div>
                <Label htmlFor="techStack" className="text-[#212121] font-medium">Technology Stack</Label>
                <Input
                  id="techStack"
                  name="techStack"
                  placeholder="e.g., React, Node.js, MongoDB"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  className="border-[#E0E0E0] focus:border-[#4FC3F7]"
                />
              </div>

              <div>
                <Label className="text-[#212121] font-medium">Document Type</Label>
                <Select value={formData.documentType} onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}>
                  <SelectTrigger className="border-[#E0E0E0] focus:border-[#4FC3F7]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="srs">Software Requirements Specification</SelectItem>
                    <SelectItem value="design">Design Document</SelectItem>
                    <SelectItem value="api">API Documentation</SelectItem>
                    <SelectItem value="user">User Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateDocumentation}
                disabled={loading}
                className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white py-3"
              >
                {loading ? "Generating..." : "Generate Documentation"}
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#212121]">Generated Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-[#90CAF9] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#212121] mb-2">Ready to Generate</h3>
                <p className="text-[#616161] mb-6">Fill out the form and click "Generate Documentation" to create your project documentation.</p>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full border-[#90CAF9] text-[#4FC3F7]">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full border-[#90CAF9] text-[#4FC3F7]">
                    <Share className="w-4 h-4 mr-2" />
                    Share Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
