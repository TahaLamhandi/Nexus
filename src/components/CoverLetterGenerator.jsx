import { useState } from 'react';
import { FileText, Download, Building2, Briefcase, GraduationCap } from 'lucide-react';
import { generateCoverLetter } from '../utils/coverLetterGenerator';

const CoverLetterGenerator = ({ cvData }) => {
  console.log('✅ Simple CoverLetterGenerator v4 LOADED! Clean UI + Bubbles in PDF');
  const [companyName, setCompanyName] = useState('');
  const [letterType, setLetterType] = useState('job');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!companyName.trim()) {
      alert('Please enter a company name');
      return;
    }

    setIsGenerating(true);

    try {
      await generateCoverLetter({
        applicantName: cvData.name || 'Candidate',
        email: cvData.email || '',
        phone: cvData.phone || '',
        companyName: companyName,
        letterType: letterType,
        skills: cvData.skills || [],
        biography: cvData.biography || cvData.profile || '',
        projects: cvData.projects || []
      });
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Error generating cover letter. Please try again.');
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="mt-8 bg-white rounded-xl p-8 border border-gray-200 shadow-sm" data-version="v4-simple">
      {/* Simple Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        <div className="bg-indigo-600 p-3 rounded-lg">
          <FileText className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Cover Letter Generator
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Create a professional cover letter tailored to your dream company
          </p>
        </div>
      </div>

      {/* Company Name Input */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Building2 size={18} className="text-indigo-600" />
          Company Name
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g., Google, Microsoft, Meta"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Letter Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Application Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          {/* Internship Option */}
          <button
            onClick={() => setLetterType('internship')}
            className={`p-4 rounded-lg border-2 transition-all ${
              letterType === 'internship'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 bg-white hover:border-indigo-400'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <GraduationCap 
                size={28} 
                className={letterType === 'internship' ? 'text-indigo-600' : 'text-gray-400'}
              />
              <span className={`font-semibold text-sm ${
                letterType === 'internship' ? 'text-indigo-600' : 'text-gray-600'
              }`}>
                Internship
              </span>
            </div>
          </button>

          {/* Job Option */}
          <button
            onClick={() => setLetterType('job')}
            className={`p-4 rounded-lg border-2 transition-all ${
              letterType === 'job'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 bg-white hover:border-indigo-400'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <Briefcase 
                size={28} 
                className={letterType === 'job' ? 'text-indigo-600' : 'text-gray-400'}
              />
              <span className={`font-semibold text-sm ${
                letterType === 'job' ? 'text-indigo-600' : 'text-gray-600'
              }`}>
                Full-Time Job
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Preview Info */}
      {cvData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Your letter will include:</span>
          </p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• {cvData.skills?.length || 0} technical skills</li>
            <li>• {cvData.projects?.length || 0} notable projects</li>
            <li>• Professional biography and qualifications</li>
            <li>• Customized for {companyName || 'your target company'}</li>
          </ul>
        </div>
      )}

      {/* Generate Button with Hover Effect */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !companyName.trim()}
        className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-3 ${
          isGenerating || !companyName.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Generating Your Letter...
          </>
        ) : (
          <>
            <Download size={20} />
            Generate & Download PDF
          </>
        )}
      </button>
    </div>
  );
};

export default CoverLetterGenerator;
