import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userProfile, userId, type = "chat" } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // RAG: Retrieve relevant context based on user profile and query
    let ragContext = "";
    
    // Get career paths
    const { data: careerPaths } = await supabase
      .from("career_paths")
      .select("*");
    
    // Get electives
    const { data: electives } = await supabase
      .from("electives")
      .select("*");
    
    // Get alumni stories
    const { data: alumni } = await supabase
      .from("alumni")
      .select("*");

    // Get user's progress history
    let userProgressContext = "";
    if (userId) {
      const { data: userProgress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(20);

      if (userProgress && userProgress.length > 0) {
        userProgressContext = "\n\n## USER'S ACCOMPLISHMENTS AND PROGRESS:\n";
        const skillsLearned = userProgress.filter(p => p.progress_type === 'skill_learned');
        const projectsCompleted = userProgress.filter(p => p.progress_type === 'project_completed');
        const milestonesReached = userProgress.filter(p => p.progress_type === 'milestone_reached');
        const goalsSet = userProgress.filter(p => p.progress_type === 'goal_set');
        const roadmapsStarted = userProgress.filter(p => p.progress_type === 'roadmap_started');

        if (skillsLearned.length > 0) {
          userProgressContext += `- Skills Learned: ${skillsLearned.map(s => s.title).join(", ")}\n`;
        }
        if (projectsCompleted.length > 0) {
          userProgressContext += `- Projects Completed: ${projectsCompleted.map(p => p.title).join(", ")}\n`;
        }
        if (milestonesReached.length > 0) {
          userProgressContext += `- Milestones Reached: ${milestonesReached.map(m => m.title).join(", ")}\n`;
        }
        if (goalsSet.length > 0) {
          userProgressContext += `- Current Goals: ${goalsSet.map(g => g.title).join(", ")}\n`;
        }
        if (roadmapsStarted.length > 0) {
          userProgressContext += `- Career Roadmaps Started: ${roadmapsStarted.map(r => r.title).join(", ")}\n`;
        }
      }

      // Get user's saved roadmaps
      const { data: savedRoadmaps } = await supabase
        .from("user_roadmaps")
        .select("expertise_level, career_paths(name)")
        .eq("user_id", userId)
        .limit(5);

      if (savedRoadmaps && savedRoadmaps.length > 0) {
        userProgressContext += `\n- Saved Career Roadmaps: ${savedRoadmaps.map(r => `${(r.career_paths as any)?.name || 'Unknown'} (${r.expertise_level})`).join(", ")}\n`;
      }

      // Get user's selected electives
      const { data: userElectives } = await supabase
        .from("user_electives")
        .select("status, electives(name, code)")
        .eq("user_id", userId)
        .limit(10);

      if (userElectives && userElectives.length > 0) {
        userProgressContext += `- Selected Electives: ${userElectives.map(e => `${(e.electives as any)?.name || 'Unknown'} (${e.status})`).join(", ")}\n`;
      }
    }

    // Build RAG context
    if (careerPaths) {
      ragContext += "\n\n## CAREER PATHS DATA:\n";
      careerPaths.forEach(cp => {
        ragContext += `- ${cp.name}: ${cp.description}. Required skills: ${cp.required_skills?.join(", ")}. Salary: ${cp.avg_salary_range}. Growth: ${cp.growth_outlook}\n`;
      });
    }

    if (electives) {
      ragContext += "\n\n## ELECTIVES DATA:\n";
      electives.forEach(el => {
        ragContext += `- ${el.code} ${el.name}: ${el.description}. Skills gained: ${el.skills_gained?.join(", ")}. Recommended semester: ${el.recommended_semester}\n`;
      });
    }

    if (alumni) {
      ragContext += "\n\n## ALUMNI STORIES:\n";
      alumni.forEach(al => {
        ragContext += `- ${al.name} (${al.job_title} at ${al.company}, Class of ${al.graduation_year}): "${al.story}" Advice: "${al.advice_quote}" Struggles: ${al.struggles_faced}\n`;
      });
    }

    // Semester-aware guidance rules
    const semesterGuidance = {
      early: `
FOR EARLY-STAGE STUDENTS (Semester 1-2):
- Do NOT push a single rigid career path
- Suggest exploration and small experiments
- Show reassurance and normalize confusion
- Reference alumni who were also confused early on
- Encourage trying clubs, projects, and different courses
- Keep tone supportive and non-pressuring`,
      mid: `
FOR MID-STAGE STUDENTS (Semester 3-4):
- Focus on skill gaps and domain narrowing
- Recommend specific electives aligned with interests
- Help identify 2-3 potential career directions
- Encourage internships and practical experience
- Be more direct about skill requirements`,
      final: `
FOR FINAL-STAGE STUDENTS (Semester 5+):
- Focus on job-readiness and portfolio building
- Provide specific actionable steps
- Discuss interview prep and specialization
- Be direct about market expectations
- Help with resume and project highlights`
    };

    const userSemesterBucket = userProfile?.semester_bucket || "early";
    const guidanceRules = semesterGuidance[userSemesterBucket as keyof typeof semesterGuidance];

    // Build system prompt with RAG context
    const systemPrompt = `You are the Skill Bridge AI Career Guide - a supportive, knowledgeable advisor helping university students navigate career confusion.

## YOUR CORE PRINCIPLES:
1. Ground all advice in the retrieved data below - cite specific career paths, electives, and alumni stories
2. Be semester-aware - adapt your tone and advice based on where the student is in their journey
3. Be non-clinical - if a student expresses severe mental health concerns, gently suggest professional help
4. Never give generic advice - always personalize based on their profile and the data
5. **IMPORTANT**: You have full visibility of the student's progress history. Reference their past accomplishments to provide continuity and personalized advice.

## USER PROFILE:
- Semester: ${userProfile?.semester_number || "Unknown"} (${userSemesterBucket} stage)
- Career Clarity: ${userProfile?.career_clarity || "Unknown"}
- Work Style: ${userProfile?.work_style || "Unknown"}
- Main Struggle: ${userProfile?.primary_struggle || "Unknown"}
- Stress Level: ${userProfile?.stress_level || "Unknown"}
${userProgressContext}

## SEMESTER-SPECIFIC GUIDANCE:
${guidanceRules}

## RETRIEVED KNOWLEDGE BASE:
${ragContext}

## RESPONSE FORMAT:
- Keep responses concise but helpful (max 300 words)
- When citing data, mention the source naturally (e.g., "Based on Sarah Chen's experience at Google...")
- **Reference the student's progress when relevant** (e.g., "Since you've already completed X project...")
- End with a clear, actionable next step
- Use encouraging but realistic tone
- If the student mentions an achievement, suggest they add it to their progress tracker

## SAFETY:
- If user expresses severe distress, acknowledge their feelings and gently suggest: "While I'm here to help with career guidance, for mental health support, please consider reaching out to a counselor or support service."
- Never diagnose or provide medical/therapy advice`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});