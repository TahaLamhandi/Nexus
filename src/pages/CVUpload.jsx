import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Upload,
  FileText,
  CheckCircle2,
  X,
  ArrowLeft,
  FileCheck,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { parseCVFile } from '../utils/cvParser';

const CVUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const acceptedFormats = ['.pdf', '.doc', '.docx'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!acceptedFormats.includes(fileExtension)) {
      return 'Please upload a PDF or Word document (.pdf, .doc, .docx)';
    }
    
    if (file.size > maxFileSize) {
      return 'File size must be less than 10MB';
    }
    
    return null;
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setUploadError('');

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const error = validateFile(droppedFile);
      if (error) {
        setUploadError(error);
      } else {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileSelect = (e) => {
    setUploadError('');
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const error = validateFile(selectedFile);
      if (error) {
        setUploadError(error);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadError('');
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      console.log('====================================');
      console.log('🚀 Starting CV Upload and Parsing...');
      console.log('====================================');
      console.log('📄 File Name:', file.name);
      console.log('📦 File Size:', formatFileSize(file.size));
      console.log('📋 File Type:', file.type);
      console.log('');

      // Parse the CV file
      console.log('🔍 Parsing CV content...');
      const cvData = await parseCVFile(file);
      
      console.log('');
      console.log('✅ CV PARSED SUCCESSFULLY!');
      console.log('====================================');
      console.log('📊 EXTRACTED CV INFORMATION:');
      console.log('====================================');
      console.log('');
      
      // Display all extracted features
      console.log('👤 PERSONAL INFORMATION:');
      console.log('   Name:', cvData.name || 'Not found');
      console.log('   Email:', cvData.email || 'Not found');
      console.log('   Phone:', cvData.phone || 'Not found');
      console.log('');
      
      console.log('💼 SKILLS (' + cvData.skills.length + ' found):');
      if (cvData.skills.length > 0) {
        cvData.skills.forEach((skill, index) => {
          console.log(`   ${index + 1}. ${skill}`);
        });
      } else {
        console.log('   No skills detected');
      }
      console.log('');
      
      console.log('🎓 EDUCATION (' + cvData.education.length + ' entries):');
      if (cvData.education.length > 0) {
        cvData.education.forEach((edu, index) => {
          console.log(`   ${index + 1}. ${edu.degree}`);
          console.log(`      Institution: ${edu.institution}`);
          console.log(`      Year: ${edu.year || 'Not specified'}`);
        });
      } else {
        console.log('   No education entries found');
      }
      console.log('');
      
      console.log('💻 WORK EXPERIENCE (' + cvData.experience.length + ' entries):');
      if (cvData.experience.length > 0) {
        cvData.experience.forEach((exp, index) => {
          console.log(`   ${index + 1}. ${exp.title}`);
          console.log(`      Company: ${exp.company}`);
          console.log(`      Duration: ${exp.duration || 'Not specified'}`);
          if (exp.description.length > 0) {
            console.log(`      Responsibilities:`);
            exp.description.forEach(desc => {
              console.log(`         - ${desc}`);
            });
          }
        });
      } else {
        console.log('   No work experience found');
      }
      console.log('');
      
      console.log('🚀 PROJECTS (' + cvData.projects.length + ' found):');
      if (cvData.projects.length > 0) {
        cvData.projects.forEach((project, index) => {
          console.log(`   ${index + 1}. ${project.name}`);
          if (project.description.length > 0) {
            console.log(`      Description:`);
            project.description.forEach(desc => {
              console.log(`         - ${desc}`);
            });
          }
        });
      } else {
        console.log('   No projects found');
      }
      console.log('');
      
      console.log('🌍 LANGUAGES (' + cvData.languages.length + ' found):');
      if (cvData.languages.length > 0) {
        cvData.languages.forEach((lang, index) => {
          console.log(`   ${index + 1}. ${lang}`);
        });
      } else {
        console.log('   No languages detected');
      }
      console.log('');
      
      console.log('🏆 CERTIFICATIONS (' + cvData.certifications.length + ' found):');
      if (cvData.certifications.length > 0) {
        cvData.certifications.forEach((cert, index) => {
          console.log(`   ${index + 1}. ${cert}`);
        });
      } else {
        console.log('   No certifications found');
      }
      console.log('');
      
      // Create features array
      const featuresArray = [
        {
          category: 'Personal Information',
          features: [
            { name: 'Name', value: cvData.name },
            { name: 'Email', value: cvData.email },
            { name: 'Phone', value: cvData.phone }
          ]
        },
        {
          category: 'Skills',
          features: cvData.skills.map(skill => ({ name: skill, value: true }))
        },
        {
          category: 'Education',
          features: cvData.education.map(edu => ({
            degree: edu.degree,
            institution: edu.institution,
            year: edu.year
          }))
        },
        {
          category: 'Experience',
          features: cvData.experience.map(exp => ({
            title: exp.title,
            company: exp.company,
            duration: exp.duration,
            responsibilities: exp.description
          }))
        },
        {
          category: 'Projects',
          features: cvData.projects.map(project => ({
            name: project.name,
            description: project.description
          }))
        },
        {
          category: 'Languages',
          features: cvData.languages.map(lang => ({ name: lang, value: true }))
        },
        {
          category: 'Certifications',
          features: cvData.certifications.map(cert => ({ name: cert, value: true }))
        }
      ];
      
      console.log('====================================');
      console.log('📦 FEATURES ARRAY (Structured Data):');
      console.log('====================================');
      console.log(JSON.stringify(featuresArray, null, 2));
      console.log('');
      console.log('====================================');
      console.log('✨ Upload Complete!');
      console.log('====================================');

      // Optional: Send to backend API
      // const formData = new FormData();
      // formData.append('cv', file);
      // formData.append('cvData', JSON.stringify(cvData));
      // await axios.post('YOUR_API_ENDPOINT/upload-cv', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      setUploadSuccess(true);
      
      // Navigate to results with extracted data
      setTimeout(() => {
        navigate('/results', { 
          state: { 
            fileName: file.name,
            uploadDate: new Date().toISOString(),
            cvData: cvData,
            featuresArray: featuresArray
          } 
        });
      }, 1500);

    } catch (error) {
      console.error('====================================');
      console.error('❌ UPLOAD ERROR:');
      console.error('====================================');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error:', error);
      console.error('====================================');
      
      // Provide specific error messages based on the error type
      let errorMessage = 'Failed to parse CV. ';
      
      if (error.message.includes('image-based') || error.message.includes('no extractable text')) {
        errorMessage = '⚠️ This PDF appears to be image-based (scanned). Please use a PDF with selectable text, or try uploading your previous CV that worked (Taha Lamhandi CV.pdf).';
      } else if (error.message.includes('PDF parsing failed')) {
        errorMessage = '❌ Could not read this PDF file. It may be corrupted or password-protected. Please try a different file.';
      } else {
        errorMessage += error.message;
      }
      
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <motion.button
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 mb-4 sm:mb-6 rounded-xl glass border border-gray-200/50 hover:border-primary-300 transition-all duration-300"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600 group-hover:text-primary-600 transition-colors" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-primary-700 transition-colors">
              Back to Home
            </span>
          </motion.button>
          
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Sparkles className="text-primary-600 w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold gradient-text">
              Upload Your CV
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Let our AI analyze your resume and predict your career potential
          </p>
        </motion.div>

        {/* Main Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 sm:p-8 md:p-12">
            {!isUploading && !uploadSuccess ? (
              <>
                {/* Upload Area */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-3 border-dashed rounded-2xl p-6 sm:p-12 transition-all duration-300
                    ${isDragging 
                      ? 'border-primary-500 bg-primary-50 scale-105' 
                      : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                    }
                    ${file ? 'border-green-400 bg-green-50/30' : ''}
                  `}
                >
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {!file ? (
                    <motion.div 
                      className="text-center"
                      animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
                    >
                      <motion.div
                        className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 mb-4 sm:mb-6"
                        animate={isDragging ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Upload className="text-primary-600 w-7 h-7 sm:w-10 sm:h-10" />
                      </motion.div>

                      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                        {isDragging ? 'Drop your CV here' : 'Drag & drop your CV'}
                      </h3>
                      
                      <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                        or click to browse from your device
                      </p>

                      <label htmlFor="cv-upload" className="inline-block cursor-pointer">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Browse Files
                        </motion.span>
                      </label>

                      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-500 mb-2">
                          Accepted formats: <span className="font-semibold text-gray-700">PDF, DOC, DOCX</span>
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Maximum file size: <span className="font-semibold text-gray-700">10MB</span>
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between bg-white rounded-xl p-3 sm:p-6 shadow-sm"
                    >
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                          <FileText className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="ml-2 sm:ml-4 p-1.5 sm:p-2 hover:bg-red-50 rounded-full transition-colors group flex-shrink-0"
                      >
                        <X className="text-gray-400 group-hover:text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {uploadError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3"
                    >
                      <AlertCircle className="text-red-500 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 mt-0.5" />
                      <p className="text-red-700 text-xs sm:text-sm">{uploadError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Upload Button */}
                {file && !uploadError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 sm:mt-6"
                  >
                    <Button
                      onClick={handleUpload}
                      size="lg"
                      className="w-full flex items-center justify-center text-sm sm:text-base"
                    >
                      <FileCheck size={18} className="mr-2" />
                      Analyze My CV
                    </Button>
                  </motion.div>
                )}
              </>
            ) : isUploading ? (
              <div className="text-center py-8 sm:py-12">
                <Loader size="lg" text="Analyzing your CV with AI..." />
                <motion.div
                  className="mt-6 sm:mt-8 space-y-2 sm:space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-xs sm:text-base">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <CheckCircle2 className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                    <span>Extracting information...</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-xs sm:text-base">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, delay: 0.3, repeat: Infinity }}
                    >
                      <CheckCircle2 className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                    <span>Analyzing skills and experience...</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-xs sm:text-base">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, delay: 0.6, repeat: Infinity }}
                    >
                      <CheckCircle2 className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                    <span>Generating predictions...</span>
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 sm:py-12"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 mb-4 sm:mb-6"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle2 className="text-green-600 w-10 h-10 sm:w-12 sm:h-12" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                  Upload Successful!
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                  Your CV has been analyzed. Redirecting to results...
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Info Cards */}
        {!isUploading && !uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8"
          >
            {[
              {
                icon: FileCheck,
                title: 'Quick Analysis',
                desc: 'Get results in under 30 seconds'
              },
              {
                icon: Sparkles,
                title: 'AI-Powered',
                desc: 'Advanced ML algorithms at work'
              },
              {
                icon: CheckCircle2,
                title: '100% Secure',
                desc: 'Your data is encrypted and safe'
              }
            ].map((item, index) => (
              <Card key={index} className="text-center p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <item.icon className="text-primary-600 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CVUpload;
