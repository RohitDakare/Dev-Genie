
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, ExternalLink, Search, Star, Clock, Users } from "lucide-react";
import { useState } from "react";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const resources = [
    {
      id: 1,
      title: "React Complete Guide",
      description: "Comprehensive guide to building modern web applications with React",
      category: "Frontend",
      type: "Tutorial",
      difficulty: "Intermediate",
      rating: 4.8,
      duration: "8 hours",
      students: 2340,
      url: "#",
      tags: ["React", "JavaScript", "Web Development"]
    },
    {
      id: 2,
      title: "Node.js Backend Development",
      description: "Learn to build scalable backend applications with Node.js and Express",
      category: "Backend",
      type: "Course",
      difficulty: "Intermediate",
      rating: 4.7,
      duration: "12 hours",
      students: 1890,
      url: "#",
      tags: ["Node.js", "Express", "MongoDB"]
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      description: "Introduction to machine learning concepts and practical implementations",
      category: "AI/ML",
      type: "Course",
      difficulty: "Advanced",
      rating: 4.9,
      duration: "15 hours",
      students: 3210,
      url: "#",
      tags: ["Python", "TensorFlow", "Data Science"]
    },
    {
      id: 4,
      title: "Git Version Control",
      description: "Master Git and GitHub for effective version control and collaboration",
      category: "Tools",
      type: "Tutorial",
      difficulty: "Beginner",
      rating: 4.6,
      duration: "3 hours",
      students: 5670,
      url: "#",
      tags: ["Git", "GitHub", "Version Control"]
    },
    {
      id: 5,
      title: "Mobile App Development with React Native",
      description: "Build cross-platform mobile applications using React Native",
      category: "Mobile",
      type: "Course",
      difficulty: "Intermediate",
      rating: 4.5,
      duration: "10 hours",
      students: 1450,
      url: "#",
      tags: ["React Native", "Mobile", "iOS", "Android"]
    },
    {
      id: 6,
      title: "Database Design Principles",
      description: "Learn how to design efficient and scalable database schemas",
      category: "Database",
      type: "Article",
      difficulty: "Intermediate",
      rating: 4.4,
      duration: "2 hours",
      students: 890,
      url: "#",
      tags: ["SQL", "Database Design", "PostgreSQL"]
    }
  ];

  const categories = ["All", "Frontend", "Backend", "AI/ML", "Mobile", "Database", "Tools"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-[#A5D6A7] text-green-800";
      case "Intermediate": return "bg-[#FFE082] text-yellow-800";
      case "Advanced": return "bg-[#EF9A9A] text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Course": return "bg-[#90CAF9] text-blue-800";
      case "Tutorial": return "bg-[#CE93D8] text-purple-800";
      case "Article": return "bg-[#FFAB91] text-orange-800";
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
              <p className="text-lg text-[#616161]">Curated tutorials, courses, and guides to accelerate your learning</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#616161]" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#E0E0E0] focus:border-[#4FC3F7]"
              />
            </div>
          </div>

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

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="border-[#E0E0E0] shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-semibold text-[#212121] group-hover:text-[#4FC3F7] transition-colors">
                    {resource.title}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-[#616161] text-sm leading-relaxed">
                  {resource.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                  {resource.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-[#90CAF9] text-[#4FC3F7] text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-[#616161] mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-[#FFE082] text-[#FFE082]" />
                      <span>{resource.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{resource.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{resource.students}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Access Resource
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-[#90CAF9] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#212121] mb-2">No resources found</h3>
            <p className="text-[#616161]">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
