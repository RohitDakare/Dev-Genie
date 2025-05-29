
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
    const { projectType, interests, skills, difficulty } = await req.json();
    
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

    console.log('Generating projects for user:', user.id);

    // Save/update user preferences with fixed preferred_api value
    const { error: prefsError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        project_type: projectType,
        interests: interests,
        skills: skills,
        difficulty: difficulty,
        preferred_api: 'openai', // Fixed to use a valid value
        updated_at: new Date().toISOString()
      });

    if (prefsError) {
      console.error('Error saving preferences:', prefsError);
    }

    const basePrompt = `Generate 15-20 unique and diverse project ideas based on these preferences:
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
    
    Return ONLY a valid JSON array with objects containing: 
    - id (unique identifier as string)
    - title (clear, descriptive name)
    - description (detailed 2-3 sentence explanation)
    - difficulty (must be one of: "Beginner", "Intermediate", "Advanced")
    - tags (array of 3-5 relevant technology tags)
    - category (specific category like "Web Development", "Mobile App", "AI/ML", etc.)
    - estimatedTime (like "2-3 weeks", "1 month", etc.)
    - marketDemand ("High", "Medium", "Low")
    
    Make sure the response is valid JSON format only, no extra text or markdown.`;

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
            messages: [{ role: 'user', content: basePrompt }],
            temperature: 0.8,
          }),
        }).then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            return { source: 'openai', content: data.choices[0].message.content };
          }
          return null;
        }).catch((error) => {
          console.error('OpenAI API error:', error);
          return null;
        })
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
            max_tokens: 4000,
            messages: [{ role: 'user', content: basePrompt }],
          }),
        }).then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            return { source: 'claude', content: data.content[0].text };
          }
          return null;
        }).catch((error) => {
          console.error('Claude API error:', error);
          return null;
        })
      );
    }

    // Gemini call
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (geminiKey) {
      apiCalls.push(
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: basePrompt }]
            }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 4000,
            }
          }),
        }).then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            return { source: 'gemini', content: data.candidates[0].content.parts[0].text };
          }
          return null;
        }).catch((error) => {
          console.error('Gemini API error:', error);
          return null;
        })
      );
    }

    // Wait for all API calls to complete
    const responses = await Promise.all(apiCalls);
    const validResponses = responses.filter(Boolean);

    let allProjects = [];

    // Parse responses from all APIs with improved error handling
    for (const response of validResponses) {
      if (response?.content) {
        try {
          // Clean the content first
          let cleanContent = response.content.trim();
          
          // Remove markdown code blocks if present
          cleanContent = cleanContent.replace(/```json\s*|\s*```/g, '');
          cleanContent = cleanContent.replace(/```\s*|\s*```/g, '');
          
          // Try to extract JSON array
          const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            cleanContent = jsonMatch[0];
          }
          
          const projects = JSON.parse(cleanContent);
          
          if (Array.isArray(projects)) {
            // Add source information and ensure unique IDs
            const projectsWithSource = projects.map((project: any, index: number) => ({
              ...project,
              id: `${response.source}-${Date.now()}-${index}`,
              api_source: response.source,
              // Ensure all required fields have valid values
              difficulty: project.difficulty || difficulty,
              estimatedTime: project.estimatedTime || '2-4 weeks',
              marketDemand: project.marketDemand || 'Medium',
              tags: Array.isArray(project.tags) ? project.tags : [],
              category: project.category || projectType
            }));
            
            allProjects.push(...projectsWithSource);
          }
        } catch (parseError) {
          console.error(`Error parsing ${response.source} response:`, parseError);
          console.error('Raw content:', response.content);
        }
      }
    }

    // If we have projects from APIs, use them
    if (allProjects.length > 0) {
      // Remove duplicates based on title similarity and limit to 20
      const uniqueProjects = [];
      const seenTitles = new Set();
      
      for (const project of allProjects) {
        const titleKey = project.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!seenTitles.has(titleKey) && uniqueProjects.length < 20) {
          seenTitles.add(titleKey);
          uniqueProjects.push(project);
        }
      }

      // Store projects in database
      const projectsToInsert = uniqueProjects.map((project: any) => ({
        user_id: user.id,
        title: project.title,
        description: project.description,
        difficulty: project.difficulty,
        tags: project.tags || [],
        category: project.category,
        api_source: project.api_source,
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

      console.log('Successfully stored projects from multiple APIs:', insertedProjects?.length);

      return new Response(JSON.stringify({ projects: insertedProjects }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced fallback projects if no API responses
    const fallbackProjects = [
      {
        user_id: user.id,
        title: "AI-Powered Personal Finance Assistant",
        description: "Build a comprehensive financial management platform with AI-driven insights, expense categorization, and investment recommendations using machine learning algorithms.",
        difficulty: difficulty,
        tags: ["React", "Node.js", "AI/ML", "Chart.js", "MongoDB"],
        category: "Web Development",
        api_source: "fallback",
        estimated_time: "3-4 weeks",
        market_demand: "High"
      },
      {
        user_id: user.id,
        title: "Smart Home IoT Control Hub",
        description: "Create a centralized dashboard for managing smart home devices with automation rules, energy monitoring, and voice control integration.",
        difficulty: difficulty,
        tags: ["React Native", "IoT", "Node.js", "WebSocket", "SQLite"],
        category: "Mobile Development",
        api_source: "fallback",
        estimated_time: "4-6 weeks",
        market_demand: "High"
      },
      {
        user_id: user.id,
        title: "Real-time Collaborative Code Editor",
        description: "Develop an online code editor with real-time collaboration, syntax highlighting, integrated version control, and live code execution features.",
        difficulty: difficulty,
        tags: ["WebSocket", "React", "Monaco Editor", "Git", "Docker"],
        category: "Web Development",
        api_source: "fallback",
        estimated_time: "5-7 weeks",
        market_demand: "Medium"
      },
      {
        user_id: user.id,
        title: "E-learning Platform with Gamification",
        description: "Build an interactive learning platform with gamified elements, progress tracking, and personalized learning paths based on user performance.",
        difficulty: difficulty,
        tags: ["React", "Express", "PostgreSQL", "WebRTC", "AWS"],
        category: "Web Development",
        api_source: "fallback",
        estimated_time: "6-8 weeks",
        market_demand: "High"
      },
      {
        user_id: user.id,
        title: "Blockchain-based Voting System",
        description: "Create a secure and transparent voting system using blockchain technology with voter verification and real-time result tracking.",
        difficulty: difficulty,
        tags: ["Blockchain", "Solidity", "Web3", "React", "Ethereum"],
        category: "Blockchain",
        api_source: "fallback",
        estimated_time: "8-10 weeks",
        market_demand: "Medium"
      }
    ];

    const { data: fallbackInserted, error: fallbackError } = await supabase
      .from('projects')
      .insert(fallbackProjects)
      .select();

    if (fallbackError) {
      console.error('Error inserting fallback projects:', fallbackError);
      throw fallbackError;
    }

    console.log('Used fallback projects:', fallbackInserted?.length);

    return new Response(JSON.stringify({ projects: fallbackInserted }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating projects:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
