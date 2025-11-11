/**
 * Technology Icons Mapping
 * Maps technology names to their corresponding icons from react-icons
 */

import {
  SiPython, SiJavascript, SiPhp, SiC, SiCplusplus,
  SiReact, SiVuedotjs, SiAngular, SiLaravel, SiDjango, SiFlask,
  SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiPostgresql,
  SiDocker, SiKubernetes, SiGooglecloud,
  SiTensorflow, SiPytorch, SiHtml5, SiCss3, SiTypescript,
  SiGit, SiGithub, SiLinux, SiTailwindcss, SiBootstrap,
  SiRedux, SiWebpack, SiVite, SiNpm, SiYarn,
  SiFirebase, SiGraphql,
  SiJest, SiPostman,
  SiFigma,
  SiJquery, SiSass, SiNextdotjs, SiNuxtdotjs,
  SiSpring, SiRedis, SiElasticsearch,
  SiGitlab, SiLinkedin
} from 'react-icons/si';

import {
  FaCode, FaDatabase, FaServer, FaCloud, FaMobile,
  FaRobot, FaBrain, FaNetworkWired, FaLaptopCode,
  FaTools, FaChartLine, FaProjectDiagram, FaJava
} from 'react-icons/fa';

/**
 * Get icon component for a technology
 * @param {string} tech - Technology name
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} Icon component
 */
