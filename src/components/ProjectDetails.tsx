
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Code, FileText, MapPin, Lightbulb } from "lucide-react";

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

interface ProjectDetailsProps {
  details: ProjectDetail;
}

export const ProjectDetails = ({ details }: ProjectDetailsProps) => {
  return (
    <div className="space-y-6">
      {/* Project Structure */}
      <Card className="shadow-xl border-0 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl text-[#212121]">
            <Code className="w-5 h-5 text-[#4FC3F7]" />
            <span>Project Structure</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-[#F5F5F5] p-4 rounded-lg text-sm overflow-x-auto">
            {details.structure}
          </pre>
        </CardContent>
      </Card>

      {/* User Flow */}
      <Card className="shadow-xl border-0 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl text-[#212121]">
            <MapPin className="w-5 h-5 text-[#4FC3F7]" />
            <span>User Flow</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-[#F5F5F5] p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
            {details.flow}
          </pre>
        </CardContent>
      </Card>

      {/* Development Roadmap */}
      <Card className="shadow-xl border-0 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl text-[#212121]">
            <MapPin className="w-5 h-5 text-[#4FC3F7]" />
            <span>Development Roadmap</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-[#F5F5F5] p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
            {details.roadmap}
          </pre>
        </CardContent>
      </Card>

      {/* Pseudo Code */}
      <Card className="shadow-xl border-0 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl text-[#212121]">
            <Lightbulb className="w-5 h-5 text-[#4FC3F7]" />
            <span>Key Algorithms & Pseudo Code</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-[#F5F5F5] p-4 rounded-lg text-sm overflow-x-auto">
            {details.pseudo_code}
          </pre>
        </CardContent>
      </Card>

      {/* Resources & GitHub Links */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-xl border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl text-[#212121]">
              <ExternalLink className="w-5 h-5 text-[#4FC3F7]" />
              <span>Helpful Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {details.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-[#F5F5F5] rounded-lg hover:bg-[#E0E0E0] transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-[#4FC3F7]" />
                    <span className="text-[#212121] text-sm truncate">{resource}</span>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl text-[#212121]">
              <Github className="w-5 h-5 text-[#4FC3F7]" />
              <span>GitHub References</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {details.github_links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-[#F5F5F5] rounded-lg hover:bg-[#E0E0E0] transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-[#212121]" />
                    <span className="text-[#212121] text-sm truncate">{link}</span>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
