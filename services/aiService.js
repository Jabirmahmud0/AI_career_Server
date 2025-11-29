const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load multiple API keys from environment variables
const API_KEYS = [
  process.env.GOOGLE_AI_API_KEY,
  process.env.GOOGLE_AI_API_KEY_2,
  process.env.GOOGLE_AI_API_KEY_3,
  process.env.GOOGLE_AI_API_KEY_4,
  process.env.GOOGLE_AI_API_KEY_5,
  process.env.GOOGLE_AI_API_KEY_6
].filter(key => key); // Filter out undefined keys

const GOOGLE_AI_MODEL = process.env.GOOGLE_AI_MODEL || 'gemini-2.5-flash';

console.log(`Loaded ${API_KEYS.length} Google AI API Keys`);
console.log('Google AI Model:', GOOGLE_AI_MODEL);

// Current API key index for rotation
let currentApiKeyIndex = 0;

// Function to get current API key
const getCurrentApiKey = () => API_KEYS[currentApiKeyIndex];

// Function to rotate to the next API key
const rotateApiKey = () => {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
  console.log(`Rotated to API Key ${currentApiKeyIndex + 1}/${API_KEYS.length}`);
  return getCurrentApiKey();
};

// Function to create a new GoogleGenerativeAI instance with current key
const createGenAIInstance = () => {
  const currentKey = getCurrentApiKey();
  console.log(`Using API Key ${currentApiKeyIndex + 1}: ${currentKey ? 'Loaded' : 'Missing'}`);
  return new GoogleGenerativeAI(currentKey);
};

// Create initial instance
let genAI = createGenAIInstance();

const callAI = async (messages, maxTokens = 2000) => {
  try {
    const model = genAI.getGenerativeModel({ model: GOOGLE_AI_MODEL });
    
    // Convert OpenAI format to Google Gemini format
    const geminiMessages = [];
    for (const msg of messages) {
      if (msg.role === 'system') {
        // Add system message as a user message (Gemini doesn't have system role)
        geminiMessages.push({ role: 'user', parts: [{ text: msg.content }] });
        geminiMessages.push({ role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] });
      } else if (msg.role === 'user') {
        geminiMessages.push({ role: 'user', parts: [{ text: msg.content }] });
      } else if (msg.role === 'assistant') {
        geminiMessages.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    }
    
    // For chat, we use chat.sendMessage, for single turn we use generateContent
    const chat = model.startChat({
      history: geminiMessages.slice(0, -1) // All messages except the last one
    });
    
    const result = await chat.sendMessage(geminiMessages[geminiMessages.length - 1].parts[0].text);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('AI Service Error:', error.message);
    
    // Check if error is related to API quota/limit
    if (error.message && (
      error.message.includes('quota') || 
      error.message.includes('limit') || 
      error.message.includes('429') ||
      error.message.includes('RESOURCE_EXHAUSTED')
    )) {
      // Rotate to next API key and retry
      if (API_KEYS.length > 1) {
        console.log('Rate limit detected, rotating to next API key...');
        rotateApiKey();
        genAI = createGenAIInstance(); // Recreate the instance with new key
        
        // Retry the call once with the new key
        try {
          const model = genAI.getGenerativeModel({ model: GOOGLE_AI_MODEL });
          
          // Convert OpenAI format to Google Gemini format
          const geminiMessages = [];
          for (const msg of messages) {
            if (msg.role === 'system') {
              geminiMessages.push({ role: 'user', parts: [{ text: msg.content }] });
              geminiMessages.push({ role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] });
            } else if (msg.role === 'user') {
              geminiMessages.push({ role: 'user', parts: [{ text: msg.content }] });
            } else if (msg.role === 'assistant') {
              geminiMessages.push({ role: 'model', parts: [{ text: msg.content }] });
            }
          }
          
          const chat = model.startChat({
            history: geminiMessages.slice(0, -1)
          });
          
          const result = await chat.sendMessage(geminiMessages[geminiMessages.length - 1].parts[0].text);
          const response = await result.response;
          
          return response.text();
        } catch (retryError) {
          console.error('Retry failed with new API key:', retryError.message);
          throw retryError;
        }
      } else {
        console.log('No additional API keys available for rotation');
        throw error;
      }
    }
    
    throw error;
  }
};

