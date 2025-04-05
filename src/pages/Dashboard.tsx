
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ChevronRight, Clock, Layers, Plus, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  
  const objectivesData = [
    { id: 1, title: "Launch v1 of Product", progress: 65, dueDate: "Apr 15, 2025", priority: "High" },
    { id: 2, title: "Increase Customer Retention", progress: 30, dueDate: "May 20, 2025", priority: "Medium" },
    { id: 3, title: "Reduce Development Cycle", progress: 80, dueDate: "Apr 30, 2025", priority: "High" },
  ];
  
  const projectsData = [
    { id: 1, title: "User Research", phase: "Discovery", progress: 100 },
    { id: 2, title: "Feature Development", phase: "Implementation", progress: 45 },
    { id: 3, title: "Marketing Campaign", phase: "Planning", progress: 20 },
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your project overview and key metrics.</p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={() => navigate("/objectives/new")} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Objective
          </Button>
          <Button onClick={() => navigate("/projects/new")} variant="outline" size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Objectives</CardTitle>
            <CardDescription className="text-2xl font-bold">5</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">3 active</span>
              <span className="text-emerald-500 font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                60% on track
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            <CardDescription className="text-2xl font-bold">8</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">2 high priority</span>
              <span className="text-nexus-500 font-medium flex items-center">
                <Layers className="h-3 w-3 mr-1" />
                3 phases
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Time to Objectives</CardTitle>
            <CardDescription className="text-2xl font-bold">24 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next deadline</span>
              <span className="text-orange-500 font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Apr 15, 2025
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="objectives" className="space-y-4">
        <TabsList>
          <TabsTrigger value="objectives" className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Objectives
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="objectives" className="space-y-4">
          <div className="grid gap-4">
            {objectivesData.map((objective) => (
              <Card key={objective.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{objective.title}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/objectives/${objective.id}`)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>Due: {objective.dueDate} • Priority: {objective.priority}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{objective.progress}%</span>
                    </div>
                    <Progress value={objective.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button variant="outline" className="w-full" onClick={() => navigate("/objectives")}>
              View All Objectives
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4">
            {projectsData.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{project.title}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>Phase: {project.phase}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button variant="outline" className="w-full" onClick={() => navigate("/projects")}>
              View All Projects
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your key performance indicators and metrics.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted" />
                <p>Metrics visualization will be available soon</p>
                <Button variant="outline" className="mt-4">Explore Metrics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
