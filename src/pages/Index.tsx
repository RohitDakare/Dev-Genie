
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, FileText, Layers, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Suggestions",
      description: "Get personalized project ideas based on your skills and interests"
    },
    {
      icon: FileText,
      title: "Smart Documentation Generator",
      description: "Auto-generate SRS, UML diagrams, and testing documentation"
    },
    {
      icon: Layers,
      title: "Tech Stack Recommender",
      description: "Discover the perfect technologies for your project goals"
    },
    {
      icon: Zap,
      title: "Real-Time Support",
      description: "Get instant guidance and feedback throughout your development journey"
    }
  ];

  const steps = [
    { number: "1", title: "Choose your skills", description: "Tell us about your current experience and interests" },
    { number: "2", title: "Get a project idea", description: "Receive AI-curated suggestions tailored just for you" },
    { number: "3", title: "Generate documentation", description: "Create comprehensive SRS, UML, and testing docs instantly" }
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "Computer Science Student", quote: "I finished my project plan in one day with Dev Genie!" },
    { name: "Alex Kumar", role: "Fresh Graduate", quote: "The AI suggestions helped me build an amazing portfolio project." },
    { name: "Maya Johnson", role: "Coding Bootcamp Student", quote: "Dev Genie made documentation so much easier to understand." }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-[#212121] mb-6 leading-tight">
            Your AI-Powered
            <span className="text-[#4FC3F7] block">Project Mentor</span>
          </h1>
          <p className="text-xl text-[#616161] mb-8 max-w-2xl mx-auto leading-relaxed">
            From idea to execution—guided, simplified, and documented. Get personalized project recommendations and comprehensive documentation in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="bg-[#4FC3F7] hover:bg-[#29B6F6] text-white px-8 py-3 text-lg">
                Try Dev Genie
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD] px-8 py-3 text-lg">
              Explore Demo
            </Button>
          </div>
        </div>
        
        {/* Hero Visual */}
        <div className="mt-16">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" 
            alt="Student using Dev Genie platform"
            className="rounded-2xl shadow-2xl mx-auto max-w-4xl w-full opacity-90"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#212121] mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-[#616161] max-w-2xl mx-auto">
            Dev Genie provides comprehensive tools to guide your development journey from concept to completion.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-[#E0E0E0] shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-[#4FC3F7]" />
                </div>
                <h3 className="text-xl font-semibold text-[#212121] mb-2">{feature.title}</h3>
                <p className="text-[#616161] leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-r from-[#F3E5F5] to-[#E8F5E8] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212121] mb-4">
              How Dev Genie Works
            </h2>
            <p className="text-xl text-[#616161] max-w-2xl mx-auto">
              Get started in just three simple steps and transform your ideas into reality.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-[#4FC3F7] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-[#212121] mb-3">{step.title}</h3>
                <p className="text-[#616161] text-lg leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-[#90CAF9]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#212121] mb-4">
            Loved by students everywhere
          </h2>
          <p className="text-xl text-[#616161] max-w-2xl mx-auto">
            Join thousands of students who have accelerated their development journey with Dev Genie.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-[#E0E0E0] shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-[#212121] text-lg mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-[#212121]">{testimonial.name}</p>
                  <p className="text-[#616161]">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to build your next big idea?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join Dev Genie today and transform your development journey with AI-powered guidance.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-[#4FC3F7] hover:bg-gray-50 px-8 py-3 text-lg font-semibold">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#212121] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="w-6 h-6 text-[#4FC3F7]" />
              <span className="text-xl font-bold">Dev Genie</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Dev Genie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
