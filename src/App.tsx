
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthGuard } from "./components/AuthGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProjectRecommendations from "./pages/ProjectRecommendations";
import ProjectAdvisor from "./pages/ProjectAdvisor";
import Documentation from "./pages/Documentation";
import Resources from "./pages/Resources";
import SavedProjects from "./pages/SavedProjects";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route 
              index 
              element={
                <AuthGuard requireAuth={false}>
                  <Index />
                </AuthGuard>
              } 
            />
            <Route 
              path="/login" 
              element={
                <AuthGuard requireAuth={false}>
                  <Login />
                </AuthGuard>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <AuthGuard requireAuth={false}>
                  <Signup />
                </AuthGuard>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <AuthGuard requireAuth={true}>
                  <Dashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/project-recommendations" 
              element={
                <AuthGuard requireAuth={true}>
                  <ProjectRecommendations />
                </AuthGuard>
              } 
            />
            <Route 
              path="/project-advisor" 
              element={
                <AuthGuard requireAuth={true}>
                  <ProjectAdvisor />
                </AuthGuard>
              } 
            />
            <Route 
              path="/documentation" 
              element={
                <AuthGuard requireAuth={true}>
                  <Documentation />
                </AuthGuard>
              } 
            />
            <Route 
              path="/resources" 
              element={
                <AuthGuard requireAuth={true}>
                  <Resources />
                </AuthGuard>
              } 
            />
            <Route 
              path="/saved-projects" 
              element={
                <AuthGuard requireAuth={true}>
                  <SavedProjects />
                </AuthGuard>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <AuthGuard requireAuth={true}>
                  <Settings />
                </AuthGuard>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
