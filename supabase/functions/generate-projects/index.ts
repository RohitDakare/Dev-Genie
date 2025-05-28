
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectType, interests, skills, difficulty, selectedApi } = await req.json();
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: authHeader } 
        } 
      }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log('Generating projects for user:', user.id);

    // Save/update user preferences
    const { error: prefsError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        project_type: projectType,
        interests: interests,
        skills: skills,
        difficulty: difficulty,
        preferred_api: selectedApi,
        updated_at: new Date().toISOString()
      });

    if (prefsError) {
      console.error('Error saving preferences:', prefsError);
    }

    const prompt = `Generate 15 unique and diverse project ideas based on these preferences:
    Project Type: ${projectType}
    Interests: ${interests}
    Skills: ${skills}
    Difficulty: ${difficulty}
    
    Create projects that are:
    - Practical and buildable with current technology
    - Varied in scope and complexity
    - Market-relevant and useful
    - Include both trending and evergreen concepts
    - Cover different aspects of ${projectType} development
    
    Return a JSON array with objects containing: 
    - id (unique identifier)
    - title (clear, descriptive name)
    - description (detailed 2-3 sentence explanation)
    - difficulty (must be one of: Beginner, Intermediate, Advanced)
    - tags (array of 3-5 relevant technology tags)
    - category (specific category like "Web Development", "Mobile App", "AI/ML", etc.)
    - estimatedTime (like "2-3 weeks", "1 month", etc.)
    - marketDemand (High, Medium, Low)`;

    let response;
    let content;

    if (selectedApi === "openai") {
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        content = data.choices[0].message.content;
      }
    } else if (selectedApi === "claude") {
      const claudeKey = Deno.env.get('CLAUDE_API_KEY');
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': claudeKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        content = data.content[0].text;
      }
    } else if (selectedApi === "gemini") {
      const geminiKey = Deno.env.get('GEMINI_API_KEY');
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4000,
          }
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        content = data.candidates[0].content.parts[0].text;
      }
    }

    if (content) {
      try {
        // Clean the content to extract JSON
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const cleanContent = jsonMatch ? jsonMatch[0] : content;
        const projectsData = JSON.parse(cleanContent);
        
        // Store projects in database
        const projectsToInsert = projectsData.map((project: any) => ({
          user_id: user.id,
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          tags: project.tags || [],
          category: project.category,
          api_source: selectedApi,
          estimated_time: project.estimatedTime || '2-4 weeks',
          market_demand: project.marketDemand || 'Medium'
        }));

        const { data: insertedProjects, error: insertError } = await supabase
          .from('projects')
          .insert(projectsToInsert)
          .select();

        if (insertError) {
          console.error('Error inserting projects:', insertError);
          throw insertError;
        }

        console.log('Successfully stored projects:', insertedProjects?.length);

        return new Response(JSON.stringify({ projects: insertedProjects }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Return enhanced fallback projects
        const fallbackProjects = [
          {
            user_id: user.id,
            title: "AI-Powered Personal Finance Assistant",
            description: "A comprehensive financial management platform with AI-driven insights, expense categorization, and investment recommendations.",
            difficulty: difficulty,
            tags: ["React", "Node.js", "AI/ML", "Chart.js", "MongoDB"],
            category: "Web Development",
            api_source: selectedApi,
            estimated_time: "3-4 weeks",
            market_demand: "High"
          },
          {
            user_id: user.id,
            title: "Smart Home IoT Control Hub",
            description: "Centralized dashboard for managing smart home devices with automation rules and energy monitoring capabilities.",
            difficulty: difficulty,
            tags: ["React Native", "IoT", "Node.js", "WebSocket", "SQLite"],
            category: "Mobile Development",
            api_source: selectedApi,
            estimated_time: "4-6 weeks",
            market_demand: "High"
          },
          {
            user_id: user.id,
            title: "Real-time Collaborative Code Editor",
            description: "Online code editor with real-time collaboration, syntax highlighting, and integrated version control features.",
            difficulty: difficulty,
            tags: ["WebSocket", "React", "Monaco Editor", "Git", "Docker"],
            category: "Web Development",
            api_source: selectedApi,
            estimated_time: "5-7 weeks",
            market_demand: "Medium"
          },
          // ... add 12 more diverse projects here
        ];

        const { data: fallbackInserted } = await supabase
          .from('projects')
          .insert(fallbackProjects)
          .select();

        return new Response(JSON.stringify({ projects: fallbackInserted }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error('Failed to generate projects');
  } catch (error) {
    console.error('Error generating projects:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
