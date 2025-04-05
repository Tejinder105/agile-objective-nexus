
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { objectiveTitle, objectiveDescription, requestType } = await req.json();

    let prompt = '';
    if (requestType === 'suggestions') {
      prompt = `Based on this objective: "${objectiveTitle}" ${objectiveDescription ? `with description: "${objectiveDescription}"` : ''}, 
      provide 3 specific, actionable suggestions for making progress on this objective. 
      Format each suggestion as a brief bullet point with a concrete action.`;
    } else if (requestType === 'research') {
      prompt = `Research relevant information for this objective: "${objectiveTitle}" ${objectiveDescription ? `with description: "${objectiveDescription}"` : ''}. 
      Provide 3-5 key facts or insights that would be helpful for achieving this objective.
      Format as brief, informative bullet points.`;
    } else if (requestType === 'feasibility') {
      prompt = `Analyze the feasibility of this research project: "${objectiveTitle}" ${objectiveDescription ? `with description: "${objectiveDescription}"` : ''}. 
      Consider time, resources, and potential impact. Provide an assessment on a scale of 1-10, followed by 2-3 bullet points explaining your reasoning.`;
    } else if (requestType === 'timeline') {
      prompt = `Create a suggested timeline for the research project: "${objectiveTitle}" ${objectiveDescription ? `with description: "${objectiveDescription}"` : ''}. 
      Break down the project into 3-4 phases with approximate time estimates for each phase.`;
    } else if (requestType === 'resources') {
      prompt = `Recommend resources needed for this research project: "${objectiveTitle}" ${objectiveDescription ? `with description: "${objectiveDescription}"` : ''}. 
      List 3-4 key resources (human expertise, tools, technologies, datasets) that would be essential for success.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that provides research and suggestions for objectives and projects.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ result: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-research-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
