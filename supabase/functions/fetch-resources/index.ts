
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, searchTerm, selectedApi } = await req.json();
    
    const githubKey = Deno.env.get('GITHUB_API_KEY');
    
    // Search GitHub for relevant repositories
    const searchQuery = searchTerm || category;
    const githubResponse = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=20`, {
      headers: {
        'Authorization': `token ${githubKey}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let githubRepos = [];
    if (githubResponse.ok) {
      const data = await githubResponse.json();
      githubRepos = data.items.map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics || []
      }));
    }

    // Generate AI-powered learning resources
    let aiResources = [];
    const resourcePrompt = `Generate a comprehensive list of learning resources for ${category}${searchTerm ? ` focusing on ${searchTerm}` : ''}. 
    
    Include:
    - Official documentation links
    - Best tutorial websites
    - Online courses (free and paid)
    - YouTube channels
    - Books and ebooks
    - Community forums
    - Practice platforms
    
    Return as JSON array with objects containing: title, description, url, type (tutorial/course/documentation/book/community), difficulty, rating (1-5), and isFree (boolean).`;

    let aiContent = '';
    
    if (selectedApi === "openai") {
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: resourcePrompt }],
          temperature: 0.3,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        aiContent = data.choices[0].message.content;
      }
    } else if (selectedApi === "claude") {
      const claudeKey = Deno.env.get('CLAUDE_API_KEY');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': claudeKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 3000,
          messages: [{ role: 'user', content: resourcePrompt }],
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        aiContent = data.content[0].text;
      }
    } else if (selectedApi === "gemini") {
      const geminiKey = Deno.env.get('GEMINI_API_KEY');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: resourcePrompt }]
          }]
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        aiContent = data.candidates[0].content.parts[0].text;
      }
    }

    try {
      const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
      const cleanContent = jsonMatch ? jsonMatch[0] : aiContent;
      aiResources = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parsing AI resources:', parseError);
      aiResources = [];
    }

    return new Response(JSON.stringify({ 
      githubRepos,
      aiResources,
      category,
      searchTerm 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching resources:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
