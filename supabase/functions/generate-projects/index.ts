
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

    const prompt = `Generate 3 unique project ideas based on these preferences:
    Project Type: ${projectType}
    Interests: ${interests}
    Skills: ${skills}
    Difficulty: ${difficulty}
    
    Return a JSON array with objects containing: id, title, description, difficulty, tags (array), category`;

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
          model: 'gpt-4o-mini',
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
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        content = data.content[0].text;
      }
    } else if (selectedApi === "gemini") {
      const geminiKey = Deno.env.get('GEMINI_API_KEY');
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        content = data.candidates[0].content.parts[0].text;
      }
    }

    if (content) {
      try {
        const projectsData = JSON.parse(content);
        
        // Store projects in database
        const projectsToInsert = projectsData.map((project: any) => ({
          user_id: user.id,
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          tags: project.tags || [],
          category: project.category,
          api_source: selectedApi
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
        // Return fallback projects and store them
        const fallbackProjects = [
          {
            user_id: user.id,
            title: "Personal Finance Tracker",
            description: "A web application to track expenses, income, and budget planning with data visualization.",
            difficulty: difficulty,
            tags: ["React", "Chart.js", "Local Storage"],
            category: "Web Development",
            api_source: selectedApi
          },
          {
            user_id: user.id,
            title: "Weather Forecast App",
            description: "Real-time weather application with location-based forecasts and weather alerts.",
            difficulty: difficulty,
            tags: ["JavaScript", "API Integration", "Geolocation"],
            category: "Web Development",
            api_source: selectedApi
          },
          {
            user_id: user.id,
            title: "Task Management System",
            description: "Collaborative task management with team features, deadlines, and progress tracking.",
            difficulty: difficulty,
            tags: ["CRUD Operations", "Database", "User Authentication"],
            category: "Full Stack",
            api_source: selectedApi
          }
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
