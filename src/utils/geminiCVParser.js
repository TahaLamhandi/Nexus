/**
 * Gemini AI-powered CV Parser
 * Uses Google's Gemini API to intelligently extract structured information from CVs
 */

const GEMINI_API_KEY = 'AIzaSyBHgEtd4yuCcnXxRAH9flPsZrtZSRgSdrc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Parse CV using Gemini AI
 * @param {string} cvText - Raw text extracted from CV (PDF or Word)
 * @returns {Promise<Object>} - Structured CV data
 */
export const parseWithGemini = async (cvText) => {
  console.log('🤖 Parsing CV with Gemini AI...');
  console.log('📄 CV Text Length:', cvText.length);

  const prompt = `You are an expert CV/Resume parser. Analyze the following CV text and extract ALL relevant information in a structured JSON format.

CV TEXT:
${cvText}

IMPORTANT INSTRUCTIONS:
1. Extract the person's full name (first name and last name)
2. Extract ALL skills and CATEGORIZE them into:
   - technicalSkills: Programming languages, frameworks, tools, software (e.g., JavaScript, Python, React, Docker, AWS, AutoCAD)
   - softSkills: Interpersonal abilities, soft skills (e.g., Leadership, Communication, Problem Solving, Teamwork)
3. Extract ALL work experience entries with: job title, company name, dates/duration, and responsibilities
4. Extract ALL education entries with: degree, institution, year
5. Extract ALL projects with: project name, description, technologies used
6. Extract contact information: email, phone, location
7. Extract languages spoken
8. Extract certifications

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number or null",
  "location": "city, country or null",
  "technicalSkills": ["JavaScript", "Python", "React", "Docker"],
  "softSkills": ["Leadership", "Communication", "Teamwork"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End dates",
      "responsibilities": ["responsibility 1", "responsibility 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "year": "Year or date range"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "languages": ["language1", "language2"],
  "certifications": ["certification1", "certification2"]
}

Be thorough and extract as much information as possible. If a field is not found, use null or empty array.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1, // Low temperature for consistent, factual extraction
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Gemini API Error:', errorData);
      
      // If model not found, try listing available models
      if (errorData.error?.code === 404) {
        console.log('🔍 Attempting to list available models...');
        try {
          const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
          const modelsData = await modelsResponse.json();
          console.log('📋 Available models:', modelsData);
          
          // Log model names clearly
          if (modelsData.models) {
            console.log('📝 Available model names:');
            modelsData.models.forEach(model => {
              console.log(`  - ${model.name}`);
            });
          }
        } catch (e) {
          console.error('Failed to list models:', e);
        }
      }
      
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('📦 Gemini Response:', data);

    // Extract the generated text from Gemini's response
    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('📝 Generated Text:', generatedText);

    // Parse the JSON from the response (remove markdown code blocks if present)
    let cleanedText = generatedText.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n/g, '').replace(/```/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n/g, '').replace(/```/g, '');
    }

    const parsedData = JSON.parse(cleanedText);
    
    console.log('✅ Successfully parsed CV with Gemini!');
    console.log('👤 Name:', parsedData.name);
    console.log('� Technical Skills:', parsedData.technicalSkills?.length || 0);
    console.log('🤝 Soft Skills:', parsedData.softSkills?.length || 0);
    console.log('🏢 Experience entries:', parsedData.experience?.length || 0);
    console.log('🎓 Education entries:', parsedData.education?.length || 0);
    console.log('🚀 Projects:', parsedData.projects?.length || 0);

    return parsedData;

  } catch (error) {
    console.error('❌ Error parsing CV with Gemini:', error);
    throw error;
  }
};

/**
 * Format Gemini parsed data to match the existing CV data structure
 * This ensures compatibility with the rest of the application
 */
export const formatGeminiData = (geminiData, rawText) => {
  // Combine technical and soft skills for backward compatibility
  const allSkills = [
    ...(geminiData.technicalSkills || []),
    ...(geminiData.softSkills || [])
  ];

  return {
    rawText: rawText,
    name: geminiData.name || 'Name not found',
    email: geminiData.email || null,
    phone: geminiData.phone || null,
    contact: {
      email: geminiData.email || null,
      phone: geminiData.phone || null,
      location: geminiData.location || null,
    },
    skills: allSkills, // All skills combined for backward compatibility
    technicalSkills: geminiData.technicalSkills || [],
    softSkills: geminiData.softSkills || [],
    education: (geminiData.education || []).map(edu => ({
      degree: edu.degree || '',
      institution: edu.institution || '',
      year: edu.year || ''
    })),
    experience: (geminiData.experience || []).map(exp => ({
      title: exp.title || '',
      company: exp.company || '',
      duration: exp.duration || '',
      responsibilities: exp.responsibilities || [],
      description: exp.responsibilities || [] // Alias for compatibility
    })),
    projects: (geminiData.projects || []).map(proj => ({
      name: proj.name || '',
      description: Array.isArray(proj.description) ? proj.description : [proj.description || ''],
      technologies: Array.isArray(proj.technologies) ? proj.technologies : []
    })),
    languages: geminiData.languages || [],
    certifications: geminiData.certifications || [],
    
    // For features array (used by UI components)
    features: [
      {
        category: 'Personal Information',
        features: [
          { name: 'Name', value: geminiData.name || null },
          { name: 'Email', value: geminiData.email || null },
          { name: 'Phone', value: geminiData.phone || null }
        ]
      },
      {
        category: 'Technical Skills',
        features: (geminiData.technicalSkills || []).map(skill => ({ name: skill, value: true }))
      },
      {
        category: 'Soft Skills',
        features: (geminiData.softSkills || []).map(skill => ({ name: skill, value: true }))
      },
      {
        category: 'Education',
        features: geminiData.education || []
      },
      {
        category: 'Experience',
        features: geminiData.experience || []
      },
      {
        category: 'Projects',
        features: geminiData.projects || []
      },
      {
        category: 'Languages',
        features: (geminiData.languages || []).map(lang => ({ name: lang, value: true }))
      },
      {
        category: 'Certifications',
        features: (geminiData.certifications || []).map(cert => ({ name: cert, value: true }))
      }
    ]
  };
};
