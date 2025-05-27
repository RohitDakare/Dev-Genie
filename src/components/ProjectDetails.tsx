
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  GitBranch, 
  BookOpen, 
  ExternalLink, 
  Copy,
  CheckCircle 
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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

interface ProjectDetailsProps {
  details: ProjectDetail;
}

export const ProjectDetails = ({ details }: ProjectDetailsProps) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast({
        title: "Copied!",
        description: `${section} copied to clipboard.`,
      });
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const CopyButton = ({ text, section }: { text: string; section: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(text, section)}
      className="ml-auto"
    >
      {copiedSection === section ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-xl sm:text-2xl text-[#212121]">{details.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-[#616161] text-sm sm:text-base leading-relaxed">{details.description}</p>
        </CardContent>
      </Card>

      {/* Project Structure */}
      {details.structure && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl text-[#212121]">
                <Code className="w-5 h-5 text-[#4FC3F7]" />
                <span>Project Structure</span>
              </CardTitle>
              <CopyButton text={details.structure} section="Project Structure" />
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-[#F5F5F5] p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
              {details.structure}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Development Flow */}
      {details.flow && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl text-[#212121]">
                <GitBranch className="w-5 h-5 text-[#4FC3F7]" />
                <span>Development Flow</span>
              </CardTitle>
              <CopyButton text={details.flow} section="Development Flow" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{details.flow}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Roadmap */}
      {details.roadmap && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl text-[#212121]">
                <BookOpen className="w-5 h-5 text-[#4FC3F7]" />
                <span>Implementation Roadmap</span>
              </CardTitle>
              <CopyButton text={details.roadmap} section="Implementation Roadmap" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-[#F5F5F5] p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{details.roadmap}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pseudo Code */}
      {details.pseudoCode && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl text-[#212121]">
                <Code className="w-5 h-5 text-[#4FC3F7]" />
                <span>Pseudo Code</span>
              </CardTitle>
              <CopyButton text={details.pseudoCode} section="Pseudo Code" />
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-[#F5F5F5] p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
              {details.pseudoCode}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Resources and Links */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Learning Resources */}
        {details.resources && details.resources.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-[#212121]">Learning Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {details.resources.map((resource, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <BookOpen className="w-4 h-4 text-[#4FC3F7] mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#616161] break-words">{resource}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* GitHub Links */}
        {details.githubLinks && details.githubLinks.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-[#212121]">GitHub References</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {details.githubLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <GitBranch className="w-4 h-4 text-[#4FC3F7] flex-shrink-0" />
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-[#4FC3F7] hover:underline break-all flex items-center space-x-1"
                    >
                      <span>{link}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
