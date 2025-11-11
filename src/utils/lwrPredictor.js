/**
 * Locally Weighted Regression (LWR) for Job Matching
 * Predicts job matches based on CV features
 */

/**
 * Calculate Gaussian kernel weight
 * @param {number} distance - Distance between points
 * @param {number} bandwidth - Bandwidth parameter (tau)
 * @returns {number} Weight value
 */
const gaussianKernel = (distance, bandwidth = 0.5) => {
  return Math.exp(-(distance ** 2) / (2 * bandwidth ** 2));
};

/**
 * Calculate Euclidean distance between two feature vectors
 * @param {Object} features1 - First feature vector
 * @param {Object} features2 - Second feature vector
 * @returns {number} Distance
 */
const calculateDistance = (features1, features2) => {
  let sum = 0;
  const allKeys = new Set([...Object.keys(features1), ...Object.keys(features2)]);
  
  allKeys.forEach(key => {
    const val1 = features1[key] || 0;
    const val2 = features2[key] || 0;
    sum += (val1 - val2) ** 2;
  });
  
  return Math.sqrt(sum);
};

/**
 * Extract features from CV data
 * @param {Object} cvData - Parsed CV data
 * @returns {Object} Feature vector
 */
export const extractFeatures = (cvData) => {
  const features = {};
  
  // Skills features (binary: 1 if present, 0 if not)
  const allSkills = [
    'JavaScript', 'Python', 'Java', 'PHP', 'C', 'C++', 'C#',
    'React', 'Vue', 'Angular', 'Laravel', 'Django', 'Flask',
    'Node.js', 'Express', 'MongoDB', 'MySQL', 'PostgreSQL',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'HTML', 'CSS', 'TypeScript', 'Git', 'Linux'
  ];
  
  allSkills.forEach(skill => {
    const hasSkill = cvData.skills?.some(s => 
      s.toLowerCase().includes(skill.toLowerCase())
    ) || false;
    features[`skill_${skill.replace(/[^a-zA-Z0-9]/g, '_')}`] = hasSkill ? 1 : 0;
  });
  
  // Education level
  const educationKeywords = cvData.education?.map(e => e.degree?.toLowerCase() || '') || [];
  features.education_bachelor = educationKeywords.some(e => e.includes('bachelor') || e.includes('baccalauréat')) ? 1 : 0;
  features.education_master = educationKeywords.some(e => e.includes('master') || e.includes('ingénieur')) ? 1 : 0;
  features.education_phd = educationKeywords.some(e => e.includes('phd') || e.includes('doctorate')) ? 1 : 0;
  
  // Experience count
  features.experience_count = Math.min(cvData.experience?.length || 0, 10) / 10; // Normalized
  
  // Projects count
  features.projects_count = Math.min(cvData.projects?.length || 0, 10) / 10; // Normalized
  
  // Languages count
  features.languages_count = Math.min(cvData.languages?.length || 0, 5) / 5; // Normalized
  
  return features;
};

/**
 * Extract features from job description
 * @param {Object} job - Job data from CSV
 * @returns {Object} Feature vector
 */
const extractJobFeatures = (job) => {
  const features = {};
  const description = (job.Job_Description || '').toLowerCase();
  const title = (job.Job_Title || '').toLowerCase();
  
  // Skills features
  const skillMap = {
    'JavaScript': ['javascript', 'js', 'node'],
    'Python': ['python', 'py', 'django', 'flask'],
    'Java': ['java', 'spring', 'hibernate'],
    'PHP': ['php', 'laravel', 'symfony'],
    'C': ['c programming', ' c '],
    'C++': ['c++', 'cpp'],
    'C#': ['c#', 'csharp', '.net'],
    'React': ['react', 'reactjs'],
    'Vue': ['vue', 'vuejs'],
    'Angular': ['angular'],
    'Laravel': ['laravel'],
    'Django': ['django'],
    'Flask': ['flask'],
    'Node.js': ['node', 'nodejs', 'node.js'],
    'Express': ['express', 'expressjs'],
    'MongoDB': ['mongodb', 'mongo'],
    'MySQL': ['mysql'],
    'PostgreSQL': ['postgresql', 'postgres'],
    'Docker': ['docker'],
    'Kubernetes': ['kubernetes', 'k8s'],
    'AWS': ['aws', 'amazon web services'],
    'Azure': ['azure', 'microsoft cloud'],
    'GCP': ['gcp', 'google cloud'],
    'Machine Learning': ['machine learning', 'ml'],
    'Deep Learning': ['deep learning', 'neural network'],
    'TensorFlow': ['tensorflow'],
    'PyTorch': ['pytorch'],
    'HTML': ['html', 'html5'],
    'CSS': ['css', 'css3', 'sass', 'scss'],
    'TypeScript': ['typescript', 'ts'],
    'Git': ['git', 'github', 'gitlab'],
    'Linux': ['linux', 'unix']
  };
  
  Object.entries(skillMap).forEach(([skill, keywords]) => {
    const hasSkill = keywords.some(kw => description.includes(kw) || title.includes(kw));
    features[`skill_${skill.replace(/[^a-zA-Z0-9]/g, '_')}`] = hasSkill ? 1 : 0;
  });
  
  // Education requirements
  features.education_bachelor = description.includes('bachelor') || description.includes('bs ') || description.includes('b.s') ? 1 : 0;
  features.education_master = description.includes('master') || description.includes('ms ') || description.includes('m.s') ? 1 : 0;
  features.education_phd = description.includes('phd') || description.includes('doctorate') ? 1 : 0;
  
  // Experience requirements (parse years)
  const expMatch = description.match(/(\d+)\+?\s*years?/i);
  features.experience_count = expMatch ? Math.min(parseInt(expMatch[1]), 10) / 10 : 0.3; // Default to 3 years
  
  // Default values for other features
  features.projects_count = 0.5;
  features.languages_count = 0.6;
  
  return features;
};

/**
 * Perform LWR prediction
 * @param {Object} cvFeatures - Feature vector from CV
 * @param {Array} jobs - Array of jobs from CSV
 * @param {number} topK - Number of top matches to return
 * @returns {Array} Top K matched jobs with scores
 */
export const predictJobMatches = (cvFeatures, jobs, topK = 10) => {
  const bandwidth = 0.8; // Tau parameter for Gaussian kernel
  
  // Calculate match score for each job
  const scoredJobs = jobs.map(job => {
    const jobFeatures = extractJobFeatures(job);
    const distance = calculateDistance(cvFeatures, jobFeatures);
    const weight = gaussianKernel(distance, bandwidth);
    
    // Calculate match percentage (0-100)
    const matchScore = weight * 100;
    
    return {
      ...job,
      matchScore: Math.round(matchScore),
      distance: distance.toFixed(3)
    };
  });
  
  // Sort by match score and return top K
  return scoredJobs
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, topK);
};

/**
 * Parse CSV data
 * @param {string} csvText - CSV file content
 * @returns {Array} Parsed job data
 */
export const parseJobsCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  // Parse rows
  const jobs = [];
  for (let i = 1; i < lines.length; i++) {
    // Handle CSV with quoted fields
    const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!row || row.length < headers.length) continue;
    
    const job = {};
    headers.forEach((header, index) => {
      job[header] = row[index]?.replace(/^"|"$/g, '').trim() || '';
    });
    
    jobs.push(job);
  }
  
  return jobs;
};