// Add a function to reset the API key rotation (useful for testing)
const resetApiKeyRotation = () => {
  currentApiKeyIndex = 0;
  genAI = createGenAIInstance();
  console.log('API key rotation reset to first key');
};

// Extract skills from CV text
const extractSkillsFromCV = async (cvText, existingSkills = []) => {
  const prompt = `Analyze the following CV/resume text and extract technical skills, soft skills, and suggested roles. Be comprehensive and thorough in your analysis.

Focus on identifying:
1. Technical skills (programming languages, frameworks, tools, platforms, databases, etc.)
2. Soft skills (communication, leadership, teamwork, problem-solving, etc.)
3. Suggested job roles/domains based on the profile

CV Text:
${cvText}

Existing Skills: ${existingSkills.join(', ') || 'None'}

Instructions:
- Extract ALL technical skills mentioned or implied in the resume
- Look for skills in project descriptions, job responsibilities, and education sections
- Identify both explicitly mentioned skills and related skills
- Extract soft skills from descriptions of work experience and personal qualities
- Be specific with technical skills (e.g., "React" instead of just "JavaScript framework")
- Include version numbers when specified (e.g., "Node.js v14+", "Python 3.8")

Respond in JSON format:
{
  "technicalSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "suggestedRoles": ["role1", "role2"],
  "summary": "Brief summary of the candidate's profile"
}`;

  const messages = [
    { role: 'system', content: 'You are a career advisor AI that analyzes CVs and extracts relevant skills and suggests career paths. Always respond with valid JSON. Be thorough and comprehensive in your analysis. Extract ALL relevant skills, even if they appear in project descriptions or job responsibilities.' },
    { role: 'user', content: prompt }
  ];

  const response = await callAI(messages);
  
  try {
    // Handle case where response is wrapped in code blocks
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.substring(7, cleanResponse.length - 3).trim();
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.substring(3, cleanResponse.length - 3).trim();
    }
    
    const parsed = JSON.parse(cleanResponse);
    return parsed;
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    console.error('Response:', response);
    // If JSON parsing fails, attempt to extract skills using regex as fallback
    return extractSkillsWithRegex(cvText, existingSkills);
  }
};

// Fallback method to extract skills using regex patterns
const extractSkillsWithRegex = (cvText, existingSkills = []) => {
  // Common technical skills patterns
  const technicalSkills = new Set([
    // Programming Languages
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin', 'TypeScript', 'Rust',
    'HTML', 'CSS', 'SQL', 'Scala', 'Perl', 'R', 'MATLAB', 'Shell', 'Bash',
    
    // Frameworks & Libraries
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails',
    'Bootstrap', 'Tailwind', 'jQuery', 'Redux', 'Next.js', 'Nuxt.js',
    
    // Databases
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'SQLite', 'Oracle', 'SQL Server',
    
    // Tools & Platforms
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Heroku', 'Netlify', 'Vercel',
    'Webpack', 'Jest', 'Cypress', 'Selenium', 'Jenkins', 'CI/CD', 'Stripe', 'WebSockets'
  ]);
  
  // Soft skills patterns
  const softSkills = new Set([
    'Problem Solving', 'Teamwork', 'Communication', 'Leadership', 'Adaptability',
    'Time Management', 'Critical Thinking', 'Creativity', 'Collaboration'
  ]);
  
  const foundTechnicalSkills = [];
  const foundSoftSkills = [];
  
  // Convert CV text to lowercase for case-insensitive matching
  const lowerCvText = cvText.toLowerCase();
  
  // Find technical skills
  for (const skill of technicalSkills) {
    if (lowerCvText.includes(skill.toLowerCase())) {
      foundTechnicalSkills.push(skill);
    }
  }
  
  // Find soft skills
  for (const skill of softSkills) {
    if (lowerCvText.includes(skill.toLowerCase())) {
      foundSoftSkills.push(skill);
    }
  }
  
  // Combine with existing skills to avoid duplicates
  const allTechnicalSkills = [...new Set([...existingSkills.filter(s => foundTechnicalSkills.includes(s)), ...foundTechnicalSkills])];
  const allSoftSkills = [...new Set([...foundSoftSkills])];
  
  return {
    technicalSkills: allTechnicalSkills,
    softSkills: allSoftSkills,
    suggestedRoles: ['Software Engineer', 'Full Stack Developer', 'Web Developer'],
    summary: 'Skills extracted using pattern matching from CV text.'
  };
};

