import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronRight, Clock, Filter, Layers, Plus, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const projects = [
    {
      id: 1,
      title: "User Research",
      description: "Conduct comprehensive user research to inform product development",
      progress: 100,
      startDate: "Mar 1, 2025",
      endDate: "Mar 15, 2025",
      team: "UX",
      members: 3,
      phase: "Discovery",
      status: "Completed",
      tags: ["research", "ux", "users"]
    },
    {
      id: 2,
      title: "Feature Development",
      description: "Build core features for the v1 product launch",
      progress: 45,
      startDate: "Mar 16, 2025",
      endDate: "Apr 30, 2025",
      team: "Engineering",
      members: 5,
      phase: "Implementation",
      status: "In Progress",
      tags: ["development", "features", "product"]
    },
    {
      id: 3,
      title: "Marketing Campaign",
      description: "Plan and execute the product launch marketing campaign",
      progress: 20,
      startDate: "Apr 1, 2025",
      endDate: "May 15, 2025",
      team: "Marketing",
      members: 4,
      phase: "Planning",
      status: "In Progress",
      tags: ["marketing", "launch", "campaign"]
    },
    {
      id: 4,
      title: "Partner Integration",
      description: "Integrate with key partner APIs and services",
      progress: 10,
      startDate: "Apr 15, 2025",
      endDate: "May 30, 2025",
      team: "Product",
      members: 2,
      phase: "Design",
      status: "Not Started",
      tags: ["integration", "api", "partners"]
    },
    {
      id: 5,
      title: "Bug Fixes",
      description: "Address critical bugs identified during testing",
      progress: 30,
      startDate: "Mar 15, 2025",
      endDate: "Ongoing",
      team: "Engineering",
      members: 3,
      phase: "Maintenance",
      status: "In Progress",
      tags: ["bugs", "fixes", "maintenance"]
    }
  ];
  
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const phaseColor = {
    "Discovery": "bg-purple-100 text-purple-800",
    "Design": "bg-blue-100 text-blue-800",
    "Planning": "bg-teal-100 text-teal-800",
    "Implementation": "bg-nexus-100 text-nexus-800",
    "Testing": "bg-amber-100 text-amber-800",
    "Maintenance": "bg-gray-100 text-gray-800"
  };
  
  const statusColor = {
    "In Progress": "bg-nexus-100 text-nexus-800",
    "Not Started": "bg-gray-100 text-gray-800",
    "Completed": "bg-teal-100 text-teal-800",
    "On Hold": "bg-orange-100 text-orange-800"
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track your active projects.</p>
        </div>
        
        <Button onClick={() => navigate("/projects/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredProjects.length > 0 ? (
            <div className="grid gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <CardDescription className="mt-1">{project.description}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={phaseColor[project.phase]}>
                          {project.phase}
                        </Badge>
                        <Badge variant="outline" className={statusColor[project.status]}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline">
                          {project.team}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {project.startDate} - {project.endDate}
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="mr-1 h-4 w-4" />
                      {project.members} team members
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <Layers className="h-4 w-4" />
              <AlertDescription>
                No projects found matching your search. Try adjusting your filters or create a new project.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        
        <TabsContent value="discovery">
          <div className="grid gap-4">
            {filteredProjects
              .filter(proj => proj.phase === "Discovery")
              .map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <CardDescription className="mt-1">{project.description}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={phaseColor[project.phase]}>
                          {project.phase}
                        </Badge>
                        <Badge variant="outline" className={statusColor[project.status]}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline">
                          {project.team}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {project.startDate} - {project.endDate}
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="mr-1 h-4 w-4" />
                      {project.members} team members
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="planning">
          <div className="grid gap-4">
            {filteredProjects
              .filter(proj => proj.phase === "Planning")
              .map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <CardDescription className="mt-1">{project.description}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={phaseColor[project.phase]}>
                          {project.phase}
                        </Badge>
                        <Badge variant="outline" className={statusColor[project.status]}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline">
                          {project.team}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {project.startDate} - {project.endDate}
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="mr-1 h-4 w-4" />
                      {project.members} team members
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="implementation">
          <div className="grid gap-4">
            {filteredProjects
              .filter(proj => proj.phase === "Implementation")
              .map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <CardDescription className="mt-1">{project.description}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={phaseColor[project.phase]}>
                          {project.phase}
                        </Badge>
                        <Badge variant="outline" className={statusColor[project.status]}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline">
                          {project.team}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {project.startDate} - {project.endDate}
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="mr-1 h-4 w-4" />
                      {project.members} team members
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <div className="grid gap-4">
            {filteredProjects
              .filter(proj => proj.phase === "Maintenance")
              .map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <CardDescription className="mt-1">{project.description}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={phaseColor[project.phase]}>
                          {project.phase}
                        </Badge>
                        <Badge variant="outline" className={statusColor[project.status]}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline">
                          {project.team}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {project.startDate} - {project.endDate}
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="mr-1 h-4 w-4" />
                      {project.members} team members
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
