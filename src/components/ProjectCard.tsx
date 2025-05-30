
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Code } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: string; // Changed from union type to string
  tags: string[];
  category: string;
  user_id: string;
  api_source: string;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-[#212121] group-hover:text-[#4FC3F7] transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base text-[#616161] line-clamp-3 mb-3">
                {project.description}
              </p>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end space-x-2 sm:space-x-0 sm:space-y-2">
              <Badge 
                variant="outline" 
                className={`${getDifficultyColor(project.difficulty)} text-xs px-2 py-1`}
              >
                {project.difficulty}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-[#90CAF9] text-[#4FC3F7] text-xs">
              <Code className="w-3 h-3 mr-1" />
              {project.category}
            </Badge>
            {project.tags && project.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="border-[#E0E0E0] text-[#616161] text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags && project.tags.length > 3 && (
              <Badge variant="outline" className="border-[#E0E0E0] text-[#616161] text-xs">
                +{project.tags.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-2 border-t border-[#E0E0E0]">
            <div className="flex items-center space-x-4 text-sm text-[#616161]">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              {project.api_source && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span className="capitalize">{project.api_source}</span>
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => onSelect(project)}
              className="w-full sm:w-auto bg-[#4FC3F7] hover:bg-[#29B6F6] text-white px-4 py-2"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