// Generate career roadmap
const generateRoadmap = async (currentSkills, targetRole, timeframe, hoursPerWeek) => {
  const prompt = `Create a detailed career roadmap for someone with the following profile:

Current Skills: ${currentSkills.join(', ')}
Target Role: ${targetRole}
Timeframe: ${timeframe}
Available Learning Time: ${hoursPerWeek} hours per week

Generate a structured roadmap with:
1. Weekly/Phase-wise breakdown
2. Specific topics and technologies to learn
3. Simple project ideas for each phase
4. When to start applying for jobs/internships

Respond in JSON format:
{
  "overview": "Brief overview of the roadmap",
  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": "Weeks 1-4",
      "goals": ["goal1", "goal2"],
      "topics": ["topic1", "topic2"],
      "resources": ["resource suggestion"],
      "project": {
        "title": "Project name",
        "description": "What to build"
      },
      "milestones": ["milestone1"]
    }
  ],
  "applicationReadiness": {
    "when": "When to start applying",
    "tips": ["tip1", "tip2"]
  },
  "totalDuration": "Estimated total time"
}`;

  const messages = [
    { role: 'system', content: 'You are an expert career coach specializing in helping youth and fresh graduates plan their career paths. Create realistic, actionable roadmaps. Always respond with valid JSON.' },
    { role: 'user', content: prompt }
  ];

  const response = await callAI(messages, 3000);
  
  try {
    // Handle case where response is wrapped in code blocks
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.substring(7, cleanResponse.length - 3).trim();
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.substring(3, cleanResponse.length - 3).trim();
    }
    
    const parsed = JSON.parse(cleanResponse);
    return parsed;
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    console.error('Response length:', response.length);
    console.error('Response preview:', response.substring(0, 200));
    return { rawResponse: response };
  }
};

// CareerBot chat
const chatWithCareerBot = async (userMessage, userContext) => {
  // Handle both the old format and new comprehensive format
  const skills = userContext.skills || userContext.technicalSkills || [];
  const targetRoles = userContext.targetRoles || [];
  const experienceLevel = userContext.experienceLevel || userContext.experience || 'Fresher';
  const preferredTrack = userContext.preferredTrack || 'Not specified';
  const fullName = userContext.fullName || 'User';
  const email = userContext.email || 'Not provided';
  const education = userContext.education || 'Not specified';
  const preferences = userContext.preferences || {};

  const contextInfo = `
User Profile Context:
- Name: ${fullName}
- Email: ${email}
- Skills: ${skills.join(', ') || 'Not specified'}
- Target Roles: ${targetRoles.join(', ') || 'Not specified'}
- Experience Level: ${experienceLevel}
- Education: ${education}
- Preferred Track: ${preferredTrack}
`;

  const messages = [
    { 
      role: 'system', 
      content: `You are CareerBot, a friendly and knowledgeable career advisor for students and fresh graduates. You help with:
- Career guidance and job search advice
- Skill development recommendations
- Interview preparation tips
- Industry insights
- Resume and portfolio advice

Be encouraging, practical, and realistic. Focus on actionable advice.
${contextInfo}` 
    },
    { role: 'user', content: userMessage }
  ];

  return await callAI(messages, 1000);
};

