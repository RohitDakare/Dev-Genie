
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, Download, Share, Sparkles, Copy, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Documentation = () => {
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectDescription: "",
    requirements: "",
    features: "",
    techStack: "",
    documentType: "srs"
  });
  const [selectedApi, setSelectedApi] = useState("openai");
  const [loading, setLoading] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [copied, setCopied] = useState(false);

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
    try {
      const { data, error } = await supabase.functions.invoke('generate-documentation', {
        body: {
          ...formData,
          selectedApi: selectedApi
        }
      });

      if (error) throw error;

      if (data?.documentation) {
        setGeneratedDoc(data.documentation);
        toast({
          title: "Documentation Generated!",
          description: "Your project documentation has been created successfully.",
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

  const downloadDocumentation = () => {
    if (!generatedDoc) {
      toast({
        title: "No Documentation",
        description: "Please generate documentation first.",
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob([generatedDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${formData.documentType}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Documentation has been downloaded successfully.",
    });
  };

  const copyDocumentation = async () => {
    if (!generatedDoc) return;
    
    try {
      await navigator.clipboard.writeText(generatedDoc);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Documentation copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-6">
      <div className="max-w-7xl mx-auto">
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
                <Label className="text-[#212121] font-medium">AI Provider</Label>
                <RadioGroup value={selectedApi} onValueChange={setSelectedApi} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="openai" id="openai-doc" />
                    <Label htmlFor="openai-doc">OpenAI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="claude" id="claude-doc" />
                    <Label htmlFor="claude-doc">Claude</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gemini" id="gemini-doc" />
                    <Label htmlFor="gemini-doc">Gemini</Label>
                  </div>
                </RadioGroup>
              </div>

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
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-[#212121]">Generated Documentation</CardTitle>
                {generatedDoc && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={copyDocumentation}
                      variant="outline"
                      size="sm"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={downloadDocumentation}
                      className="bg-[#4FC3F7] hover:bg-[#29B6F6] text-white"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedDoc ? (
                <div className="bg-[#F9F9F9] p-4 rounded-lg max-h-[70vh] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#212121] font-mono">
                    {generatedDoc}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-[#90CAF9] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#212121] mb-2">Ready to Generate</h3>
                  <p className="text-[#616161] mb-6">Fill out the form and click "Generate Documentation" to create your project documentation.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
