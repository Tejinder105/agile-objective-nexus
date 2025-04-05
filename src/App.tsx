
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import ObjectivesPage from "./pages/ObjectivesPage";
import MatrixPage from "./pages/MatrixPage"; 
import ProjectsPage from "./pages/ProjectsPage";
import NotFound from "./pages/NotFound";
import ObjectiveForm from "./pages/ObjectiveForm";
import ProjectForm from "./pages/ProjectForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/objectives" element={<ObjectivesPage />} />
            <Route path="/objectives/new" element={<ObjectiveForm />} />
            <Route path="/objectives/:id" element={<ObjectiveForm />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectForm />} />
            <Route path="/matrix" element={<MatrixPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
