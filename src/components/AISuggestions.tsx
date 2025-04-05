
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BookOpen, Calendar, BarChart, FileSearch, Database, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AISuggestionsProps {
  objectiveTitle: string;
  objectiveDescription?: string;
}

export function AISuggestions({ objectiveTitle, objectiveDescription }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [research, setResearch] = useState<string | null>(null);
  const [feasibility, setFeasibility] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [resources, setResources] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<string>("actions");
  
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingResearch, setIsLoadingResearch] = useState(false);
  const [isLoadingFeasibility, setIsLoadingFeasibility] = useState(false);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);

  const fetchAIContent = async (requestType: 'suggestions' | 'research' | 'feasibility' | 'timeline' | 'resources') => {
    try {
      let setLoadingState;
      let setContentState;
      
      switch (requestType) {
        case 'suggestions':
          setLoadingState = setIsLoadingSuggestions;
          setContentState = setSuggestions;
          break;
        case 'research':
          setLoadingState = setIsLoadingResearch;
          setContentState = setResearch;
          break;
        case 'feasibility':
          setLoadingState = setIsLoadingFeasibility;
          setContentState = setFeasibility;
          break;
        case 'timeline':
          setLoadingState = setIsLoadingTimeline;
          setContentState = setTimeline;
          break;
        case 'resources':
          setLoadingState = setIsLoadingResources;
          setContentState = setResources;
          break;
      }
      
      setLoadingState(true);

      const { data, error } = await supabase.functions.invoke('ai-research-assistant', {
        body: {
          objectiveTitle,
          objectiveDescription,
          requestType
        }
      });

      if (error) throw error;
      
      setContentState(data.result);
      
      // Auto-switch to the appropriate tab when content is loaded
      if (requestType === 'suggestions' || requestType === 'research') {
        setActiveTab("actions");
      } else if (requestType === 'feasibility') {
        setActiveTab("analysis");
      } else if (requestType === 'timeline' || requestType === 'resources') {
        setActiveTab("planning");
      }
      
    } catch (error) {
      console.error(`Error fetching AI ${requestType}:`, error);
      toast({
        title: "Error",
        description: `Failed to get AI ${requestType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      switch (requestType) {
        case 'suggestions':
          setIsLoadingSuggestions(false);
          break;
        case 'research':
          setIsLoadingResearch(false);
          break;
        case 'feasibility':
          setIsLoadingFeasibility(false);
          break;
        case 'timeline':
          setIsLoadingTimeline(false);
          break;
        case 'resources':
          setIsLoadingResources(false);
          break;
      }
    }
  };

  const formatBulletPoints = (text: string | null) => {
    if (!text) return null;
    
    // Convert the text to JSX with proper bullet points
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return null;
      return <p key={index} className="mt-2">{line}</p>;
    });
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-medium">Research Project Assistant</h3>
      <p className="text-sm text-muted-foreground">Use AI to help plan and research your objective</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <Button 
          onClick={() => fetchAIContent('suggestions')} 
          disabled={isLoadingSuggestions || !objectiveTitle}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          {isLoadingSuggestions ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="h-4 w-4" />
          )}
          Actionable Suggestions
        </Button>
        
        <Button 
          onClick={() => fetchAIContent('research')} 
          disabled={isLoadingResearch || !objectiveTitle}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          {isLoadingResearch ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BookOpen className="h-4 w-4" />
          )}
          Research Insights
        </Button>
        
        <Button 
          onClick={() => fetchAIContent('feasibility')} 
          disabled={isLoadingFeasibility || !objectiveTitle}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          {isLoadingFeasibility ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BarChart className="h-4 w-4" />
          )}
          Feasibility Analysis
        </Button>
        
        <Button 
          onClick={() => fetchAIContent('timeline')} 
          disabled={isLoadingTimeline || !objectiveTitle}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          {isLoadingTimeline ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Calendar className="h-4 w-4" />
          )}
          Timeline Estimation
        </Button>
        
        <Button 
          onClick={() => fetchAIContent('resources')} 
          disabled={isLoadingResources || !objectiveTitle}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          {isLoadingResources ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Database className="h-4 w-4" />
          )}
          Resource Requirements
        </Button>
      </div>

      {(suggestions || research || feasibility || timeline || resources) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="actions">Actions & Research</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="actions" className="space-y-4">
            {suggestions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Actionable Suggestions
                  </CardTitle>
                  <CardDescription>
                    Here are some suggestions for your objective
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {formatBulletPoints(suggestions)}
                  </div>
                </CardContent>
              </Card>
            )}

            {research && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Research Insights
                  </CardTitle>
                  <CardDescription>
                    Helpful information for achieving your objective
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {formatBulletPoints(research)}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="analysis">
            {feasibility && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-purple-500" />
                    Feasibility Analysis
                  </CardTitle>
                  <CardDescription>
                    Assessment of time, resources, and potential impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {formatBulletPoints(feasibility)}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="planning" className="space-y-4">
            {timeline && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    Suggested Timeline
                  </CardTitle>
                  <CardDescription>
                    Phases and time estimates for your research project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {formatBulletPoints(timeline)}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {resources && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-5 w-5 text-orange-500" />
                    Resource Requirements
                  </CardTitle>
                  <CardDescription>
                    Key resources needed for successful implementation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {formatBulletPoints(resources)}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
