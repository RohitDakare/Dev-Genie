
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, ArrowRight, User, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    userType: "",
    skills: [] as string[]
  });
  const navigate = useNavigate();

  const skillOptions = [
    "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
    "HTML/CSS", "SQL", "Git", "Docker", "MongoDB", "TypeScript",
    "Vue.js", "Angular", "Spring Boot", "Django", "Flask", "Express"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "🎉 Welcome to Dev Genie!",
      description: "Your account has been created successfully. Let's start building amazing projects!",
    });
    navigate("/dashboard");
  };

  const progress = (currentStep / 2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-[#4FC3F7]" />
            <span className="text-2xl font-bold text-[#212121]">Dev Genie</span>
          </div>
          <h1 className="text-3xl font-bold text-[#212121] mb-2">Join the Community</h1>
          <p className="text-[#616161]">Create your account and start your development journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#616161]">Step {currentStep} of 2</span>
            <span className="text-sm font-medium text-[#616161]">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#212121]">
              {currentStep === 1 ? "Basic Information" : "Profile Details"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[#212121] font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="border-[#E0E0E0] focus:border-[#4FC3F7] focus:ring-[#4FC3F7]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#212121] font-medium">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-[#E0E0E0] focus:border-[#4FC3F7] focus:ring-[#4FC3F7]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#212121] font-medium">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="border-[#E0E0E0] focus:border-[#4FC3F7] focus:ring-[#4FC3F7]/20"
                      required
                    />
                  </div>

                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="w-full bg-[#4FC3F7] hover:bg-[#29B6F6] text-white py-3 text-lg font-medium"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-[#212121] font-medium">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="border-[#E0E0E0] focus:border-[#4FC3F7] focus:ring-[#4FC3F7]/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#212121] font-medium">Gender</Label>
                    <RadioGroup 
                      value={formData.gender} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="flex items-center space-x-2 cursor-pointer">
                          <User className="w-4 h-4" />
                          <span>Male</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="flex items-center space-x-2 cursor-pointer">
                          <User className="w-4 h-4" />
                          <span>Female</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="flex items-center space-x-2 cursor-pointer">
                          <Users className="w-4 h-4" />
                          <span>Other</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#212121] font-medium">User Type</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}>
                      <SelectTrigger className="border-[#E0E0E0] focus:border-[#4FC3F7]">
                        <SelectValue placeholder="Select your current status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="college-student">College Student</SelectItem>
                        <SelectItem value="school-student">School Student</SelectItem>
                        <SelectItem value="fresher">Fresh Graduate</SelectItem>
                        <SelectItem value="professional">Working Professional</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#212121] font-medium">Skills & Technologies</Label>
                    <p className="text-sm text-[#616161]">Select the technologies you're familiar with (or want to learn)</p>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 border border-[#E0E0E0] rounded-md">
                      {skillOptions.map((skill) => (
                        <Badge
                          key={skill}
                          variant={formData.skills.includes(skill) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            formData.skills.includes(skill) 
                              ? "bg-[#4FC3F7] hover:bg-[#29B6F6] text-white" 
                              : "border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]"
                          }`}
                          onClick={() => handleSkillToggle(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]"
                    >
                      <ArrowLeft className="mr-2 w-5 h-5" />
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-[#4FC3F7] hover:bg-[#29B6F6] text-white py-3 text-lg font-medium"
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <div className="text-center mt-6">
              <p className="text-[#616161]">
                Already have an account?{" "}
                <Link to="/login" className="text-[#4FC3F7] hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