// Generate professional summary
const generateProfileSummary = async (userProfile) => {
  const prompt = `Generate a professional summary for a job seeker with the following profile:

Name: ${userProfile.fullName}
Education: ${userProfile.educationLevel} in ${userProfile.department || 'their field'}
Experience Level: ${userProfile.experienceLevel}
Skills: ${userProfile.skills?.join(', ') || 'Various skills'}
Target Roles: ${userProfile.targetRoles?.join(', ') || 'Entry-level positions'}
Preferred Track: ${userProfile.preferredTrack}

Generate a compelling 2-3 sentence professional summary suitable for a resume or LinkedIn profile.`;

  const messages = [
    { role: 'system', content: 'You are a professional resume writer. Write concise, impactful professional summaries.' },
    { role: 'user', content: prompt }
  ];

  return await callAI(messages, 300);
};

// Improve project bullet points
const improveProjectBullets = async (projectDescription, technologies) => {
  const prompt = `Improve the following project description into strong, impactful bullet points suitable for a resume:

Project Description: ${projectDescription}
Technologies Used: ${technologies?.join(', ') || 'Various technologies'}

Generate 3-4 bullet points that:
- Start with strong action verbs
- Include metrics or impact where possible
- Highlight technical skills
- Are concise and professional

Respond with just the bullet points, one per line, starting with •`;

  const messages = [
    { role: 'system', content: 'You are a resume writing expert. Create impactful, ATS-friendly bullet points.' },
    { role: 'user', content: prompt }
  ];

  return await callAI(messages, 500);
};

// Improve LinkedIn profile
const improveLinkedInProfile = async (userProfile) => {
  const prompt = `Provide specific, actionable suggestions to improve the LinkedIn profile of a job seeker with the following profile:

Name: ${userProfile.fullName}
Education: ${userProfile.educationLevel} in ${userProfile.department || 'their field'}
Experience Level: ${userProfile.experienceLevel}
Skills: ${userProfile.skills?.join(', ') || 'Various skills'}
Target Roles: ${userProfile.targetRoles?.join(', ') || 'Entry-level positions'}
Preferred Track: ${userProfile.preferredTrack}
Professional Summary: ${userProfile.generatedSummary || 'No summary provided'}

Generate specific, actionable suggestions to improve their LinkedIn profile, including:
1. Profile headline recommendations
2. Profile picture suggestions
3. Summary section improvements
4. Experience section tips
5. Skills and endorsements advice
6. Networking recommendations

Respond in JSON format:
{
  "headlineSuggestions": ["suggestion1", "suggestion2"],
  "profilePictureTips": ["tip1", "tip2"],
  "summaryImprovements": ["improvement1", "improvement2"],
  "experienceTips": ["tip1", "tip2"],
  "skillsAdvice": ["advice1", "advice2"],
  "networkingRecommendations": ["recommendation1", "recommendation2"]
}`;

  const messages = [
    { role: 'system', content: 'You are a LinkedIn profile optimization expert. Provide specific, actionable suggestions to improve the profile. Always respond with valid JSON.' },
    { role: 'user', content: prompt }
  ];

  const response = await callAI(messages, 1500);
  
  try {
    // Handle case where response is wrapped in code blocks
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.substring(7, cleanResponse.length - 3).trim();
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.substring(3, cleanResponse.length - 3).trim();
    }
    
    const parsed = JSON.parse(cleanResponse);
    return parsed;
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    console.error('Response:', response);
    // Return default suggestions if parsing fails
    return {
      headlineSuggestions: [
        "Highlight your expertise and value proposition",
        "Include relevant keywords for your target roles"
      ],
      profilePictureTips: [
        "Use a professional headshot with good lighting",
        "Dress appropriately for your industry"
      ],
      summaryImprovements: [
        "Start with a compelling opening statement",
        "Highlight your key skills and achievements"
      ],
      experienceTips: [
        "Use specific metrics and quantifiable achievements",
        "Focus on impact and results rather than duties"
      ],
      skillsAdvice: [
        "Prioritize skills relevant to your target roles",
        "Seek endorsements from colleagues and supervisors"
      ],
      networkingRecommendations: [
        "Join industry-specific LinkedIn groups",
        "Engage with content by commenting thoughtfully"
      ]
    };
  }
};

module.exports = {
  extractSkillsFromCV,
  generateRoadmap,
  chatWithCareerBot,
  generateProfileSummary,
  improveProjectBullets,
  improveLinkedInProfile,
  // Export the reset function for testing purposes
  resetApiKeyRotation
};