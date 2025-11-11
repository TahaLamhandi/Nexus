import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Rocket,
  Download,
  Plus,
  Trash2,
  ArrowLeft,
  Camera,
  Check,
  FileText
} from 'lucide-react';
import { generateCV } from '../utils/cvGenerator';

const CVBuilder = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [cvData, setCvData] = useState({
    personal: {
      fullName: '',
      title: '',
      summary: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      technical: [],
      languages: []
    }
  });

  // Temporary input states
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle personal info change
  const handlePersonalChange = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  // Add education
  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  // Update education
  const updateEducation = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Remove education
  const removeEducation = (id) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Add experience
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  // Update experience
  const updateExperience = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Remove experience
  const removeExperience = (id) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  // Add project
  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        link: ''
      }]
    }));
  };

  // Update project
  const updateProject = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  // Remove project
  const removeProject = (id) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  // Add skill
  const addSkill = () => {
    if (newSkill.trim()) {
      setCvData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          technical: [...prev.skills.technical, newSkill.trim()]
        }
      }));
      setNewSkill('');
    }
  };

  // Remove skill
  const removeSkill = (index) => {
    setCvData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: prev.skills.technical.filter((_, i) => i !== index)
      }
    }));
  };

  // Add language
  const addLanguage = () => {
    if (newLanguage.trim()) {
      setCvData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          languages: [...prev.skills.languages, newLanguage.trim()]
        }
      }));
      setNewLanguage('');
    }
  };

  // Remove language
  const removeLanguage = (index) => {
    setCvData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        languages: prev.skills.languages.filter((_, i) => i !== index)
      }
    }));
  };

  // Generate CV
  const handleGenerateCV = async () => {
    try {
      await generateCV(cvData, imagePreview);
      alert('CV generated successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Error generating CV. Please try again.');
    }
  };

  // Check if personal info is filled
  const isPersonalInfoComplete = () => {
    const { fullName, email, phone } = cvData.personal;
    return fullName && email && phone;
  };

  // Navigation sections
  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User, required: true },
    { id: 'education', name: 'Education', icon: GraduationCap, required: true },
    { id: 'experience', name: 'Experience', icon: Briefcase, required: false },
    { id: 'projects', name: 'Projects', icon: Rocket, required: false },
    { id: 'skills', name: 'Skills & Languages', icon: Code, required: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2.5 hover:bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft size={24} className="text-primary-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">
                  CV Builder
                </h1>
                <p className="text-sm text-gray-600 mt-1">Create your professional CV in minutes</p>
              </div>
            </div>
            <button
              onClick={handleGenerateCV}
              disabled={!isPersonalInfoComplete()}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${
                isPersonalInfoComplete()
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-2xl hover:shadow-primary-500/50 hover:scale-105 transform'
                  : 'bg-gray-300 cursor-not-allowed opacity-50'
              }`}
            >
              <Download size={20} />
              Generate CV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-primary-100 sticky top-6">
              <h3 className="text-sm font-bold text-gray-700 mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full"></div>
                Sections
              </h3>
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  const isComplete = section.id === 'personal' 
                    ? isPersonalInfoComplete()
                    : section.id === 'education' 
                    ? cvData.education.length > 0
                    : section.id === 'experience'
                    ? cvData.experience.length > 0
                    : section.id === 'projects'
                    ? cvData.projects.length > 0
                    : cvData.skills.technical.length > 0;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 transform ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-100 to-secondary-100 border-2 border-primary-400 text-primary-700 shadow-md scale-105'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:shadow-sm'
                      }`}
                    >
                      <Icon size={20} className={isActive ? 'text-primary-600' : ''} />
                      <span className="text-sm font-medium flex-1 text-left">
                        {section.name}
                      </span>
                      {section.required && (
                        <span className="text-xs text-red-500 font-bold">*</span>
                      )}
                      {isComplete && (
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-green-600" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-primary-100"
            >
              {/* Personal Info Section */}
              {activeSection === 'personal' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
                    <p className="text-gray-500 text-sm">Enter your basic contact information</p>
                  </div>

                  {/* Personal Fields */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                          <User size={18} className="text-primary-500" />
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cvData.personal.fullName}
                          onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                          placeholder="e.g., John Doe"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-gray-300"
                        />
                      </div>

                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                          <Briefcase size={18} className="text-primary-500" />
                          Professional Title
                        </label>
                        <input
                          type="text"
                          value={cvData.personal.title}
                          onChange={(e) => handlePersonalChange('title', e.target.value)}
                          placeholder="e.g., Software Engineer, Student"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-gray-300"
                        />
                      </div>
                    </div>

                    {/* Professional Summary - Full Width with spacing */}
                    <div className="pt-4 pb-4">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <FileText size={18} className="text-primary-500" />
                        Professional Summary
                      </label>
                      <textarea
                        value={cvData.personal.summary}
                        onChange={(e) => handlePersonalChange('summary', e.target.value)}
                        placeholder="Brief overview of your expertise, skills, and career objectives. This will appear at the top of your CV..."
                        rows="5"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none transition-all hover:border-gray-300"
                      />
                      <p className="text-xs text-gray-400 mt-2">Tip: Keep it concise and highlight your key strengths</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Mail size={16} className="text-primary-600" />
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={cvData.personal.email}
                        onChange={(e) => handlePersonalChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      />
                    </div>

                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                          <Mail size={18} className="text-primary-500" />
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={cvData.personal.email}
                          onChange={(e) => handlePersonalChange('email', e.target.value)}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-gray-300"
                        />
                      </div>

                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                          <Phone size={18} className="text-primary-500" />
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={cvData.personal.phone}
                          onChange={(e) => handlePersonalChange('phone', e.target.value)}
                          placeholder="+1 234 567 8900"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-gray-300"
                        />
                      </div>

                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                          <MapPin size={18} className="text-primary-500" />
                          Location
                        </label>
                        <input
                          type="text"
                          value={cvData.personal.location}
                          onChange={(e) => handlePersonalChange('location', e.target.value)}
                          placeholder="City, Country"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-gray-300"
                        />
                      </div>

                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                          <Globe size={18} className="text-primary-500" />
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={cvData.personal.linkedin}
                          onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/johndoe"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-gray-300"
                        />
                      </div>

                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                          <Code size={18} className="text-primary-500" />
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          value={cvData.personal.github}
                          onChange={(e) => handlePersonalChange('github', e.target.value)}
                          placeholder="github.com/johndoe"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-gray-300"
                        />
                      </div>

                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                          <Globe size={18} className="text-primary-500" />
                          Website/Portfolio
                        </label>
                        <input
                          type="url"
                          value={cvData.personal.website}
                          onChange={(e) => handlePersonalChange('website', e.target.value)}
                          placeholder="yourwebsite.com"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Education Section */}
              {activeSection === 'education' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Education</h2>
                    <button
                      onClick={addEducation}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={20} />
                      Add Education
                    </button>
                  </div>

                  {cvData.education.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <GraduationCap size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No education added yet. Click "Add Education" to start.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="p-6 border-2 border-gray-200 rounded-lg relative">
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Degree <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                placeholder="Bachelor of Science"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Institution <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                placeholder="University Name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                value={edu.location}
                                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                placeholder="City, Country"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Start Date
                                </label>
                                <input
                                  type="month"
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  End Date
                                </label>
                                <input
                                  type="month"
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                              </div>
                            </div>

                            <div className="col-span-2">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                value={edu.description}
                                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                placeholder="Relevant coursework, achievements, GPA, etc."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Experience Section */}
              {activeSection === 'experience' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
                      <p className="text-sm text-gray-600 mt-1">Optional - Skip if you don't have experience</p>
                    </div>
                    <button
                      onClick={addExperience}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={20} />
                      Add Experience
                    </button>
                  </div>

                  {cvData.experience.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No experience added. This section is optional.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="p-6 border-2 border-gray-200 rounded-lg relative">
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Position
                              </label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                placeholder="Software Engineer"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Company
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                placeholder="Company Name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                placeholder="City, Country"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Start Date
                                </label>
                                <input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  End Date
                                </label>
                                <input
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                  disabled={exp.current}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-100"
                                />
                              </div>
                            </div>

                            <div className="col-span-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={exp.current}
                                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                />
                                I currently work here
                              </label>
                            </div>

                            <div className="col-span-2">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                placeholder="Describe your responsibilities and achievements..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Projects Section */}
              {activeSection === 'projects' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Projects</h2>
                      <p className="text-sm text-gray-600 mt-1">Optional - Showcase your work</p>
                    </div>
                    <button
                      onClick={addProject}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={20} />
                      Add Project
                    </button>
                  </div>

                  {cvData.projects.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Rocket size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No projects added. This section is optional.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cvData.projects.map((proj) => (
                        <div key={proj.id} className="p-6 border-2 border-gray-200 rounded-lg relative">
                          <button
                            onClick={() => removeProject(proj.id)}
                            className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Name
                              </label>
                              <input
                                type="text"
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                placeholder="E-commerce Platform"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Technologies Used
                              </label>
                              <input
                                type="text"
                                value={proj.technologies}
                                onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                                placeholder="React, Node.js, MongoDB"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                            </div>

                            <div className="col-span-2">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Link (Optional)
                              </label>
                              <input
                                type="url"
                                value={proj.link}
                                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                                placeholder="https://github.com/..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                            </div>

                            <div className="col-span-2">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                placeholder="Describe what the project does and your role..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Skills & Languages</h2>

                  {/* Technical Skills */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Technical Skills
                    </label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="e.g., JavaScript, Python, React..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                      <button
                        onClick={addSkill}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.technical.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200"
                        >
                          <span>{skill}</span>
                          <button
                            onClick={() => removeSkill(index)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Languages
                    </label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                        placeholder="e.g., English (Native), French (Fluent)..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                      <button
                        onClick={addLanguage}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.languages.map((language, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200"
                        >
                          <span>{language}</span>
                          <button
                            onClick={() => removeLanguage(index)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;

