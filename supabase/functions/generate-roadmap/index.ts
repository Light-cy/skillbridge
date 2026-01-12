import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { careerPathId, expertiseLevel, userProfile, userId } = await req.json();

    if (!careerPathId || !expertiseLevel) {
      return new Response(
        JSON.stringify({ error: "Career path and expertise level are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch career path details
    const { data: careerPath, error: careerError } = await supabase
      .from("career_paths")
      .select("*")
      .eq("id", careerPathId)
      .single();

    if (careerError || !careerPath) {
      return new Response(
        JSON.stringify({ error: "Career path not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch related electives
    const { data: electives } = await supabase
      .from("electives")
      .select("*")
      .contains("career_path_ids", [careerPathId]);

    // Fetch alumni in this career path
    const { data: alumni } = await supabase
      .from("alumni")
      .select("name, job_title, company, advice_quote")
      .eq("career_path_id", careerPathId)
      .limit(3);

    // Get user's progress for personalized roadmap
    let userProgressContext = "";
    if (userId) {
      const { data: userProgress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(15);

      if (userProgress && userProgress.length > 0) {
        const skills = userProgress.filter(p => p.progress_type === 'skill_learned');
        const projects = userProgress.filter(p => p.progress_type === 'project_completed');

        if (skills.length > 0 || projects.length > 0) {
          userProgressContext = "\n\n**Student's Existing Progress:**\n";
          if (skills.length > 0) {
            userProgressContext += `- Skills already learned: ${skills.map(s => s.title).join(", ")}\n`;
          }
          if (projects.length > 0) {
            userProgressContext += `- Projects completed: ${projects.map(p => p.title).join(", ")}\n`;
          }
          userProgressContext += "\n*Take this progress into account when creating the roadmap - skip skills they already have and build on their existing knowledge.*";
        }
      }
    }

    const expertiseLevelDescriptions: Record<string, string> = {
      complete_beginner: "has no experience in this field and is starting from scratch",
      beginner: "knows the basics but hasn't built anything significant yet",
      intermediate: "has some projects and fundamental knowledge in this area",
      advanced: "is already proficient and looking to specialize further"
    };

    const semesterContext = userProfile?.semester_bucket 
      ? `They are in their ${userProfile.semester_bucket} semesters (semester ${userProfile.semester_number || 'unknown'}).`
      : "";

    const electivesList = electives?.map(e => `- ${e.name} (${e.code}): ${e.description}`).join("\n") || "No specific electives available";
    
    const alumniInsights = alumni?.map(a => 
      `- ${a.name} (${a.job_title} at ${a.company}): "${a.advice_quote}"`
    ).join("\n") || "No alumni insights available";

    const systemPrompt = `You are a career guidance expert specializing in helping students navigate their educational and professional journeys. You provide actionable, semester-by-semester roadmaps tailored to each student's current expertise level. Be encouraging but realistic. Use markdown formatting for clear structure.`;

    const userPrompt = `Create a personalized career roadmap for a student pursuing: **${careerPath.name}**

**Career Details:**
- Description: ${careerPath.description}
- Required Skills: ${careerPath.required_skills?.join(", ") || "Various technical skills"}
- Difficulty Level: ${careerPath.difficulty_level || "Moderate"}
- Salary Range: ${careerPath.avg_salary_range || "Competitive"}
- Growth Outlook: ${careerPath.growth_outlook || "Positive"}

**Student Profile:**
- Current Expertise: The student ${expertiseLevelDescriptions[expertiseLevel]}
${semesterContext}
${userProfile?.career_clarity ? `- Career Clarity: ${userProfile.career_clarity}` : ""}
${userProfile?.work_style ? `- Preferred Work Style: ${userProfile.work_style}` : ""}

**Available Electives:**
${electivesList}

**Alumni Success Stories:**
${alumniInsights}

Please provide a comprehensive roadmap with:

1. **Current Position Assessment** - Brief evaluation of where they stand based on their expertise level

2. **Skills Gap Analysis** - Key skills they need to develop, prioritized by importance

3. **Semester-by-Semester Roadmap** - Specific milestones and goals for each upcoming semester (adapt complexity based on expertise level)

4. **Recommended Electives** - Which available electives they should take and when

5. **Project Ideas** - 3-5 hands-on projects appropriate for their level that will build their portfolio

6. **Resources & Next Steps** - Learning platforms, communities, certifications, and immediate action items

Make the roadmap specific to their ${expertiseLevel.replace("_", " ")} level - ${expertiseLevel === "complete_beginner" ? "focus on fundamentals and building confidence" : expertiseLevel === "beginner" ? "emphasize practical skills and first meaningful projects" : expertiseLevel === "intermediate" ? "focus on deepening expertise and building a strong portfolio" : "concentrate on specialization, leadership, and job market preparation"}.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Generate roadmap error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
