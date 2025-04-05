
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BookOpen, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AISuggestionsProps {
  objectiveTitle: string;
  objectiveDescription?: string;
}

export function AISuggestions({ objectiveTitle, objectiveDescription }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [research, setResearch] = useState<string | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingResearch, setIsLoadingResearch] = useState(false);

  const fetchAIContent = async (requestType: 'suggestions' | 'research') => {
    try {
      const isLoadingSuggestionType = requestType === 'suggestions';
      
      if (isLoadingSuggestionType) {
        setIsLoadingSuggestions(true);
      } else {
        setIsLoadingResearch(true);
      }

      const { data, error } = await supabase.functions.invoke('ai-research-assistant', {
        body: {
          objectiveTitle,
          objectiveDescription,
          requestType
        }
      });

      if (error) throw error;

      if (isLoadingSuggestionType) {
        setSuggestions(data.result);
      } else {
        setResearch(data.result);
      }
    } catch (error) {
      console.error(`Error fetching AI ${requestType}:`, error);
      toast({
        title: "Error",
        description: `Failed to get AI ${requestType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      if (requestType === 'suggestions') {
        setIsLoadingSuggestions(false);
      } else {
        setIsLoadingResearch(false);
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
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => fetchAIContent('suggestions')} 
          disabled={isLoadingSuggestions || !objectiveTitle}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isLoadingSuggestions ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="h-4 w-4" />
          )}
          Get AI Suggestions
        </Button>
        
        <Button 
          onClick={() => fetchAIContent('research')} 
          disabled={isLoadingResearch || !objectiveTitle}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isLoadingResearch ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BookOpen className="h-4 w-4" />
          )}
          Research This Objective
        </Button>
      </div>

      {suggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              AI Suggestions
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
    </div>
  );
}
