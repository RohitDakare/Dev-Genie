
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  category: string;
}

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-[#A5D6A7] text-[#2E7D32]';
      case 'Intermediate': return 'bg-[#FFE082] text-[#F57F17]';
      case 'Advanced': return 'bg-[#EF9A9A] text-[#C62828]';
      default: return 'bg-[#E0E0E0] text-[#424242]';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-[#212121]">{project.title}</CardTitle>
          <Badge className={`${getDifficultyColor(project.difficulty)} border-0`}>
            {project.difficulty}
          </Badge>
        </div>
        <Badge variant="outline" className="w-fit text-[#4FC3F7] border-[#4FC3F7]">
          {project.category}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-[#616161] mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Button 
          onClick={() => onSelect(project)}
          className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