export const getTechIcon = (tech, className = 'text-2xl') => {
  const techLower = tech.toLowerCase().trim();
  
  const iconMap = {
    // Programming Languages
    'python': <SiPython className={`${className} text-[#3776AB]`} title="Python" />,
    'javascript': <SiJavascript className={`${className} text-[#F7DF1E]`} title="JavaScript" />,
    'js': <SiJavascript className={`${className} text-[#F7DF1E]`} title="JavaScript" />,
    'java': <FaJava className={`${className} text-[#007396]`} title="Java" />,
    'php': <SiPhp className={`${className} text-[#777BB4]`} title="PHP" />,
    'c': <SiC className={`${className} text-[#A8B9CC]`} title="C" />,
    'c++': <SiCplusplus className={`${className} text-[#00599C]`} title="C++" />,
    'cpp': <SiCplusplus className={`${className} text-[#00599C]`} title="C++" />,
    'c#': <FaCode className={`${className} text-[#239120]`} title="C#" />,
    'csharp': <FaCode className={`${className} text-[#239120]`} title="C#" />,
    'typescript': <SiTypescript className={`${className} text-[#3178C6]`} title="TypeScript" />,
    'ts': <SiTypescript className={`${className} text-[#3178C6]`} title="TypeScript" />,
    
    // Frontend Frameworks
    'react': <SiReact className={`${className} text-[#61DAFB]`} title="React" />,
    'reactjs': <SiReact className={`${className} text-[#61DAFB]`} title="React" />,
    'vue': <SiVuedotjs className={`${className} text-[#4FC08D]`} title="Vue.js" />,
    'vuejs': <SiVuedotjs className={`${className} text-[#4FC08D]`} title="Vue.js" />,
    'angular': <SiAngular className={`${className} text-[#DD0031]`} title="Angular" />,
    'next.js': <SiNextdotjs className={`${className} text-[#000000]`} title="Next.js" />,
    'nextjs': <SiNextdotjs className={`${className} text-[#000000]`} title="Next.js" />,
    'nuxt.js': <SiNuxtdotjs className={`${className} text-[#00DC82]`} title="Nuxt.js" />,
    'nuxtjs': <SiNuxtdotjs className={`${className} text-[#00DC82]`} title="Nuxt.js" />,
    'jquery': <SiJquery className={`${className} text-[#0769AD]`} title="jQuery" />,
    
    // Backend Frameworks
    'laravel': <SiLaravel className={`${className} text-[#FF2D20]`} title="Laravel" />,
    'django': <SiDjango className={`${className} text-[#092E20]`} title="Django" />,
    'flask': <SiFlask className={`${className} text-[#000000]`} title="Flask" />,
    'node.js': <SiNodedotjs className={`${className} text-[#339933]`} title="Node.js" />,
    'nodejs': <SiNodedotjs className={`${className} text-[#339933]`} title="Node.js" />,
    'node': <SiNodedotjs className={`${className} text-[#339933]`} title="Node.js" />,
    'express': <SiExpress className={`${className} text-[#000000]`} title="Express.js" />,
    'expressjs': <SiExpress className={`${className} text-[#000000]`} title="Express.js" />,
    'spring': <SiSpring className={`${className} text-[#6DB33F]`} title="Spring" />,
    'spring boot': <SiSpring className={`${className} text-[#6DB33F]`} title="Spring Boot" />,
    'hibernate': <FaDatabase className={`${className} text-[#59666C]`} title="Hibernate" />,
    
    // Databases
    'mongodb': <SiMongodb className={`${className} text-[#47A248]`} title="MongoDB" />,
    'mongo': <SiMongodb className={`${className} text-[#47A248]`} title="MongoDB" />,
    'mysql': <SiMysql className={`${className} text-[#4479A1]`} title="MySQL" />,
    'phpmyadmin': <FaDatabase className={`${className} text-[#F29111]`} title="phpMyAdmin" />,
    'mysql workbench': <FaDatabase className={`${className} text-[#00758F]`} title="MySQL Workbench" />,
    'postgresql': <SiPostgresql className={`${className} text-[#4169E1]`} title="PostgreSQL" />,
    'postgres': <SiPostgresql className={`${className} text-[#4169E1]`} title="PostgreSQL" />,
    'redis': <SiRedis className={`${className} text-[#DC382D]`} title="Redis" />,
    'sqlite': <FaDatabase className={`${className} text-[#003B57]`} title="SQLite" />,
    'sqlite3': <FaDatabase className={`${className} text-[#003B57]`} title="SQLite" />,
    'elasticsearch': <SiElasticsearch className={`${className} text-[#005571]`} title="Elasticsearch" />,
    
    // GUI Frameworks
    'qt': <FaCode className={`${className} text-[#41CD52]`} title="Qt" />,
    
    // DevOps & Cloud
    'docker': <SiDocker className={`${className} text-[#2496ED]`} title="Docker" />,
    'kubernetes': <SiKubernetes className={`${className} text-[#326CE5]`} title="Kubernetes" />,
    'k8s': <SiKubernetes className={`${className} text-[#326CE5]`} title="Kubernetes" />,
    'aws': <FaCloud className={`${className} text-[#FF9900]`} title="AWS" />,
    'amazon web services': <FaCloud className={`${className} text-[#FF9900]`} title="AWS" />,
    'azure': <FaCloud className={`${className} text-[#0078D4]`} title="Azure" />,
    'gcp': <SiGooglecloud className={`${className} text-[#4285F4]`} title="Google Cloud" />,
    'google cloud': <SiGooglecloud className={`${className} text-[#4285F4]`} title="Google Cloud" />,
    'jenkins': <FaServer className={`${className} text-[#D24939]`} title="Jenkins" />,
    
    // AI/ML
    'tensorflow': <SiTensorflow className={`${className} text-[#FF6F00]`} title="TensorFlow" />,
    'pytorch': <SiPytorch className={`${className} text-[#EE4C2C]`} title="PyTorch" />,
    'machine learning': <FaBrain className={`${className} text-[#FF6B6B]`} title="Machine Learning" />,
    'ml': <FaBrain className={`${className} text-[#FF6B6B]`} title="Machine Learning" />,
    'deep learning': <FaRobot className={`${className} text-[#8B5CF6]`} title="Deep Learning" />,
    'ai': <FaRobot className={`${className} text-[#8B5CF6]`} title="Artificial Intelligence" />,
    
    // Web Technologies
    'html': <SiHtml5 className={`${className} text-[#E34F26]`} title="HTML5" />,
    'html5': <SiHtml5 className={`${className} text-[#E34F26]`} title="HTML5" />,
    'css': <SiCss3 className={`${className} text-[#1572B6]`} title="CSS3" />,
    'css3': <SiCss3 className={`${className} text-[#1572B6]`} title="CSS3" />,
    'sass': <SiSass className={`${className} text-[#CC6699]`} title="Sass" />,
    'scss': <SiSass className={`${className} text-[#CC6699]`} title="Sass" />,
    'tailwind': <SiTailwindcss className={`${className} text-[#06B6D4]`} title="Tailwind CSS" />,
    'tailwindcss': <SiTailwindcss className={`${className} text-[#06B6D4]`} title="Tailwind CSS" />,
    'tailwind css': <SiTailwindcss className={`${className} text-[#06B6D4]`} title="Tailwind CSS" />,
    'bootstrap': <SiBootstrap className={`${className} text-[#7952B3]`} title="Bootstrap" />,
    
    // Tools
    'git': <SiGit className={`${className} text-[#F05032]`} title="Git" />,
    'github': <SiGithub className={`${className} text-[#181717]`} title="GitHub" />,
    'gitlab': <SiGitlab className={`${className} text-[#FC6D26]`} title="GitLab" />,
    'vite': <SiVite className={`${className} text-[#646CFF]`} title="Vite" />,
    'webpack': <SiWebpack className={`${className} text-[#8DD6F9]`} title="Webpack" />,
    'npm': <SiNpm className={`${className} text-[#CB3837]`} title="npm" />,
    'yarn': <SiYarn className={`${className} text-[#2C8EBB]`} title="Yarn" />,
    'postman': <SiPostman className={`${className} text-[#FF6C37]`} title="Postman" />,
    'graphql': <SiGraphql className={`${className} text-[#E10098]`} title="GraphQL" />,
    'redux': <SiRedux className={`${className} text-[#764ABC]`} title="Redux" />,
    
    // Testing
    'jest': <SiJest className={`${className} text-[#C21325]`} title="Jest" />,
    'testing': <FaTools className={`${className} text-gray-600`} title="Testing" />,
    'cypress': <FaTools className={`${className} text-[#17202C]`} title="Cypress" />,
    
    // Design
    'figma': <SiFigma className={`${className} text-[#F24E1E]`} title="Figma" />,
    'design': <FaTools className={`${className} text-gray-600`} title="Design" />,
    
    // Operating Systems
    'linux': <SiLinux className={`${className} text-[#FCC624]`} title="Linux" />,
    
    // Default fallback icons
    'database': <FaDatabase className={`${className} text-gray-600`} title="Database" />,
    'api': <FaNetworkWired className={`${className} text-gray-600`} title="API" />,
    'cloud': <FaCloud className={`${className} text-gray-600`} title="Cloud" />,
    'mobile': <FaMobile className={`${className} text-gray-600`} title="Mobile" />,
  };
  
  // Return matching icon or default code icon
  return iconMap[techLower] || <FaCode className={`${className} text-gray-500`} title={tech} />;
};

