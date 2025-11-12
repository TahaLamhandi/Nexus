import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  Building2, 
  BookOpen, 
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Target,
  Award,
  Code,
  Rocket,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import CoverLetterGenerator from '../components/CoverLetterGenerator';
import { getTechIcon, detectTechnologies } from '../utils/techIcons';
import { extractFeatures, predictJobMatches } from '../utils/lwrPredictor';
import API_URL from '../config/api';

const ResultsDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uploadData = location.state;
  
  const [jobMatches, setJobMatches] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  
  const cvData = uploadData?.cvData || {};

  // Redirect to upload if no data
  useEffect(() => {
    if (!uploadData) {
      navigate('/upload');
    }
  }, [uploadData, navigate]);

  // If no data, show nothing while redirecting
  if (!uploadData) {
    return null;
  }

  // Load and predict job matches using Python Backend (scikit-learn)
  useEffect(() => {
    const loadJobMatches = async () => {
      try {
        setIsLoadingJobs(true);
        setJobsError(null);
        
        console.log('🔗 Connecting to FastAPI backend (sklearn)...');
        console.log('🌐 API URL:', API_URL);
        console.log('📊 CV Data:', cvData);
        
        // Call FastAPI backend API
        const response = await fetch(`${API_URL}/api/predict-jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cvData: cvData,
            topK: 10
          })
        });
        
        if (!response.ok) {
          throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to predict jobs');
        }
        
        console.log(`✨ Received ${result.matches.length} job predictions from sklearn!`);
        console.log('Algorithm:', result.algorithm);
        console.log('Total jobs analyzed:', result.totalJobs);
        console.log('Top 3 matches:', result.matches.slice(0, 3).map(m => ({
          title: m.Job_Title,
          company: m.Company,
          match: m.matchScore
        })));
        
        setJobMatches(result.matches);
        setIsLoadingJobs(false);
      } catch (error) {
        console.error('❌ Error predicting job matches:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
        
        // Check if backend is running
        if (error.message.includes('fetch')) {
          setJobsError('FastAPI server not running. Please start: cd backend && python app.py (port 8000)');
        } else {
          setJobsError(error.message || 'Failed to load job predictions');
        }
        setIsLoadingJobs(false);
      }
    };
    
    if (cvData && Object.keys(cvData).length > 0) {
      loadJobMatches();
    }
  }, [cvData]);
  
  // Generate career biography
  const generateBio = () => {
    const skills = cvData.skills || [];
    const education = cvData.education || [];
    const projects = cvData.projects || [];
    const experience = cvData.experience || [];
    
    const primarySkills = skills.slice(0, 3).join(', ');
    
    // Extract clean degree/institution name from education
    let degreeText = 'Computer Science';
    if (education.length > 0 && education[0]?.degree) {
      const fullDegree = education[0].degree;
      // Try to extract institution name (after : or -)
      if (fullDegree.includes(':')) {
        const parts = fullDegree.split(':');
        const institutionPart = parts[1]?.trim() || '';
        // Get first few words of institution
        degreeText = institutionPart.split(' ').slice(0, 4).join(' ') || 'Engineering';
      } else if (fullDegree.includes('engineering') || fullDegree.includes('ingénieur')) {
        degreeText = 'Engineering';
      } else if (fullDegree.includes('science')) {
        degreeText = 'Computer Science';
      } else {
        // Fallback: use first 3 words
        degreeText = fullDegree.split(' ').slice(0, 3).join(' ');
      }
    }
    
    let bio = `Talented professional`;
    if (education.length > 0) bio += ` pursuing ${degreeText}`;
    if (skills.length > 0) bio += ` with expertise in ${primarySkills}`;
    if (projects.length > 0) bio += `. Built ${projects.length} impressive project${projects.length > 1 ? 's' : ''}`;
    if (experience.length > 0) bio += ` and gained experience across ${experience.length} role${experience.length > 1 ? 's' : ''}`;
    bio += `. Passionate about technology and continuous learning.`;
    
    return bio;
  };

  return (
    <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <motion.button
            onClick={() => navigate('/upload')}
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 mb-4 sm:mb-6 rounded-xl glass border border-gray-200/50 hover:border-primary-300 transition-all duration-300"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-600 group-hover:text-primary-600 transition-colors" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-primary-700 transition-colors">
              Upload Another CV
            </span>
          </motion.button>
          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold gradient-text">
              Career Analysis
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            AI-powered insights using Locally Weighted Regression
          </p>
        </motion.div>

        {/* Profile Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-8"
        >
          <Card className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white relative overflow-hidden p-4 sm:p-8 md:p-12">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <motion.div
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl sm:text-4xl font-bold"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {cvData.name?.charAt(0) || 'U'}
                </motion.div>
                <div>
                  <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-0.5 sm:mb-1">
                    {cvData.name || 'User'}
                  </h2>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-white/90">
                    {cvData.email && (
                      <span className="text-xs sm:text-sm">{cvData.email}</span>
                    )}
                    {cvData.phone && (
                      <span className="text-xs sm:text-sm">• {cvData.phone}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl">
                {generateBio()}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Skills Section with Real Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 sm:mb-8"
        >
          <Card className="p-4 sm:p-6 md:p-8">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2">
              <Code className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              Technical Skills
            </h2>
            {cvData.skills && cvData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {cvData.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="group relative"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-gray-50 to-primary-50 border-2 border-gray-200 hover:border-primary-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
                      {getTechIcon(skill, 'text-xl sm:text-3xl')}
                      <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-primary-700 transition-colors">
                        {skill}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills detected in CV</p>
            )}
          </Card>
        </motion.div>

        {/* Projects Section */}
        {cvData.projects && cvData.projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 sm:mb-8"
          >
            <Card className="p-4 sm:p-6 md:p-8">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                Projects Portfolio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                {cvData.projects.map((project, index) => {
                  // Use explicit technologies if available, otherwise detect from text
                  let techs = [];
                  if (project.technologies && project.technologies.length > 0) {
                    // Filter out years (4 digits) from technologies
                    techs = project.technologies.filter(t => !t.match(/^\d{4}$/));
                  }
                  
                  // Also detect from name and description as fallback
                  const detectedTechs = detectTechnologies(
                    project.name + ' ' + (project.description?.join(' ') || '')
                  );
                  
                  // Combine and deduplicate
                  const allTechs = [...new Set([...techs, ...detectedTechs])];
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="group"
                    >
                      <div className="h-full p-4 sm:p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-primary-400 hover:shadow-xl transition-all duration-300">
                        <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
                          {project.name}
                        </h3>
                        
                        {/* Tech Stack Icons */}
                        {allTechs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                            {allTechs.map((tech, idx) => (
                              <div key={idx} className="transition-transform hover:scale-110">
                                {getTechIcon(tech, 'text-lg sm:text-2xl')}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Project Description */}
                        {project.description && project.description.length > 0 && (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {project.description.join(' ').substring(0, 150)}...
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Experience Section */}
        {cvData.experience && cvData.experience.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Briefcase className="text-primary-600" />
                Work Experience
              </h2>
              <div className="space-y-6">
                {cvData.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="border-l-4 border-primary-500 pl-6 py-2"
                  >
                    <h3 className="font-bold text-lg text-gray-800">{exp.title}</h3>
                    <p className="text-primary-600 font-medium mb-1">{exp.company}</p>
                    {exp.duration && (
                      <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                    )}
                    {exp.description && exp.description.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {exp.description.slice(0, 3).map((desc, idx) => (
                          <li key={idx}>{desc}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Job Matches Section - LWR Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Target className="text-primary-600" />
                Predicted Job Matches
              </h2>
            </div>
            
            {isLoadingJobs ? (
              <div className="text-center py-12">
                <Loader size="lg" text="Analyzing job market..." />
              </div>
            ) : jobsError ? (
              <div className="text-center py-6 sm:py-8 text-red-600">
                <p className="text-sm sm:text-base">Error loading job matches: {jobsError}</p>
              </div>
            ) : jobMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {jobMatches.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="group"
                  >
                    <div className="h-full p-3 sm:p-6 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200 hover:border-primary-400 hover:shadow-xl transition-all duration-300">
                      {/* Match Score Badge */}
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1 flex items-start gap-2 sm:gap-3">
                          {/* Company Logo */}
                          {job.Company_Logo && (
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                              <img 
                                src={job.Company_Logo} 
                                alt={`${job.Company} logo`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  // Fallback to placeholder if logo fails to load
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.Company)}&background=6366f1&color=fff&size=128`;
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm sm:text-lg text-gray-800 mb-1 group-hover:text-primary-700 transition-colors truncate">
                              {job.Job_Title || job.title || 'Position'}
                            </h3>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                              <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="font-medium truncate">{job.Company || job.company || 'Company'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 sm:ml-4 flex-shrink-0">
                          <div className="flex flex-col items-center">
                            <div className="text-lg sm:text-2xl font-bold text-primary-600">
                              {job.matchScore}%
                            </div>
                            <div className="text-xs text-gray-500">Match</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Job Details */}
                      <div className="space-y-2 mb-4">
                        {job.Location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} />
                            <span>{job.Location}</span>
                          </div>
                        )}
                        {job.Work_Type && job.Work_Type !== 'Not specified' && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase size={14} />
                            <span>{job.Work_Type}</span>
                          </div>
                        )}
                        {job.Experience_Level && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Award size={14} />
                            <span>{job.Experience_Level}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* LinkedIn Link */}
                      {job.LinkedIn_URL && (
                        <a
                          href={job.LinkedIn_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors text-sm font-medium"
                        >
                          <SiLinkedin size={16} />
                          View on LinkedIn
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No job matches found. Please try uploading your CV again.</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Cover Letter Generator */}
        <CoverLetterGenerator cvData={cvData} />
      </div>
    </div>
  );
};

export default ResultsDashboard;
