import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Briefcase, Code, GraduationCap, Award, ArrowLeft } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';

const ProfileInput = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    yearsExperience: 0,
    projectsCompleted: 0,
    pythonSkill: 50,
    reactSkill: 50,
    sqlSkill: 50,
    mlSkill: 50,
    educationLevel: 'bachelors',
    internshipCount: 0,
  });

  const skills = [
    { key: 'pythonSkill', label: 'Python', icon: '🐍' },
    { key: 'reactSkill', label: 'React', icon: '⚛️' },
    { key: 'sqlSkill', label: 'SQL', icon: '🗃️' },
    { key: 'mlSkill', label: 'Machine Learning', icon: '🤖' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call - replace with actual endpoint
      // await axios.post('', formData);
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to results with data
      navigate('/results', { state: { profileData: formData } });
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Failed to analyze profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Analyzing your career potential..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Your Career Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Tell us about your skills and experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Experience Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="text-primary-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={formData.yearsExperience}
                        onChange={(e) => handleChange('yearsExperience', parseFloat(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Projects Completed
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.projectsCompleted}
                        onChange={(e) => handleChange('projectsCompleted', parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Internship Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.internshipCount}
                        onChange={(e) => handleChange('internshipCount', parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="text-primary-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Education Level
                    </label>
                    <select
                      value={formData.educationLevel}
                      onChange={(e) => handleChange('educationLevel', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors bg-white"
                      required
                    >
                      <option value="highschool">High School</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="text-primary-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">Technical Skills</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {skills.map(({ key, label, icon }) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span>{icon}</span>
                            {label}
                          </label>
                          <span className="text-primary-600 font-bold text-lg">
                            {formData[key]}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData[key]}
                          onChange={(e) => handleChange(key, parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(147, 51, 234) ${formData[key]}%, rgb(229, 231, 235) ${formData[key]}%, rgb(229, 231, 235) 100%)`
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full">
                  Analyze Career Potential
                </Button>
              </form>
            </Card>
          </div>

          {/* Live Preview Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-primary-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Profile Preview</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Experience</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {formData.yearsExperience} years
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Projects</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {formData.projectsCompleted}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Education</div>
                  <div className="text-lg font-bold text-gray-800 capitalize">
                    {formData.educationLevel}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Skill Average</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.round((formData.pythonSkill + formData.reactSkill + formData.sqlSkill + formData.mlSkill) / 4)}%
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInput;
