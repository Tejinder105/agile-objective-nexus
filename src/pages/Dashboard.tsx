import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ChevronRight, Clock, Layers, Plus, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Objective = Database['public']['Tables']['objectives']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch objectives
        const { data: objectivesData, error: objectivesError } = await supabase
          .from('objectives')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (objectivesError) throw objectivesError;
        
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (projectsError) throw projectsError;
        
        setObjectives(objectivesData || []);
        setProjects(projectsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Calculate statistics
  const activeObjectives = objectives.filter(obj => obj.progress < 100).length;
  const totalObjectives = objectives.length;
  const onTrackPercentage = totalObjectives > 0 
    ? Math.round((activeObjectives / totalObjectives) * 100) 
    : 0;
    
  const activeProjects = projects.filter(proj => proj.progress < 100).length;
  const highPriorityCount = objectives.filter(obj => obj.priority === 'High').length;
  
  // Find the next due date
  const nextDueDate = objectives
    .filter(obj => obj.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())[0]?.due_date;
    
  // Calculate days until next due date
  const daysUntilDue = nextDueDate 
    ? Math.max(0, Math.ceil((new Date(nextDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) 
    : null;

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
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
            <CardDescription className="text-2xl font-bold">{totalObjectives}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{activeObjectives} active</span>
              <span className="text-emerald-500 font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {onTrackPercentage}% on track
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            <CardDescription className="text-2xl font-bold">{activeProjects}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{highPriorityCount} high priority</span>
              <span className="text-nexus-500 font-medium flex items-center">
                <Layers className="h-3 w-3 mr-1" />
                {new Set(projects.map(p => p.phase).filter(Boolean)).size} phases
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Time to Objectives</CardTitle>
            <CardDescription className="text-2xl font-bold">{daysUntilDue !== null ? `${daysUntilDue} days` : 'No deadlines'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next deadline</span>
              <span className="text-orange-500 font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {nextDueDate ? formatDate(nextDueDate) : 'None'}
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
          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-muted rounded-lg w-full"></div>
                <div className="h-12 bg-muted rounded-lg w-full"></div>
                <div className="h-12 bg-muted rounded-lg w-full"></div>
              </div>
            </div>
          ) : objectives.length > 0 ? (
            <div className="grid gap-4">
              {objectives.map((objective) => (
                <Card key={objective.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{objective.title}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/objectives/${objective.id}`)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      Due: {formatDate(objective.due_date)} • Priority: {objective.priority || 'Not set'}
                    </CardDescription>
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
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted" />
                <p className="text-muted-foreground mb-4">No objectives found. Create your first objective to get started.</p>
                <Button onClick={() => navigate("/objectives/new")}>
                  <Plus className="mr-1 h-4 w-4" />
                  Create Objective
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-muted rounded-lg w-full"></div>
                <div className="h-12 bg-muted rounded-lg w-full"></div>
                <div className="h-12 bg-muted rounded-lg w-full"></div>
              </div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{project.title}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>Phase: {project.phase || 'Not set'}</CardDescription>
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
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Layers className="h-12 w-12 mx-auto mb-4 text-muted" />
                <p className="text-muted-foreground mb-4">No projects found. Create your first project to get started.</p>
                <Button onClick={() => navigate("/projects/new")}>
                  <Plus className="mr-1 h-4 w-4" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          )}
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
