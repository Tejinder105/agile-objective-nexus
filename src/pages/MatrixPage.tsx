
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function MatrixPage() {
  const navigate = useNavigate();
  const [view, setView] = useState("objectives");
  
  // Example data
  const objectives = [
    {
      id: 1,
      title: "Launch v1 of Product",
      impact: "high",
      effort: "high",
      priority: "High",
      category: "Product"
    },
    {
      id: 2,
      title: "Increase Customer Retention",
      impact: "high",
      effort: "low",
      priority: "Medium",
      category: "Customer"
    },
    {
      id: 3,
      title: "Reduce Development Cycle",
      impact: "high",
      effort: "low",
      priority: "High",
      category: "Engineering"
    },
    {
      id: 4,
      title: "Expand Market Reach",
      impact: "high",
      effort: "high",
      priority: "Medium",
      category: "Marketing"
    },
    {
      id: 5,
      title: "Implement New Billing System",
      impact: "low",
      effort: "low",
      priority: "Medium",
      category: "Finance"
    },
    {
      id: 6,
      title: "Office Relocation",
      impact: "low",
      effort: "high",
      priority: "Low",
      category: "Operations"
    },
    {
      id: 7,
      title: "Team Training Sessions",
      impact: "low",
      effort: "low",
      priority: "Low",
      category: "People"
    },
  ];
  
  const projects = [
    {
      id: 101,
      title: "User Research",
      impact: "high",
      effort: "low",
      phase: "Discovery",
      team: "UX"
    },
    {
      id: 102,
      title: "Feature Development",
      impact: "high",
      effort: "high",
      phase: "Implementation",
      team: "Engineering"
    },
    {
      id: 103,
      title: "Marketing Campaign",
      impact: "high",
      effort: "high",
      phase: "Planning",
      team: "Marketing"
    },
    {
      id: 104,
      title: "Partner Integration",
      impact: "low",
      effort: "high",
      phase: "Implementation",
      team: "Product"
    },
    {
      id: 105,
      title: "Bug Fixes",
      impact: "low",
      effort: "low",
      phase: "Maintenance",
      team: "Engineering"
    },
  ];
  
  const items = view === "objectives" ? objectives : projects;
  
  const filterByQuadrant = (impact, effort) => {
    return items.filter(
      item => item.impact === impact && item.effort === effort
    );
  };
  
  const highImpactLowEffort = filterByQuadrant("high", "low");
  const highImpactHighEffort = filterByQuadrant("high", "high");
  const lowImpactLowEffort = filterByQuadrant("low", "low");
  const lowImpactHighEffort = filterByQuadrant("low", "high");
  
  const renderItem = (item) => {
    if (view === "objectives") {
      const priorityColor = {
        High: "text-red-500 bg-red-50",
        Medium: "text-amber-500 bg-amber-50",
        Low: "text-emerald-500 bg-emerald-50"
      };
      
      return (
        <Card key={item.id} className="mb-2 last:mb-0">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className={priorityColor[item.priority]}>
                {item.priority}
              </Badge>
              <Badge variant="outline">{item.category}</Badge>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card key={item.id} className="mb-2 last:mb-0">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline">{item.phase}</Badge>
              <Badge variant="outline">{item.team}</Badge>
            </div>
          </CardContent>
        </Card>
      );
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prioritization Matrix</h1>
          <p className="text-muted-foreground">Visualize and prioritize your work based on impact and effort.</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="objectives">Objectives</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button onClick={() => navigate(`/${view}/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            New {view === "objectives" ? "Objective" : "Project"}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matrix">Matrix View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Impact / Effort Matrix</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <p className="font-medium mb-2">How to use the matrix:</p>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Top Right (High Impact, High Effort):</strong> Strategic initiatives, plan carefully</li>
                        <li>• <strong>Top Left (High Impact, Low Effort):</strong> Quick wins, do these first</li>
                        <li>• <strong>Bottom Left (Low Impact, Low Effort):</strong> Fill-ins, do if time permits</li>
                        <li>• <strong>Bottom Right (Low Impact, High Effort):</strong> Time sinks, avoid or minimize</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>
                Prioritize your {view} based on their impact and the effort required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid-matrix">
                <span className="grid-matrix-label left-1/2 -translate-x-1/2 top-0">High Impact</span>
                <span className="grid-matrix-label left-1/2 -translate-x-1/2 bottom-0">Low Impact</span>
                <span className="grid-matrix-label top-1/2 -translate-y-1/2 left-0 -rotate-90">Low Effort</span>
                <span className="grid-matrix-label top-1/2 -translate-y-1/2 right-0 rotate-90">High Effort</span>
                
                <div className="grid-matrix-quadrant high-impact low-effort">
                  <h3 className="font-medium mb-2 text-teal-700">Quick Wins</h3>
                  <div className="overflow-y-auto flex-grow">
                    {highImpactLowEffort.length > 0 ? (
                      highImpactLowEffort.map(renderItem)
                    ) : (
                      <p className="text-sm text-muted-foreground">No items in this quadrant</p>
                    )}
                  </div>
                </div>
                
                <div className="grid-matrix-quadrant high-impact high-effort">
                  <h3 className="font-medium mb-2 text-nexus-700">Major Projects</h3>
                  <div className="overflow-y-auto flex-grow">
                    {highImpactHighEffort.length > 0 ? (
                      highImpactHighEffort.map(renderItem)
                    ) : (
                      <p className="text-sm text-muted-foreground">No items in this quadrant</p>
                    )}
                  </div>
                </div>
                
                <div className="grid-matrix-quadrant low-impact low-effort">
                  <h3 className="font-medium mb-2">Fill-ins</h3>
                  <div className="overflow-y-auto flex-grow">
                    {lowImpactLowEffort.length > 0 ? (
                      lowImpactLowEffort.map(renderItem)
                    ) : (
                      <p className="text-sm text-muted-foreground">No items in this quadrant</p>
                    )}
                  </div>
                </div>
                
                <div className="grid-matrix-quadrant low-impact high-effort">
                  <h3 className="font-medium mb-2 text-orange-700">Thankless Tasks</h3>
                  <div className="overflow-y-auto flex-grow">
                    {lowImpactHighEffort.length > 0 ? (
                      lowImpactHighEffort.map(renderItem)
                    ) : (
                      <p className="text-sm text-muted-foreground">No items in this quadrant</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Prioritized List</CardTitle>
              <CardDescription>
                View all {view} ordered by their priority score.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid">
                  {items.length > 0 ? (
                    <>
                      {/* High Impact, Low Effort */}
                      {highImpactLowEffort.length > 0 && (
                        <>
                          <h3 className="font-medium text-teal-700 mt-4 mb-2">Quick Wins (High Impact, Low Effort)</h3>
                          <div className="space-y-2">
                            {highImpactLowEffort.map(renderItem)}
                          </div>
                        </>
                      )}
                      
                      {/* High Impact, High Effort */}
                      {highImpactHighEffort.length > 0 && (
                        <>
                          <h3 className="font-medium text-nexus-700 mt-4 mb-2">Major Projects (High Impact, High Effort)</h3>
                          <div className="space-y-2">
                            {highImpactHighEffort.map(renderItem)}
                          </div>
                        </>
                      )}
                      
                      {/* Low Impact, Low Effort */}
                      {lowImpactLowEffort.length > 0 && (
                        <>
                          <h3 className="font-medium mt-4 mb-2">Fill-ins (Low Impact, Low Effort)</h3>
                          <div className="space-y-2">
                            {lowImpactLowEffort.map(renderItem)}
                          </div>
                        </>
                      )}
                      
                      {/* Low Impact, High Effort */}
                      {lowImpactHighEffort.length > 0 && (
                        <>
                          <h3 className="font-medium text-orange-700 mt-4 mb-2">Thankless Tasks (Low Impact, High Effort)</h3>
                          <div className="space-y-2">
                            {lowImpactHighEffort.map(renderItem)}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No {view} available. Create a new {view === "objectives" ? "objective" : "project"} to get started.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
