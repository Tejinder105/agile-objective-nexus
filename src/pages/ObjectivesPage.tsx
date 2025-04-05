import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronRight, Clock, Filter, Plus, Search, Target, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function ObjectivesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const objectives = [
    {
      id: 1,
      title: "Launch v1 of Product",
      description: "Complete the development and launch of the first version of our product",
      progress: 65,
      dueDate: "Apr 15, 2025",
      category: "Product",
      priority: "High",
      status: "In Progress",
      tags: ["launch", "milestone", "product"]
    },
    {
      id: 2,
      title: "Increase Customer Retention",
      description: "Boost customer retention rate by 15% through improved onboarding experience",
      progress: 30,
      dueDate: "May 20, 2025",
      category: "Customer",
      priority: "Medium",
      status: "In Progress",
      tags: ["retention", "customer", "growth"]
    },
    {
      id: 3,
      title: "Reduce Development Cycle",
      description: "Optimize the development workflow to reduce cycle time by 20%",
      progress: 80,
      dueDate: "Apr 30, 2025",
      category: "Engineering",
      priority: "High",
      status: "In Progress",
      tags: ["process", "engineering", "efficiency"]
    },
    {
      id: 4,
      title: "Expand Market Reach",
      description: "Enter two new market segments through strategic partnerships",
      progress: 10,
      dueDate: "Jun 30, 2025",
      category: "Marketing",
      priority: "Medium",
      status: "Not Started",
      tags: ["growth", "market", "partnerships"]
    },
    {
      id: 5,
      title: "Implement New Billing System",
      description: "Roll out the updated billing system with advanced analytics",
      progress: 100,
      dueDate: "Mar 10, 2025",
      category: "Finance",
      priority: "Medium",
      status: "Completed",
      tags: ["finance", "system", "analytics"]
    }
  ];
  
  const filteredObjectives = objectives.filter(objective => 
    objective.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    objective.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    objective.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const priorityColor = {
    High: "text-red-500 bg-red-50",
    Medium: "text-amber-500 bg-amber-50",
    Low: "text-emerald-500 bg-emerald-50"
  };
  
  const statusColor = {
    "In Progress": "bg-nexus-100 text-nexus-800",
    "Not Started": "bg-gray-100 text-gray-800",
    "Completed": "bg-teal-100 text-teal-800"
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Objectives</h1>
          <p className="text-muted-foreground">Track and manage your strategic objectives.</p>
        </div>
        
        <Button onClick={() => navigate("/objectives/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Objective
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search objectives..."
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
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredObjectives.length > 0 ? (
            <div className="grid gap-4">
              {filteredObjectives.map((objective) => (
                <Card key={objective.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{objective.title}</CardTitle>
                        <CardDescription className="mt-1">{objective.description}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/objectives/${objective.id}`)}
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
                          <span className="font-medium">{objective.progress}%</span>
                        </div>
                        <Progress value={objective.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={statusColor[objective.status]}>
                          {objective.status}
                        </Badge>
                        <Badge variant="outline" className={priorityColor[objective.priority]}>
                          {objective.priority} Priority
                        </Badge>
                        <Badge variant="outline">
                          {objective.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      Due: {objective.dueDate}
                    </div>
                    
                    <div className="flex gap-2">
                      {objective.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                No objectives found matching your search. Try adjusting your filters or create a new objective.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress">
          <div className="grid gap-4">
            {filteredObjectives
              .filter(obj => obj.status === "In Progress")
              .map((objective) => (
                <Card key={objective.id}>
                  {/* Same card content as above */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{objective.title}</CardTitle>
                        <CardDescription className="mt-1">{objective.description}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/objectives/${objective.id}`)}
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
                          <span className="font-medium">{objective.progress}%</span>
                        </div>
                        <Progress value={objective.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={statusColor[objective.status]}>
                          {objective.status}
                        </Badge>
                        <Badge variant="outline" className={priorityColor[objective.priority]}>
                          {objective.priority} Priority
                        </Badge>
                        <Badge variant="outline">
                          {objective.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      Due: {objective.dueDate}
                    </div>
                    
                    <div className="flex gap-2">
                      {objective.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        {/* Other tabs content similar to above */}
        <TabsContent value="not-started">
          <div className="grid gap-4">
            {filteredObjectives
              .filter(obj => obj.status === "Not Started")
              .map((objective) => (
                <Card key={objective.id}>
                  {/* Same card content as above */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{objective.title}</CardTitle>
                        <CardDescription className="mt-1">{objective.description}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/objectives/${objective.id}`)}
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
                          <span className="font-medium">{objective.progress}%</span>
                        </div>
                        <Progress value={objective.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={statusColor[objective.status]}>
                          {objective.status}
                        </Badge>
                        <Badge variant="outline" className={priorityColor[objective.priority]}>
                          {objective.priority} Priority
                        </Badge>
                        <Badge variant="outline">
                          {objective.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      Due: {objective.dueDate}
                    </div>
                    
                    <div className="flex gap-2">
                      {objective.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="grid gap-4">
            {filteredObjectives
              .filter(obj => obj.status === "Completed")
              .map((objective) => (
                <Card key={objective.id}>
                  {/* Same card content as above */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{objective.title}</CardTitle>
                        <CardDescription className="mt-1">{objective.description}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/objectives/${objective.id}`)}
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
                          <span className="font-medium">{objective.progress}%</span>
                        </div>
                        <Progress value={objective.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={statusColor[objective.status]}>
                          {objective.status}
                        </Badge>
                        <Badge variant="outline" className={priorityColor[objective.priority]}>
                          {objective.priority} Priority
                        </Badge>
                        <Badge variant="outline">
                          {objective.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      Due: {objective.dueDate}
                    </div>
                    
                    <div className="flex gap-2">
                      {objective.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
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
