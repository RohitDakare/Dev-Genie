
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
    const { category, searchTerm } = await req.json();
    
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

    // Generate AI-powered learning resources from all APIs
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

    // Call all three APIs simultaneously
    const apiCalls = [];

    // OpenAI call
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (openaiKey) {
      apiCalls.push(
        fetch('https://api.openai.com/v1/chat/completions', {
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
        }).then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            return { source: 'openai', content: data.choices[0].message.content };
          }
          return null;
        }).catch(() => null)
      );
    }

    // Claude call
    const claudeKey = Deno.env.get('CLAUDE_API_KEY');
    if (claudeKey) {
      apiCalls.push(
        fetch('https://api.anthropic.com/v1/messages', {
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
        }).then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            return { source: 'claude', content: data.content[0].text };
          }
          return null;
        }).catch(() => null)
      );
    }

    // Gemini call
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (geminiKey) {
      apiCalls.push(
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: resourcePrompt }]
            }]
          }),
        }).then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            return { source: 'gemini', content: data.candidates[0].content.parts[0].text };
          }
          return null;
        }).catch(() => null)
      );
    }

    // Wait for all API calls to complete
    const responses = await Promise.all(apiCalls);
    const validResponses = responses.filter(Boolean);

    let allResources = [];

    // Parse responses from all APIs
    for (const response of validResponses) {
      if (response?.content) {
        try {
          const jsonMatch = response.content.match(/\[[\s\S]*\]/);
          const cleanContent = jsonMatch ? jsonMatch[0] : response.content;
          const resources = JSON.parse(cleanContent);
          
          // Add source information
          const resourcesWithSource = resources.map((resource: any) => ({
            ...resource,
            source: response.source
          }));
          
          allResources.push(...resourcesWithSource);
        } catch (parseError) {
          console.error(`Error parsing ${response.source} resources:`, parseError);
        }
      }
    }

    // Remove duplicates based on URL or title similarity
    const uniqueResources = [];
    const seenUrls = new Set();
    const seenTitles = new Set();
    
    for (const resource of allResources) {
      const urlKey = resource.url || '';
      const titleKey = resource.title?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
      
      if (!seenUrls.has(urlKey) && !seenTitles.has(titleKey)) {
        seenUrls.add(urlKey);
        seenTitles.add(titleKey);
        uniqueResources.push(resource);
      }
    }

    return new Response(JSON.stringify({ 
      githubRepos,
      aiResources: uniqueResources,
      category,
      searchTerm,
      sources: validResponses.map(r => r.source)
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
