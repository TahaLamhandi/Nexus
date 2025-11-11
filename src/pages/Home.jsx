import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp,
  Brain, 
  Rocket,
  ArrowRight,
  FileText
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
  const navigate = useNavigate();

  const howItWorks = [
    { step: '01', title: 'Upload Your CV', desc: 'Simply drag and drop your resume in PDF or Word format', icon: FileText },
    { step: '02', title: 'AI Analysis', desc: 'Our AI extracts and analyzes your skills, experience, and achievements', icon: Brain },
    { step: '03', title: 'Get Insights', desc: 'Receive personalized career predictions and recommendations', icon: TrendingUp },
    { step: '04', title: 'Take Action', desc: 'Apply to matched jobs and improve your skills based on insights', icon: Rocket },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[600px] h-[600px] bg-primary-300/20 rounded-full blur-3xl -top-48 -left-48"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute w-[600px] h-[600px] bg-secondary-300/20 rounded-full blur-3xl -bottom-48 -right-48"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] bg-pink-300/20 rounded-full blur-3xl top-1/2 left-1/2"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Main Hero Content */}
        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-8 border border-primary-200/50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="text-primary-600" size={20} />
            <span className="text-sm font-semibold text-gray-700">AI-Powered Career Analytics Platform</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text">Nexus</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your intelligent career companion that connects your skills and experience with the perfect opportunities. 
            Discover where you stand and where you can go next.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/upload')}
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Analysis
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.span>
              </span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-primary-50/50 to-secondary-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to unlock your career potential
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent -z-10" />
                )}
                <Card className="text-center h-full">
                  <div className="text-5xl font-bold text-primary-200 mb-4">{item.step}</div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CV Builder Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 opacity-60"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 border border-primary-200 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <FileText className="text-primary-600" size={18} />
              <span className="text-sm font-semibold text-primary-700">Professional CV Builder</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Create Your <span className="gradient-text">Professional CV</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Build a stunning, ATS-friendly CV in minutes with our intelligent CV builder. 
              Choose from professional templates and get instant PDF downloads.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4">
                <Sparkles className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Clean & Professional</h3>
              <p className="text-gray-600 text-sm">Modern black & white design that looks professional and passes ATS systems</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary-100">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center mb-4">
                <Brain className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Smart Sections</h3>
              <p className="text-gray-600 text-sm">Organize your education, experience, projects, and skills in a structured format</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center mb-4">
                <Rocket className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Instant PDF</h3>
              <p className="text-gray-600 text-sm">Download your professional CV as PDF immediately after creating it</p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/cv-builder')}
              className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white shadow-2xl shadow-primary-500/50 hover:shadow-primary-600/60 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2 text-white font-semibold text-lg px-4">
                <FileText size={22} />
                Create My CV
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <p className="text-sm text-gray-500 mt-4">No sign up required • Free forever • Instant download</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