/**
 * Get multiple tech icons for a list of technologies
 * @param {Array<string>} technologies - Array of technology names
 * @param {string} className - CSS classes for each icon
 * @returns {Array<JSX.Element>} Array of icon components
 */
export const getTechIcons = (technologies, className = 'text-2xl') => {
  if (!Array.isArray(technologies)) return [];
  return technologies.map((tech, index) => (
    <span key={index} className="inline-block">
      {getTechIcon(tech, className)}
    </span>
  ));
};

/**
 * Detect technologies from project description
 * @param {string} description - Project description
 * @returns {Array<string>} Detected technologies
 */
export const detectTechnologies = (description) => {
  if (!description) return [];
  
  const descLower = description.toLowerCase();
  const detectedTechs = [];
  
  const techKeywords = {
    'C': [' c,', ' c '], // Space before to avoid matching in words
    'C++': ['c++', 'cpp'],
    'Qt': ['qt'],
    'SQLite': ['sqlite'],
    'React': ['react', 'reactjs'],
    'Vue': ['vue', 'vuejs'],
    'Angular': ['angular'],
    'Node.js': ['node', 'nodejs', 'node.js'],
    'Python': ['python'],
    'Java': ['java'],
    'JavaScript': ['javascript'],
    'TypeScript': ['typescript'], // Removed 'ts' to avoid false positives
    'PHP': ['php'],
    'Laravel': ['laravel'],
    'Django': ['django'],
    'Flask': ['flask'],
    'MongoDB': ['mongodb', 'mongo'],
    'MySQL': ['mysql'],
    'PostgreSQL': ['postgresql', 'postgres'],
    'Firebase': ['firebase'],
    'Docker': ['docker'],
    'AWS': ['aws', 'amazon web services'],
    'TensorFlow': ['tensorflow'],
    'PyTorch': ['pytorch'],
    'HTML': ['html'],
    'CSS': ['css'],
    'Tailwind': ['tailwind'],
    'Bootstrap': ['bootstrap'],
    'Git': ['git'],
    'GitHub': ['github'],
  };
  
  Object.entries(techKeywords).forEach(([tech, keywords]) => {
    if (keywords.some(kw => descLower.includes(kw))) {
      detectedTechs.push(tech);
    }
  });
  
  return detectedTechs;
};
