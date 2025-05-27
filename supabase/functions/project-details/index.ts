
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
    const { project, selectedApi } = await req.json();
    
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

    console.log('Generating project details for project:', project.id);

    // Check if details already exist
    const { data: existingDetails } = await supabase
      .from('project_details')
      .select('*')
      .eq('project_id', project.id)
      .single();

    if (existingDetails) {
      console.log('Returning existing project details');
      return new Response(JSON.stringify({ details: existingDetails }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const detailPrompt = `Provide detailed information for the project "${project.title}":
    
    Return JSON with:
    - title
    - description (detailed)
    - structure (project architecture)
    - flow (user flow/workflow)
    - roadmap (development phases)
    - pseudoCode (key algorithms)
    - resources (array of helpful links)
    - githubLinks (array of relevant GitHub repositories)`;

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
          messages: [{ role: 'user', content: detailPrompt }],
          temperature: 0.7,
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
          max_tokens: 2000,
          messages: [{ role: 'user', content: detailPrompt }],
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
            parts: [{ text: detailPrompt }]
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
        const details = JSON.parse(content);
        
        // Store project details in database
        const detailsToInsert = {
          project_id: project.id,
          structure: details.structure,
          flow: details.flow,
          roadmap: details.roadmap,
          pseudo_code: details.pseudoCode,
          resources: details.resources || [],
          github_links: details.githubLinks || []
        };

        const { data: insertedDetails, error: insertError } = await supabase
          .from('project_details')
          .insert(detailsToInsert)
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting project details:', insertError);
          throw insertError;
        }

        console.log('Successfully stored project details');

        return new Response(JSON.stringify({ details: insertedDetails }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Return fallback details and store them
        const fallbackDetails = {
          project_id: project.id,
          structure: "Frontend: React.js with TypeScript\nBackend: Node.js with Express\nDatabase: MongoDB\nAuthentication: JWT",
          flow: "1. User Registration/Login\n2. Dashboard Overview\n3. Core Functionality\n4. Data Management\n5. Settings & Profile",
          roadmap: "Phase 1: Setup & Authentication (Week 1)\nPhase 2: Core Features (Week 2-3)\nPhase 3: UI/UX Polish (Week 4)\nPhase 4: Testing & Deployment (Week 5)",
          pseudo_code: "// Main Application Logic\nfunction initializeApp() {\n  authenticateUser();\n  loadUserData();\n  renderDashboard();\n}",
          resources: [
            "https://reactjs.org/docs",
            "https://nodejs.org/en/docs",
            "https://developer.mozilla.org/",
            "https://stackoverflow.com/"
          ],
          github_links: [
            "https://github.com/topics/react",
            "https://github.com/topics/nodejs",
            "https://github.com/topics/" + project.category.toLowerCase().replace(' ', '-')
          ]
        };

        const { data: fallbackInserted } = await supabase
          .from('project_details')
          .insert(fallbackDetails)
          .select()
          .single();

        return new Response(JSON.stringify({ details: fallbackInserted }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error('Failed to generate project details');
  } catch (error) {
    console.error('Error generating project details:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
