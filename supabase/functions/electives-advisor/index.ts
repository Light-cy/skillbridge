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
    const { userProfile, selectedElectives, targetSemester, careerGoal, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Retrieve all data for RAG
    const { data: careerPaths } = await supabase
      .from("career_paths")
      .select("*");
    
    const { data: allElectives } = await supabase
      .from("electives")
      .select("*");
    
    const { data: alumni } = await supabase
      .from("alumni")
      .select("*");

    // Get user's progress for context
    let userProgressContext = "";
    if (userId) {
      const { data: userProgress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(10);

      if (userProgress && userProgress.length > 0) {
        const skills = userProgress.filter(p => p.progress_type === 'skill_learned');
        if (skills.length > 0) {
          userProgressContext = `\nStudent's Skills Already Learned: ${skills.map(s => s.title).join(", ")}`;
        }
      }
    }

    // Find the target career path
    const targetCareer = careerPaths?.find(cp => cp.id === careerGoal || cp.name.toLowerCase().includes(careerGoal?.toLowerCase() || ""));

    // Build context
    let context = `## TARGET CAREER PATH:\n`;
    if (targetCareer) {
      context += `${targetCareer.name}: ${targetCareer.description}\nRequired Skills: ${targetCareer.required_skills?.join(", ")}\n\n`;
    }

    context += `## ALL AVAILABLE ELECTIVES:\n`;
    allElectives?.forEach(el => {
      context += `- ${el.code} "${el.name}": ${el.description}. Skills: ${el.skills_gained?.join(", ")}. Relevance Score: ${el.relevance_score}. Recommended Semester: ${el.recommended_semester}\n`;
    });

    context += `\n## ELECTIVES USER IS CONSIDERING:\n`;
    selectedElectives?.forEach((el: string) => {
      context += `- ${el}\n`;
    });

    context += `\n## RELEVANT ALUMNI INSIGHTS:\n`;
    const relevantAlumni = alumni?.filter(a => a.career_path_id === targetCareer?.id);
    relevantAlumni?.forEach(al => {
      context += `- ${al.name} (${al.job_title}): "${al.advice_quote}"\n`;
    });

    const semesterBucket = userProfile?.semester_bucket || "mid";
    const framingGuidance = semesterBucket === "early" 
      ? "Frame recommendations with exploration and reassurance - these are suggestions to try, not commitments."
      : semesterBucket === "final"
      ? "Frame recommendations with job-readiness - focus on how these build portfolio-worthy skills."
      : "Frame recommendations with skill-building focus - help them narrow their domain.";

    const systemPrompt = `You are the Skill Bridge Electives Advisor. Your job is to recommend the BEST electives for a student based on their career goals and existing progress.

## TASK:
Analyze the student's career goal, existing skills, and the electives they're considering. Return a structured recommendation.

## USER CONTEXT:
- Target Semester: ${targetSemester}
- Semester Bucket: ${semesterBucket}
- Career Goal: ${targetCareer?.name || careerGoal || "Not specified"}
${userProgressContext}

## FRAMING GUIDANCE:
${framingGuidance}

## RETRIEVED DATA:
${context}

## REQUIRED OUTPUT FORMAT (JSON):
Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "rank": 1,
      "elective_name": "Full elective name",
      "elective_code": "CS350",
      "relevance_score": 95,
      "skills_gained": ["skill1", "skill2"],
      "reasoning": "2-3 sentence explanation grounded in career path requirements and alumni insights",
      "is_best_recommended": true
    }
  ],
  "comparison_summary": "Brief 2-3 sentence explanation of why the #1 pick is best over others",
  "alumni_insight": "Relevant quote or insight from an alumni if available"
}

Return TOP 3 electives maximum. Mark only ONE as "is_best_recommended": true.`;

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
          { role: "user", content: `Please recommend the best electives for me. I'm considering: ${selectedElectives?.join(", ") || "any available electives"}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
          status: 429,
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

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    let parsedResult;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      parsedResult = JSON.parse(jsonStr);
    } catch {
      parsedResult = { 
        recommendations: [], 
        comparison_summary: content,
        error: "Could not parse structured response" 
      };
    }

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Electives advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});