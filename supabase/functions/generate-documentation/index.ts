
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
    const { projectTitle, projectDescription, requirements, features, techStack, documentType, selectedApi } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: authHeader } 
        } 
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    let documentPrompt = '';
    
    switch (documentType) {
      case 'srs':
        documentPrompt = `Create a comprehensive Software Requirements Specification (SRS) document for:
        Project: ${projectTitle}
        Description: ${projectDescription}
        Requirements: ${requirements}
        Features: ${features}
        Tech Stack: ${techStack}
        
        Include sections for: Introduction, Overall Description, System Features, External Interface Requirements, System Features, Other Nonfunctional Requirements, and Appendices.`;
        break;
      case 'design':
        documentPrompt = `Create a detailed System Design Document for:
        Project: ${projectTitle}
        Description: ${projectDescription}
        Tech Stack: ${techStack}
        
        Include: Architecture Overview, Database Design, API Design, UI/UX Specifications, Security Considerations, and Deployment Strategy.`;
        break;
      case 'api':
        documentPrompt = `Create comprehensive API Documentation for:
        Project: ${projectTitle}
        Description: ${projectDescription}
        Features: ${features}
        Tech Stack: ${techStack}
        
        Include: API Overview, Authentication, Endpoints, Request/Response Examples, Error Codes, and Rate Limiting.`;
        break;
      case 'user':
        documentPrompt = `Create a User Manual for:
        Project: ${projectTitle}
        Description: ${projectDescription}
        Features: ${features}
        
        Include: Getting Started, Feature Explanations, Step-by-step Guides, Troubleshooting, and FAQ.`;
        break;
    }

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
          messages: [{ role: 'user', content: documentPrompt }],
          temperature: 0.3,
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
          messages: [{ role: 'user', content: documentPrompt }],
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
            parts: [{ text: documentPrompt }]
          }]
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        content = data.candidates[0].content.parts[0].text;
      }
    }

    if (content) {
      return new Response(JSON.stringify({ 
        documentation: content,
        documentType: documentType,
        projectTitle: projectTitle 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Failed to generate documentation');
  } catch (error) {
    console.error('Error generating documentation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
