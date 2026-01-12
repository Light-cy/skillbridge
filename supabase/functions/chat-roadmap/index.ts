import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roadmapContent, careerPathName, expertiseLevel, messages, userId } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's progress history for context
    let userProgressContext = "";
    if (userId) {
      const { data: userProgress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(15);

      if (userProgress && userProgress.length > 0) {
        userProgressContext = "\n\n## Student's Tracked Progress:\n";
        const skills = userProgress.filter(p => p.progress_type === 'skill_learned');
        const projects = userProgress.filter(p => p.progress_type === 'project_completed');
        const milestones = userProgress.filter(p => p.progress_type === 'milestone_reached');

        if (skills.length > 0) {
          userProgressContext += `- Skills: ${skills.map(s => s.title).join(", ")}\n`;
        }
        if (projects.length > 0) {
          userProgressContext += `- Projects: ${projects.map(p => p.title).join(", ")}\n`;
        }
        if (milestones.length > 0) {
          userProgressContext += `- Milestones: ${milestones.map(m => m.title).join(", ")}\n`;
        }
      }
    }

    const expertiseLevelLabels: Record<string, string> = {
      complete_beginner: 'Complete Beginner',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    };

    const systemPrompt = `You are a friendly and knowledgeable career advisor helping a student understand their personalized career roadmap. You have full context of their roadmap AND their tracked progress.

## Context
- **Career Path**: ${careerPathName}
- **Student's Expertise Level**: ${expertiseLevelLabels[expertiseLevel] || expertiseLevel}
${userProgressContext}

## Generated Roadmap
${roadmapContent}

## Your Role
1. Answer questions specifically about this roadmap
2. Explain any step, skill, or project in more detail when asked
3. Suggest alternatives if the student has constraints (time, resources)
4. Provide encouragement and practical advice
5. Reference specific parts of the roadmap when relevant ("In the section about...")
6. **Acknowledge their existing progress** - if they've already learned skills or completed projects related to the roadmap, mention that
7. Keep responses helpful, specific, and actionable

## Guidelines
- Be conversational and supportive
- If asked about something outside the roadmap, relate it back to their career path
- Provide concrete examples and resources when helpful
- Keep responses focused but thorough
- When they mention completing something, suggest adding it to their progress tracker`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Chat roadmap error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
