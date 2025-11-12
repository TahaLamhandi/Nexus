import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up the worker for PDF.js using the local build
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Parse CV file and extract information
 * @param {File} file - The CV file (PDF or Word)
 * @returns {Promise<Object>} Extracted CV information
 */
export const parseCVFile = async (file) => {
  try {
    console.log('=== CV Parser Debug Info ===');
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);
    
    let text = '';
    
    // Extract text based on file type
    if (file.type === 'application/pdf') {
      console.log('Detected PDF file');
      text = await parsePDF(file);
    } else if (
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      console.log('Detected Word document');
      text = await parseWord(file);
    } else {
      throw new Error(`Unsupported file format: ${file.type}. Please use PDF or Word documents.`);
    }

    console.log('Text extracted, length:', text.length);
    console.log('First 200 characters:', text.substring(0, 200));

    // Extract information from text
    const cvData = extractCVInformation(text);
    
    return cvData;
  } catch (error) {
    console.error('Error parsing CV:', error);
    throw error;
  }
};

/**
 * Parse PDF file using PDF.js (browser-compatible)
 */
const parsePDF = async (file) => {
  try {
    console.log('🔄 Starting PDF parsing with LINE-PRESERVING parser (v2)...');
    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer size:', arrayBuffer.byteLength);
    
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    console.log('Loading PDF document...');
    
    const pdf = await loadingTask.promise;
    console.log('PDF loaded. Number of pages:', pdf.numPages);
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`Extracting text from page ${pageNum}...`);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      console.log(`Page ${pageNum} - Number of text items:`, textContent.items.length);
      
      // Check if PDF has text content
      if (textContent.items.length === 0) {
        console.warn(`⚠️ Page ${pageNum} has NO text items - this might be an image-based PDF!`);
        console.warn('💡 Tip: This PDF may be scanned or image-based. OCR would be needed to extract text.');
        continue;
      }
      
      // Group text items by their Y position to preserve line structure
      const itemsByLine = {};
      
      textContent.items.forEach(item => {
        const y = Math.round(item.transform[5]); // Y coordinate
        if (!itemsByLine[y]) {
          itemsByLine[y] = [];
        }
        itemsByLine[y].push({
          text: item.str,
          x: item.transform[4] // X coordinate for sorting
        });
      });
      
      // Sort lines by Y coordinate (top to bottom) and items by X coordinate (left to right)
      const sortedYs = Object.keys(itemsByLine)
        .map(Number)
        .sort((a, b) => b - a); // Sort descending (top to bottom in PDF coordinates)
      
      const lines = sortedYs.map(y => {
        const items = itemsByLine[y].sort((a, b) => a.x - b.x);
        return items.map(item => item.text).join(' ').trim();
      });
      
      fullText += lines.filter(line => line.length > 0).join('\n') + '\n';
    }
    
    console.log('PDF text extraction complete. Text length:', fullText.length);
    
    // Warn if no text was extracted
    if (fullText.trim().length === 0) {
      console.error('❌ NO TEXT EXTRACTED FROM PDF!');
      console.error('This PDF appears to be:');
      console.error('  • Image-based (scanned document)');
      console.error('  • Protected/encrypted');
      console.error('  • Corrupted');
      console.error('');
      console.error('💡 Solutions:');
      console.error('  1. Try converting the PDF to text using online tools');
      console.error('  2. Use a PDF with selectable text (not scanned)');
      console.error('  3. Try uploading a Word document (.docx) instead');
      throw new Error('PDF contains no extractable text. This appears to be an image-based or protected PDF.');
    }
    
    return fullText;
  } catch (error) {
    console.error('Error in parsePDF:', error);
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

/**
 * Parse Word document
 */
const parseWord = async (file) => {
  try {
    console.log('Starting Word document parsing...');
    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer size:', arrayBuffer.byteLength);
    
    const result = await mammoth.extractRawText({ arrayBuffer });
    console.log('Word text extraction complete. Text length:', result.value.length);
    
    return result.value;
  } catch (error) {
    console.error('Error in parseWord:', error);
    throw new Error(`Word document parsing failed: ${error.message}`);
  }
};

/**
 * Extract structured information from CV text
 */
/**
 * Extract country from CV
 */
const extractCountry = (text) => {
  console.log('🌍 Extracting country...');
  
  const countryPatterns = [
    { name: 'Morocco', patterns: ['morocco', 'maroc', 'rabat', 'casablanca', 'meknès', 'meknes', 'fès', 'fes', 'tanger', 'marrakech', 'agadir'] },
    { name: 'France', patterns: ['france', 'paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'strasbourg', 'bordeaux'] },
    { name: 'Canada', patterns: ['canada', 'toronto', 'montreal', 'vancouver', 'ottawa', 'calgary', 'edmonton', 'québec'] },
    { name: 'United States', patterns: ['usa', 'united states', 'new york', 'california', 'texas', 'florida', 'chicago', 'boston', 'seattle'] },
    { name: 'United Kingdom', patterns: ['uk', 'united kingdom', 'london', 'manchester', 'birmingham', 'edinburgh', 'glasgow'] },
    { name: 'Germany', patterns: ['germany', 'allemagne', 'berlin', 'munich', 'hamburg', 'frankfurt', 'cologne'] },
    { name: 'Spain', patterns: ['spain', 'espagne', 'madrid', 'barcelona', 'valencia', 'seville'] },
    { name: 'Italy', patterns: ['italy', 'italie', 'rome', 'milan', 'naples', 'turin', 'florence'] },
  ];
  
  const textLower = text.toLowerCase();
  
  for (const country of countryPatterns) {
    for (const pattern of country.patterns) {
      if (textLower.includes(pattern)) {
        console.log(`✅ Country detected: ${country.name} (matched: ${pattern})`);
        return country.name;
      }
    }
  }
  
  console.log('⚠️ No country detected');
  return null;
};

/**
 * Extract location from CV
 */
const extractLocation = (text) => {
  console.log('📍 Extracting location...');
  
  const lines = text.split('\n');
  
  // Look for address patterns in first 15 lines
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i].trim();
    
    // Match city patterns
    if (line.match(/^[A-Za-zÀ-ÿ\s-]+,\s*[A-Za-zÀ-ÿ\s]+$/)) {
      console.log(`✅ Location found: ${line}`);
      return line;
    }
  }
  
  console.log('⚠️ No specific location found');
  return null;
};

const extractCVInformation = (text) => {
  console.log('\n========== STARTING CV INFORMATION EXTRACTION ==========');
  console.log('Total text length:', text.length);
  console.log('\n📄 Full CV Text Preview (first 1000 chars):');
  console.log(text.substring(0, 1000));
  
  // Show text structure for debugging
  const lines = text.split('\n');
  console.log('\n📋 Text Structure:');
  console.log(`  Total lines: ${lines.length}`);
  console.log(`  Non-empty lines: ${lines.filter(l => l.trim().length > 0).length}`);
  console.log('\n📋 First 25 non-empty lines:');
  let count = 0;
  for (let i = 0; i < lines.length && count < 25; i++) {
    if (lines[i].trim().length > 0) {
      console.log(`  Line ${i + 1}: "${lines[i].trim().substring(0, 80)}"`);
      count++;
    }
  }
  
  const cvInfo = {
    rawText: text,
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    contact: {
      country: extractCountry(text),
      location: extractLocation(text)
    },
    skills: extractSkills(text),
    education: extractEducation(text),
    experience: extractExperience(text),
    projects: extractProjects(text),
    languages: extractLanguages(text),
    certifications: extractCertifications(text),
  };

  console.log('\n========== EXTRACTION COMPLETE ==========\n');
  return cvInfo;
};

/**
 * Extract name (usually at the top of CV)
 */
const extractName = (text) => {
  console.log('👤 Extracting name...');
  
  // Look for name at the beginning (first few lines)
  const lines = text.split('\n').filter(line => line.trim());
  
  console.log('First 10 lines for name detection:');
  lines.slice(0, 10).forEach((line, idx) => console.log(`  ${idx}: "${line.trim()}"`));
  
  // Check if first two lines are single words (common in modern CVs: FIRSTNAME on line 1, LASTNAME on line 2)
  if (lines.length >= 2) {
    const line1 = lines[0].trim();
    const line2 = lines[1].trim();
    
    // Pattern: Single word per line (e.g., "TAHA" and "LAMHANDI")
    if (line1.length >= 3 && line1.length <= 25 && 
        line2.length >= 3 && line2.length <= 25 &&
        /^[A-ZÀ-Ÿ]+$/.test(line1) && 
        /^[A-ZÀ-Ÿ]+$/.test(line2) &&
        !line1.match(/CV|RESUME|CURRICULUM|STAGE|INTERNSHIP/) &&
        !line2.match(/CV|RESUME|CURRICULUM|STAGE|INTERNSHIP/)) {
      const firstName = line1.charAt(0) + line1.slice(1).toLowerCase();
      const lastName = line2.charAt(0) + line2.slice(1).toLowerCase();
      const name = `${firstName} ${lastName}`;
      console.log(`✅ Name found (Two-line format): ${name}`);
      return name;
    }
  }
  
  // Special case: Check if name is split across first few lines (common in CVs)
  // e.g., Line 0: "Lamhandi", Line 5: "Taha"
  const potentialLastName = lines[0]?.trim();
  const potentialFirstName = lines.slice(1, 10).find(line => {
    const trimmed = line.trim();
    return trimmed.length >= 3 && trimmed.length <= 20 && 
           /^[A-ZÀ-ÿ][a-zà-ÿ]+$/.test(trimmed) &&
           !trimmed.match(/\d/) && // No numbers
           !trimmed.match(/@/) && // No email symbols
           !trimmed.match(/ans|Meknès|célibataire|Nationale|nationale/i); // Not personal info
  })?.trim();
  
  if (potentialLastName && potentialFirstName && 
      /^[A-ZÀ-ÿ][a-zà-ÿ]+$/.test(potentialLastName) &&
      /^[A-ZÀ-ÿ][a-zà-ÿ]+$/.test(potentialFirstName) &&
      !potentialLastName.match(/Nationale|nationale/i)) {
    const name = `${potentialFirstName} ${potentialLastName}`;
    console.log(`✅ Name found (Split lines): ${name}`);
    return name;
  }
  
  // Check first 10 lines for potential name
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    
    // Skip lines with common CV headers or long text
    if (line.length > 60 || line.length < 3) continue;
    if (/ingénieur|engineer|cv|resume|curriculum|élève|stage|transformation|digital|looking|for|internship/i.test(line)) continue;
    
    // Pattern 0: "LASTNAME FIRST PART" (all caps, possibly fragmented)
    // Handles: "HAMRI YASS IR" → "YASSIR HAMRI"
    const pattern0 = /^([A-ZÀ-Ÿ]{4,})\s+([A-ZÀ-Ÿ]{2,})\s+([A-ZÀ-Ÿ]{2,})$/;
    const match0 = line.match(pattern0);
    if (match0) {
      const firstName = match0[2] + match0[3]; // Combine "YASS" + "IR" = "YASSIR"
      const lastName = match0[1];
      const name = `${firstName.charAt(0) + firstName.slice(1).toLowerCase()} ${lastName.charAt(0) + lastName.slice(1).toLowerCase()}`;
      console.log(`✅ Name found (Pattern 0 - Fragmented): ${name}`);
      return name;
    }
    
    // Pattern 1: "LASTNAME FIRSTNAME" (all caps)
    const pattern1 = /^([A-ZÀ-Ÿ]{3,})\s+([A-ZÀ-Ÿ]{3,})$/;
    const match1 = line.match(pattern1);
    if (match1) {
      const firstName = match1[2].charAt(0) + match1[2].slice(1).toLowerCase();
      const lastName = match1[1].charAt(0) + match1[1].slice(1).toLowerCase();
      const name = `${firstName} ${lastName}`;
      console.log(`✅ Name found (Pattern 1 - LASTNAME FIRSTNAME): ${name}`);
      return name;
    }
    
    // Pattern 2: "Lastname Firstname" (all caps + capitalized)
    const pattern2 = /^([A-ZÀ-Ÿ]+)\s+([A-ZÀ-ÿ][a-zà-ÿ]+)$/;
    const match2 = line.match(pattern2);
    if (match2) {
      const name = `${match2[2]} ${match2[1]}`; // Flip to "Firstname Lastname"
      console.log(`✅ Name found (Pattern 2 - LASTNAME Firstname): ${name}`);
      return name;
    }
    
    // Pattern 3: "Firstname Lastname" (standard capitalization)
    const pattern3 = /^([A-ZÀ-ÿ][a-zà-ÿ]+)\s+([A-ZÀ-ÿ][a-zà-ÿ]+)$/;
    const match3 = line.match(pattern3);
    if (match3) {
      console.log(`✅ Name found (Pattern 3 - Firstname Lastname): ${line}`);
      return line;
    }
  }
  
  console.log('❌ No name found in standard patterns');
  return 'Name not found';
};

/**
 * Extract email address
 */
const extractEmail = (text) => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi;
  const emails = text.match(emailRegex);
  return emails ? emails[0] : null;
};

/**
 * Extract phone number
 */
const extractPhone = (text) => {
  // Support multiple phone formats including Moroccan/French formats
  const phonePatterns = [
    /\+\d{1,3}\s?\d{3}[-.\s]?\d{3}[-.\s]?\d{3,5}/g, // +212 776-858895 (Moroccan)
    /\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, // International (US style)
    /\b\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\b/g, // French format: 07 06 70 65 51
    /\b0\d{9}\b/g // French without spaces: 0706706551
  ];
  
  for (const pattern of phonePatterns) {
    const phones = text.match(pattern);
    if (phones) return phones[0];
  }
  
  return null;
};

/**
 * Extract skills
 */
const extractSkills = (text) => {
  const skills = [];
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'C',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
    'HTML', 'CSS', 'Sass', 'TypeScript', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub', 'GitLab',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
    'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'CI/CD', 'Jenkins',
    'Linux', 'Windows', 'macOS', 'Bash', 'PowerShell', 'Qt', 'SQLite',
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'phpMyAdmin', 'MySQL Workbench',
    'Excel', 'PowerPoint', 'Word', 'Tableau', 'Power BI'
  ];

  // Find skills section
  // Look for section that contains actual technical skills, not soft skills
  console.log('💼 Extracting skills...');
  
  const lines = text.split('\n');
  let skillsSectionContent = '';
  let inTechSkillsSection = false;
  let sectionStarted = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNoSpaces = line.replace(/\s+/g, '').toLowerCase();
    
    // Detect TECH SKILLS section (including spaced "T E C H S K I L L S")
    if (lineNoSpaces.includes('techskills') || lineNoSpaces.includes('technicalskills') || 
        lineNoSpaces.includes('competencestechniques')) {
      console.log(`✅ Found TECH SKILLS section at line ${i}: "${line}"`);
      inTechSkillsSection = true;
      sectionStarted = true;
      continue;
    }
    
    // Stop at next major section header (NOT skill categories like "Programming Languages:")
    if (sectionStarted) {
      // Only stop if it's a MAJOR section header (short line with section keyword, NOT a colon line)
      const isMajorSectionHeader = line.length < 50 && 
                                    !line.includes(':') && 
                                    lineNoSpaces.match(/^(certifications|certification|languages|langues|activite|activiteparascolaire|interests|hobbies|softskills)/);
      
      if (isMajorSectionHeader) {
        console.log(`⏹️  Tech skills section ended at line ${i}: "${line}"`);
        break;
      }
    }
    
    // Collect content if in tech skills section
    if (inTechSkillsSection && line.length > 0) {
      skillsSectionContent += line + '\n';
    }
  }
  
  console.log('🔍 Tech skills section found:', skillsSectionContent.length > 0 ? 'Yes' : 'No');
  if (skillsSectionContent) {
    console.log('📄 Skills section content:', skillsSectionContent);
  }
  
  const searchText = skillsSectionContent || text;

  // Normalize the search text for better matching (join broken lines)
  const normalizedText = searchText.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  
  skillKeywords.forEach(skill => {
    const skillLower = skill.toLowerCase();
    const searchLower = normalizedText.toLowerCase();
    
    // Special handling for C++ (word boundary doesn't work with ++)
    if (skill === 'C++') {
      if (searchText.includes('C++') || normalizedText.toLowerCase().includes('cpp')) {
        skills.push(skill);
        console.log(`✅ Found skill: ${skill}`);
      }
      return;
    }
    
    // Special handling for C (avoid matching in words like "Science")
    if (skill === 'C') {
      // Match "C," or "C\n" or "C " or "Languages: C" or ": C,"
      if (searchText.match(/\bC[,\s\n]|Languages:\s*C|:\s*C[,\s]|^C,/m)) {
        skills.push(skill);
        console.log(`✅ Found skill: ${skill}`);
      }
      return;
    }
    
    // For multi-word skills (e.g., "MySQL Workbench"), check exact match
    if (skill.includes(' ')) {
      if (searchLower.includes(skillLower)) {
        skills.push(skill);
        console.log(`✅ Found skill: ${skill}`);
      }
      return;
    }
    
    // Escape special regex characters in skill names
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      skills.push(skill);
      console.log(`✅ Found skill: ${skill}`);
    }
  });

  console.log(`📊 Total skills found: ${skills.length}`);
  return [...new Set(skills)]; // Remove duplicates
};

/**
 * Extract education
 */
const extractEducation = (text) => {
  console.log('🎓 Extracting education...');
  
  const education = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const educationSection = findSection(text, [
    'education', 'academic background', 'qualifications',
    'diplômes', 'formations', 'diplôme', 'formation académique',
    'diplômes et formations'
  ]);
  
  console.log('Education section found:', educationSection ? 'Yes' : 'No');
  
  const searchLines = educationSection ? educationSection.split('\n').filter(l => l.trim()) : lines;
  
  const degreeKeywords = [
    'bachelor', 'master', 'phd', 'doctorate', 'diploma', 'associate',
    'licence', 'ingénieur', 'baccalauréat', 'diplôme',
    'engineering', 'science', 'degree', 'sciences'
  ];
  
  let i = 0;
  while (i < searchLines.length) {
    const line = searchLines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Skip if this line starts with "De YYYY à YYYY" (it's a date range, not a degree)
    if (line.match(/^De\s+\d{4}\s+à\s+\d{4}/i)) {
      i++;
      continue;
    }
    
    // Check if line contains a degree keyword
    if (degreeKeywords.some(keyword => lowerLine.includes(keyword))) {
      console.log(`🎓 Found degree line: "${line}"`);
      
      // Collect full degree name (might span multiple lines)
      let fullDegree = line;
      let j = i + 1;
      
      // Continue reading next line if current line doesn't end properly
      // Common patterns: "Transformation Digitale et" → "Intelligence Artificielle (en cours)"
      while (j < searchLines.length && j < i + 4) {
        const nextLine = searchLines[j].trim();
        
        // Stop if we hit a clear boundary (another degree, institution, year line, or description)
        if (nextLine.match(/^(Diplôme|Baccalauréat|De \d{4}|Ecole|École|Université|Omar|Ibn|^\d{4}\s|curieux|dynamique|rigoureux|d'apprendre)/i)) {
          break;
        }
        
        // Continue if line looks like degree continuation
        // Allow: Intelligence, Artificielle, Sciences, Physiques, (en cours), "et" at start
        if (nextLine.length < 70 && 
            (nextLine.match(/^(Intelligence|Artificielle|Sciences?|Physiques?|Engineering|\(.*\)|et\s)/i) ||
             nextLine === 'Intelligence Artificielle ( en cours )')) {
          fullDegree += ' ' + nextLine;
          j++;
        } else {
          break;
        }
      }
      
      // Clean up the degree name - remove duplicate phrases and extra whitespace
      fullDegree = fullDegree
        .replace(/Élève-ingénieur\s+en\s+Transformation\s+Digitale\s+et\s+/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      
      const entry = {
        degree: fullDegree,
        institution: '',
        year: ''
      };
      
      // Check for "De YYYY à YYYY" format in next 3 lines
      for (let k = i; k < Math.min(i + 5, searchLines.length); k++) {
        const rangeMatch = searchLines[k].match(/De\s+(\d{4})\s+à\s+(\d{4})/i);
        if (rangeMatch) {
          entry.year = `${rangeMatch[1]} - ${rangeMatch[2]}`;
          // Extract institution from same line after year range
          const institutionMatch = searchLines[k].match(/De\s+\d{4}\s+à\s+\d{4}\s+(.+)/i);
          if (institutionMatch) {
            entry.institution = institutionMatch[1].trim();
            console.log(`🏫 Found institution: "${entry.institution}"`);
          }
          break;
        }
      }
      
      // Look for standalone year if no range found
      if (!entry.year) {
        const yearMatch = fullDegree.match(/\b(20\d{2}|19\d{2})\b/);
        if (yearMatch) {
          entry.year = yearMatch[0];
        }
      }
      
      // Look for institution in next lines if not found yet
      if (!entry.institution) {
        for (let k = j; k < Math.min(j + 3, searchLines.length); k++) {
          const nextLine = searchLines[k].trim();
          // Skip short lines, year-only lines, and lines starting with just year
          if (nextLine.length > 10 && !nextLine.match(/^\d{4}$/) &&
              (nextLine.match(/école|ecole|ensah|ensa|université|university|institut|omar|ibn/i) ||
               nextLine.match(/^[A-ZÀ-ÿ][a-zà-ÿ]+ [A-ZÀ-ÿ]/))) {
            // Clean up institution name - remove leading year if present
            let cleanInstitution = nextLine.replace(/^\d{4}\s+/, '').trim();
            entry.institution = cleanInstitution;
            console.log(`🏫 Found institution: "${cleanInstitution}"`);
            break;
          }
        }
      }
      
      // Look for year in next lines if still not found
      if (!entry.year) {
        for (let k = i + 1; k < Math.min(i + 4, searchLines.length); k++) {
          const yearMatch2 = searchLines[k].match(/\b(20\d{2}|19\d{2})\b/);
          if (yearMatch2) {
            entry.year = yearMatch2[0];
            break;
          }
        }
      }
      
      education.push(entry);
      console.log('✅ Added education:', entry);
      i += 4; // Skip next few lines
    } else {
      i++;
    }
  }
  
  console.log(`📊 Total education entries: ${education.length}`);
  return education;
};

/**
 * Extract work experience
 */
const extractExperience = (text) => {
  console.log('💼 Extracting work experience...');
  
  const experience = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Find experience section (handle various formats including special characters)
  let experienceSectionStart = -1;
  let experienceSectionEnd = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase().replace(/[éèê]/g, 'e');
    
    // Look for experience keywords
    if (lowerLine.match(/^(experience|experiences|experien|work experience|professional experience|parcours)/i) ||
        lowerLine.includes('exp') && lowerLine.includes('rience') ||
        lines[i].match(/^EXPÉRIENCE/i)) {
      experienceSectionStart = i;
      console.log(`✅ Found experience section at line ${i}: "${lines[i]}"`);
      break;
    }
  }
  
  if (experienceSectionStart === -1) {
    console.log('❌ No experience section found');
    return experience;
  }
  
  // Find where experience section ends
  for (let i = experienceSectionStart + 1; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase();
    // Match section headers (all caps or title case)
    if (lowerLine.match(/^(formation|education|compétences|competences|skills|certifications?|langues?|languages?|passions?|hobbies|centres|diplôme)$/i) ||
        lines[i].match(/^(FORMATION|EDUCATION|SKILLS|CERTIFICATIONS?)$/i) ||
        (lines[i].length < 30 && lines[i] === lines[i].toUpperCase() && lines[i].match(/^[A-Z\s&]+$/))) {
      experienceSectionEnd = i;
      console.log(`Experience section ends at line ${i}: "${lines[i]}"`);
      break;
    }
  }
  
  if (experienceSectionEnd === -1) {
    experienceSectionEnd = lines.length;
  }
  
  // Extract experience entries
  const experienceLines = lines.slice(experienceSectionStart + 1, experienceSectionEnd);
  console.log(`📊 Parsing ${experienceLines.length} lines in experience section`);
  
  let currentJob = null;
  
  for (let i = 0; i < experienceLines.length; i++) {
    const line = experienceLines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Skip empty or very short lines
    if (line.length < 3) continue;
    
    // Skip profile/summary text
    if (lowerLine.includes('profil') || lowerLine.includes('summary') || 
        lowerLine.includes('avec') && lowerLine.includes('expérience')) continue;
    
    // Skip common soft skills that are NOT job titles
    const softSkillsToSkip = /^(leadership|time management|communication|teamwork|work in teams|problem[- ]solving|adaptability|creativity|critical thinking|organization|planning|strong communication)$/i;
    if (line.match(softSkillsToSkip)) {
      console.log(`  ⏭️  Skipping soft skill (not a job title): "${line}"`);
      continue;
    }
    
    // Pattern 1: Job titles (typical keywords) or Internship headers
    const jobKeywords = /(ingénieur|engineer|développeur|developer|administrateur|administrator|consultant|manager|analyste|analyst|devops|architecte|architect|chef|lead|senior|junior|internship|intern|stage)/i;
    
    // Skip if it's just "and leadership" or similar fragment
    if (line.match(/^(and|et)\s/i) || line.length < 8) continue;
    
    if (line.match(jobKeywords) && line.length > 8 && line.length < 120 && 
        !line.startsWith('•') && !line.startsWith('-') &&
        !lowerLine.startsWith('avec') && !lowerLine.startsWith('mise') &&
        !lowerLine.startsWith('gestion') && !lowerLine.startsWith('développement') &&
        !lowerLine.match(/^(currently|actuellement)/)) {
      
      // Save previous job
      if (currentJob && currentJob.title) {
        experience.push(currentJob);
        console.log(`✅ Added experience: ${currentJob.title} at ${currentJob.company}`);
      }
      
      currentJob = {
        title: line,
        company: '',
        duration: '',
        description: []
      };
      
      // Look for company name in next 3 lines
      for (let j = i + 1; j < Math.min(i + 4, experienceLines.length); j++) {
        const nextLine = experienceLines[j].trim();
        
        // Company names are usually short, capitalized, no bullets
        if (nextLine.length > 2 && nextLine.length < 50 &&
            !nextLine.startsWith('•') && !nextLine.startsWith('-') &&
            !nextLine.match(/^\d/) && // Not a date
            !nextLine.includes('/') && // Not a date like 05/2019
            !nextLine.toLowerCase().includes('france') && // Not just location
            !nextLine.match(/^(mise|gestion|développement|optimisation|collaboration|implémentation)/i)) {
          
          // Check if it looks like a company name (proper capitalization)
          if (nextLine.match(/^[A-ZÀ-Ÿ]/) && !currentJob.company) {
            currentJob.company = nextLine;
            console.log(`  🏢 Company: ${nextLine}`);
          }
        }
        
        // Look for duration (dates)
        if (nextLine.match(/\d{2}\/\d{4}/) || nextLine.match(/\d{4}\s*-\s*\d{4}/)) {
          currentJob.duration = nextLine;
          console.log(`  📅 Duration: ${nextLine}`);
        }
      }
    }
    
    // Collect description bullets
    else if (currentJob && (line.startsWith('•') || line.startsWith('-'))) {
      const desc = line.replace(/^[•-]\s*/, '').trim();
      if (desc.length > 10) {
        currentJob.description.push(desc);
      }
    }
  }
  
  // Add last job
  if (currentJob && currentJob.title) {
    experience.push(currentJob);
    console.log(`✅ Added final experience: ${currentJob.title} at ${currentJob.company}`);
  }
  
  console.log(`📊 Total experience entries: ${experience.length}`);
  return experience;
};

/**
 * Extract projects
 */
const extractProjects = (text) => {
  console.log('🚀 Extracting projects...');
  
  const projects = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  console.log(`🔍 Scanning entire CV for projects (multiple formats supported)...`);
  console.log(`Total lines to scan: ${lines.length}`);
  
  const searchLines = lines;
  
  // Look for project section headers (including French "Réalisations")
  let inProjectSection = false;
  let projectSectionStart = -1;
  
  for (let i = 0; i < searchLines.length; i++) {
    const line = searchLines[i].toLowerCase().replace(/[éèê]/g, 'e');
    const originalLine = searchLines[i];
    
    // Check for project keywords or achievements section
    // Also handle "P R O J E C T S" and "C O M P L E T E D   P R O J E C T S" (spaced letters)
    const lineNoSpaces = originalLine.replace(/\s+/g, '').toLowerCase();
    if (line.includes('projet') || line.includes('project') || 
        line === 'projets' || line === 'projects' ||
        lineNoSpaces === 'projects' || lineNoSpaces === 'projets' ||
        lineNoSpaces.includes('completedprojects') || lineNoSpaces.includes('completedproject') ||
        lineNoSpaces.includes('compeleted') || // Handle typo
        line.includes('realisation') || line.includes('réalisation') ||
        originalLine.match(/PRINCIPALES RÉALISATIONS/i) ||
        originalLine.match(/C\s+O\s+M\s+P.*P\s+R\s+O\s+J\s+E\s+C\s+T/i) ||
        line.includes('achievements') || line.includes('accomplishments')) {
      if (line.length < 50 || lineNoSpaces.length < 20) { // Section headers are usually short
        inProjectSection = true;
        projectSectionStart = i;
        console.log(`✅ Found project/achievements section at line ${i}: "${searchLines[i]}"`);
        break;
      }
    }
  }
  
  let currentProject = null;
  
  for (let index = 0; index < searchLines.length; index++) {
    const trimmedLine = searchLines[index].trim();
    const lowerLine = trimmedLine.toLowerCase();
    
    // Skip section headers
    if (lowerLine === 'projet' || lowerLine === 'projets' || lowerLine === 'projects' || lowerLine === 'project') {
      continue;
    }
    
    // Multiple project detection patterns:
    // Pattern 1: Lines starting with ➢ and containing – separator
    if (trimmedLine.startsWith('➢') && trimmedLine.includes('–')) {
      
      console.log(`🔎 Line ${index + 1}: Found ➢ with – : "${trimmedLine}"`);
      
      // Check if this looks like a project (not a skill or personal trait)
      // Skip if it's just a single word or very short (likely a skill/trait)
      const textAfterArrow = trimmedLine.replace(/^➢\s*/, '');
      const beforeDash = textAfterArrow.split('–')[0].trim();
      
      console.log(`   Before dash: "${beforeDash}" (length: ${beforeDash.length}, words: ${beforeDash.split(' ').length})`);
      
      // Projects typically have descriptive names or recognizable project names
      // Accept if: length > 10 OR has 2+ words OR has capital letters (like MapFit)
      const hasMultipleWords = beforeDash.split(' ').length >= 2;
      const isLongEnough = beforeDash.length > 10;
      const isCamelCase = /[a-z][A-Z]/.test(beforeDash); // Matches MapFit, CodeBase, etc.
      
      if (isLongEnough || hasMultipleWords || isCamelCase) {
        
        // Save previous project
        if (currentProject && currentProject.name) {
          projects.push(currentProject);
          console.log('✅ Added project:', currentProject.name);
        }
        
        // Extract project name (before –) and tech stack (after –)
        const parts = textAfterArrow.split('–');
        const projectName = parts[0].trim();
        const techStack = parts.length > 1 ? parts[1].trim() : '';
        
        console.log(`🔍 Found project: "${projectName}" | Tech: "${techStack}"`);
        
        currentProject = {
          name: projectName,
          description: [],
          technologies: techStack ? [techStack] : []
        };
      } else {
        console.log(`⏭️  Skipping short bullet (likely skill): "${beforeDash}"`);
      }
    } else if (trimmedLine.startsWith('➢') && !trimmedLine.includes('–')) {
      // Project name might span multiple lines - check ONLY next line for continuation
      console.log(`🔎 Line ${index + 1}: Found ➢ without – : "${trimmedLine}"`);
      
      // Only check if this could be a project (not a single word skill)
      const textAfterArrow = trimmedLine.replace(/^➢\s*/, '').trim();
      
      // Skip obvious skills (single words under 20 chars, common programming languages)
      if (textAfterArrow.length < 20 && 
          (textAfterArrow.split(' ').length === 1 || 
           textAfterArrow.match(/^(Java|JavaScript|PHP|Python|C|C\+\+|Ruby|Laravel|React|Vue|Angular|MySQL|MongoDB|Tailwind|Bootstrap)(\s*\(|$)/i))) {
        console.log(`   Skipping skill bullet: "${textAfterArrow}"`);
      } else if (index + 1 < searchLines.length) {
        // Check next 1-2 lines for continuation with dash
        let foundContinuation = false;
        
        for (let j = index + 1; j <= Math.min(index + 2, searchLines.length - 1); j++) {
          const nextLine = searchLines[j].trim();
          
          // Look for a line that contains the dash and rest of project name
          // It might be: plain text with dash, OR another ➢ bullet with dash
          if (nextLine.includes('–') || nextLine.includes('- ')) {
            console.log(`   Found continuation with dash on line ${j + 1}: "${nextLine}"`);
            
            // Extract the continuation text (remove ➢ if present)
            let continuationText = nextLine.replace(/^➢\s*/, '').trim();
            
            // If continuation starts with a framework name, extract only the project part
            // Example: "➢ MERN stack (en cours d'apprentissage) plans de voyage - Python"
            // Should extract: "plans de voyage"
            if (continuationText.match(/^(Laravel|React|Vue|Angular|MERN stack|Tailwind|Bootstrap)/i)) {
              // Remove framework name and everything before the actual project name
              let cleaned = continuationText.replace(/^(Laravel|React|Vue|Angular|MERN stack|Tailwind CSS,?\s*Bootstrap)\s*/i, '').trim();
              
              // Remove "(en cours d'apprentissage)" or similar notes
              cleaned = cleaned.replace(/\(en cours[^)]*\)\s*/gi, '').trim();
              
              if (cleaned.length > 10) {
                continuationText = cleaned;
              } else {
                continue; // Skip this line, it's just a framework
              }
            }
            
            // Clean up any "(en cours...)" notes from the continuation
            continuationText = continuationText.replace(/\(en cours[^)]*\)\s*/gi, '').trim();
            
            const fullProjectLine = textAfterArrow + ' ' + continuationText;
            
            // Split on dash to separate name and tech
            const parts = fullProjectLine.split(/[–-]/);
            const projectName = parts[0].trim();
            const techStack = parts.length > 1 ? parts[parts.length - 1].trim() : ''; // Take last part after dash
            
            if (projectName.length > 15 && !projectName.match(/^(Laravel|MERN|React|Vue|Angular|Tailwind|Bootstrap)/i)) {
              // Save previous project
              if (currentProject && currentProject.name) {
                projects.push(currentProject);
                console.log('✅ Added project:', currentProject.name);
              }
              
              console.log(`🔍 Found multi-line project: "${projectName}" | Tech: "${techStack}"`);
              
              currentProject = {
                name: projectName,
                description: [],
                technologies: techStack ? [techStack] : []
              };
              
              foundContinuation = true;
              break;
            }
          }
        }
        
        if (!foundContinuation) {
          console.log(`   No dash found in next lines, likely a skill bullet`);
        }
      } else {
        console.log(`   No dash found in next lines, likely a skill bullet`);
      }
    } else if (currentProject && trimmedLine.length > 15 && 
               !trimmedLine.startsWith('➢') &&
               !trimmedLine.match(/^(langues|arabe|français|anglais|langages|frameworks|bases de données|compétences|diplômes|atouts|centres|activités|football|natation|voyage|coding|membre)\s*:?/i) && // Skip section headers and activities
               !trimmedLine.match(/^\d{4}/) && // Skip years
               !trimmedLine.match(/^[A-Z][a-z]+\s*:/) && // Skip "Word: description" patterns
               !trimmedLine.match(/célibataire|nationale|\d+ ans|meknès|édition \d{4}/i) && // Skip personal info and editions
               !trimmedLine.match(/^\w+\s+\.\.\.\s+\w+$/i)) { // Skip "Football ... Coding" patterns
      
      // Add description lines
      currentProject.description.push(trimmedLine);
      console.log(`  📝 Added description line: "${trimmedLine.substring(0, 50)}..."`);
      
      // Stop collecting description if we hit a clear section boundary
      if (index + 1 < searchLines.length) {
        const nextLine = searchLines[index + 1].trim();
        if (nextLine.match(/^(compétences|langages|frameworks|bases de données|atouts|activités|centres)/i)) {
          console.log(`  🛑 Stopping description collection at section: "${nextLine}"`);
          projects.push(currentProject);
          console.log('✅ Added project:', currentProject.name);
          currentProject = null;
        }
      }
    } else if (currentProject && trimmedLine.match(/^(activités|centres|atouts)/i)) {
      // Hit a new section, save current project
      console.log(`  🛑 Hit new section: "${trimmedLine}"`);
      projects.push(currentProject);
      console.log('✅ Added project:', currentProject.name);
      currentProject = null;
    }
  }
  
  // Don't forget the last project!
  if (currentProject && currentProject.name) {
    projects.push(currentProject);
    console.log('✅ Added final project:', currentProject.name);
  }
  
  // If no projects found with ➢ format, try alternative formats
  if (projects.length === 0 && inProjectSection && projectSectionStart >= 0) {
    console.log('🔄 No projects found with ➢ format. Trying alternative formats...');
    
    // Look for projects in the section after "Projects" header
    let currentProj = null;
    let projectCategoryHeader = null; // For "C PROGRAMMING PROJECT", "LINUX NETWORKING PROJECT", etc.
    
    for (let i = projectSectionStart + 1; i < searchLines.length; i++) {
      const line = searchLines[i].trim();
      const lowerLine = line.toLowerCase();
      
      // Stop at next major section (including "EXPERIENCES & INTERNSHIPS" and "COMP")
      if ((lowerLine.match(/^(expérience|experience|éducation|education|compétences|comp|skills|langues|languages|certifications?|formation)/i) &&
          line.length < 40) ||
          line.match(/^(EXPERIENCES|EXPÉRIENCES|EDUCATION|SKILLS|FORMATION|COMP)/i) ||
          lowerLine.includes('experiences') && lowerLine.includes('internship')) {
        console.log(`🛑 Reached next section: ${line}`);
        // Save current project before breaking
        if (currentProj && currentProj.name) {
          projects.push(currentProj);
          console.log(`✅ Added project before section end: "${currentProj.name}"`);
        }
        break;
      }
      
      // PATTERN: Project category headers (e.g., "C PROGRAMMING PROJECT", "LINUX NETWORKING PROJECT")
      // These are usually followed by the actual project name on the next line
      if (line.match(/^[A-Z\s]+(PROGRAMMING|NETWORKING|WEB|MOBILE|DATA|DATABASE)\s+PROJECT$/i) ||
          line.match(/^[A-Z\s]+PROJECT$/i)) {
        console.log(`🏷️  Found project category header: "${line}"`);
        projectCategoryHeader = line;
        continue;
      }
      
      // If we just saw a category header, the next non-empty line is likely the project name
      // BUT skip addresses, contact info, and URLs
      if (projectCategoryHeader && line.length > 5 && line.length < 80) {
        // Skip addresses (contain "rue", "street", "avenue", postal codes, etc.)
        if (line.match(/\b(rue|street|avenue|road|blvd|boulevard|ave|st\.|drive|lane)\b/i) ||
            line.match(/\d{4,5}/) || // Postal codes
            line.match(/^\d+\s*,/) || // Starts with number and comma
            line.match(/,\s*\w+\s+\d{4,5}$/)) { // Ends with ", City 50000"
          console.log(`  ⏭️  Skipping address line: "${line}"`);
          continue;
        }
        
        // Skip contact info (phone, email, URLs)
        if (line.match(/^\d{10}/) || // Phone number
            line.match(/@/) || // Email
            line.match(/^(www\.|http|linkedin|github)/i)) { // URLs
          console.log(`  ⏭️  Skipping contact info: "${line}"`);
          continue;
        }
        
        console.log(`📝 Project name after category header: "${line}"`);
        
        // Save previous project if exists
        if (currentProj && currentProj.name) {
          projects.push(currentProj);
          console.log(`✅ Added previous project: "${currentProj.name}"`);
        }
        
        currentProj = {
          name: line,
          description: [],
          technologies: []
        };
        projectCategoryHeader = null; // Reset
        continue;
      }
      
      // NEW PATTERN: Bullet points with project title and technologies on SAME line
      // Format: "Project Title   Tech1, Tech2, Tech3"
      // Examples from Oussama's CV:
      //   "Plateforme microservices de gestion et réservation de billets avec CI/CD   Spring Boot, Docker, Kubernetes,"
      //   "Assistant d'apprentissage IA Cloud-Native (basé sur RAG)   Spring Boot, React.js, ChromaDB, Docker, Azure"
      if (line.match(/^[A-ZÀ-Ÿ].{20,150}\s{2,}.+,\s*.+/)) {
        console.log(`🎯 Found bullet project (title + tech on same line): "${line.substring(0, 80)}..."`);
        
        // Split by multiple spaces (usually 2-4 spaces separate title from tech)
        const parts = line.split(/\s{2,}/);
        if (parts.length >= 2) {
          const projectTitle = parts[0].trim();
          const techStack = parts.slice(1).join(' ').trim();
          
          console.log(`   📝 Title: "${projectTitle}"`);
          console.log(`   🔧 Technologies: "${techStack}"`);
          
          // Save previous project if exists
          if (currentProj && currentProj.name) {
            projects.push(currentProj);
            console.log(`✅ Added previous project: "${currentProj.name}"`);
          }
          
          // Create new project
          currentProj = {
            name: projectTitle,
            description: [],
            technologies: techStack ? techStack.split(',').map(t => t.trim()).filter(t => t.length > 0) : []
          };
          continue;
        }
      }
      
      // If we have a current project and this is a bullet description line
      if (currentProj && line.startsWith('•') && line.length > 15) {
        const descText = line.replace(/^•\s*/, '').trim();
        currentProj.description.push(descText);
        console.log(`   📄 Added description: "${descText.substring(0, 60)}..."`);
        continue;
      }
      
      // Pattern: Bullet points (-, •, *) - but only if they look like project descriptions
      // Skip this pattern for now as it captures too many description lines
      // We'll rely on project title lines instead
      
      // Pattern: Numbered projects (1., 2., etc.)
      else if (line.match(/^\d+[\.)]\s+/)) {
        const projectName = line.replace(/^\d+[\.)]\s+/, '').trim();
        
        if (projectName.length > 10) {
          projects.push({
            name: projectName,
            description: [],
            technologies: []
          });
          console.log(`✅ Found project (numbered format): "${projectName}"`);
        }
      }
      
      // Pattern: Projects with em dash (—) separator: "Project Name — Year/Tech"
      // ONLY if we're in the projects section AND it looks like a real project
      else if (inProjectSection && line.includes('—') && !line.startsWith('➢')) {
        console.log(`🔎 Checking em dash line: "${line}"`);
        
        const parts = line.split('—');
        let projectName = parts[0].trim();
        let metadata = parts[1]?.trim() || '';
        
        console.log(`   Project name: "${projectName}" (length: ${projectName.length})`);
        console.log(`   Metadata: "${metadata}"`);
        
        // IMPORTANT: Sometimes soft skills and project names are on the same line!
        // Example: "Critical Thinking  Application de Gestion — 2024"
        // We need to extract ONLY the project part (after the soft skill)
        // Do this BEFORE checking skipPatterns!
        const softSkillPrefix = /^(Effective Communication|Critical Thinking|Problem-solving|Teamwork|Leadership|Time Management)\s{2,}/i;
        if (softSkillPrefix.test(projectName)) {
          // Remove the soft skill prefix (usually followed by 2+ spaces)
          const originalName = projectName;
          projectName = projectName.replace(softSkillPrefix, '').trim();
          console.log(`🔧 Removed soft skill prefix: "${originalName}" → "${projectName}"`);
        }
        
        // Skip if it's clearly not a project (skills, soft skills, certifications, etc.)
        // Check AFTER soft skill removal
        const skipPatterns = /^(effective|critical|problem|teamwork|leadership|time management|communication|programming|web development|databases|version control|operating systems|technologies|languages|javascript|python|java|php|html|css|mysql|git|linux|windows|other competencies|structures|oriented|certifications|certification|certified|certificate|oracle|aws|azure|google cloud|activité|secrétaire|cloud|infrastructure|foundations|associate)/i;
        
        if (skipPatterns.test(projectName)) {
          console.log(`⏭️  Skipping non-project with em dash: "${projectName}"`);
          continue;
        }
        
        // IMPORTANT: Sometimes the year is on the next line (PDF parsing issue)
        // Example: "Application de Gestion des Affectations —" then "2025" on next line
        let hasYear = metadata.match(/\d{4}/);
        if (!hasYear && i + 1 < searchLines.length) {
          const nextLine = searchLines[i + 1].trim();
          console.log(`   Checking next line for year: "${nextLine}"`);
          if (nextLine.match(/^\d{4}$/)) {
            // Next line is just a year
            metadata = nextLine;
            hasYear = metadata.match(/\d{4}/);
            console.log(`   ✅ Found year on next line: ${hasYear[0]}`);
          }
        }
        
        // Valid project if: 
        // 1. Name length 15-80 characters
        // 2. Contains project-like keywords OR has "application", "système", "game", "gestion"
        // 3. Metadata looks like year (4 digits) not just text
        const projectKeywords = /(application|système|system|game|jeu|gestion|management|platform|plateforme|assistant|tool|outil)/i;
        
        console.log(`   Has project keywords: ${projectKeywords.test(projectName)}`);
        console.log(`   Has year: ${hasYear ? hasYear[0] : 'NO'}`);
        
        if (projectName.length >= 15 && projectName.length < 80 &&
            projectKeywords.test(projectName) && hasYear) {
          
          // Collect description from next lines
          let desc = [];
          let techs = [metadata]; // Start with year/metadata
          
          for (let j = i + 1; j < Math.min(i + 10, searchLines.length); j++) {
            const descLine = searchLines[j].trim();
            if (descLine.length === 0) break;
            
            // Stop if hit another project title (has — with year)
            if (descLine.includes('—') && descLine.match(/\d{4}/)) {
              break;
            }
            
            // Stop if hit a section header (spaced or normal)
            const descNoSpaces = descLine.replace(/\s+/g, '').toUpperCase();
            if (descNoSpaces.match(/^(TECHSKILLS|TECH|SKILLS|COMPETENCES|CERTIFICATIONS|LANGUAGES|LANGUES|ACTIVITE)/)) {
              break;
            }
            
            // Extract technologies from "Technologies Used:" lines (handle various spacing and prefixes)
            // Match "Technologies Used:", "Technologies:", "Tech Stack:", or even "word Technologies Used:"
            const techLineMatch = descLine.match(/(Technologies?\s*(?:Used)?\s*|Tech\s+Stack\s*):/i);
            if (techLineMatch) {
              console.log(`🔍 Found tech line: "${descLine}"`);
              // Get everything after the colon
              const colonIndex = descLine.indexOf(':');
              const techPart = descLine.substring(colonIndex + 1).trim();
              if (techPart) {
                // Split by comma and clean up
                const extractedTechs = techPart.split(',').map(t => t.trim()).filter(t => t.length > 0 && !t.match(/^\d{4}$/));
                techs.push(...extractedTechs);
                console.log(`🔧 Extracted technologies: ${extractedTechs.join(', ')}`);
              }
              // Skip adding this line to description
              continue;
            }
            
            // Skip soft skills that appear between projects
            const softSkills = /^(Effective Communication|Critical Thinking|Problem-solving|Teamwork|Leadership|Time Management|Creativity|Adaptability)$/i;
            if (softSkills.test(descLine)) {
              console.log(`⏭️  Skipping soft skill in description: "${descLine}"`);
              continue;
            }
            
            // Skip standalone programming language names (they're skills, not description)
            const standaloneSkills = /^(Python|JavaScript|Java|C\+\+|C#|PHP|Ruby|Go|Rust|Swift|Kotlin)$/i;
            if (standaloneSkills.test(descLine)) {
              console.log(`⏭️  Skipping standalone skill in description: "${descLine}"`);
              continue;
            }
            
            // Skip skill category headers that end with colon (e.g., "Web Development: HTML, CSS,")
            if (descLine.includes(':') && descLine.match(/(Programming|Web Development|Databases|Version Control|Operating Systems|Technologies|Languages)/i)) {
              console.log(`⏭️  Skipping skill category in description: "${descLine}"`);
              continue;
            }
            
            desc.push(descLine);
          }
          
          projects.push({
            name: projectName,
            description: desc,
            technologies: techs.filter(t => t), // Remove empty strings
            year: metadata.match(/\d{4}/) ? metadata.match(/\d{4}/)[0] : hasYear[0]
          });
          console.log(`✅ Found project (em dash format): "${projectName}" | Year: "${hasYear[0]}" | Tech: ${techs.join(', ')}`);
        }
      }
      
      // Pattern: Bold/emphasized lines (usually project titles)  
      // DISABLED for CVs with mixed content - too many false positives
      // Only use this pattern if we're clearly in a project section and line has strong project indicators
      else if (inProjectSection && line.length > 15 && line.length < 100 && 
               !line.startsWith('-') && 
               !line.startsWith('•') &&
               !line.startsWith('*') &&
               !line.includes(':') && // Skip "Programming Languages:", "Databases:", etc.
               !line.includes('—') && // Already handled above
               !line.match(/^[A-Z\s]+$/) && // Skip all-caps section headers
               !line.toLowerCase().match(/^(effective|critical|problem|teamwork|leadership|time|communication|programming|web development|database|version control|operating|technolog|javascript|python|java|php|html|css|mysql|git|linux|windows|competenc|structure|algorithm|oriented|certification|certifications|certified|certificate|oracle|aws|azure|google|cloud|microsoft|cisco|comptia|foundations|associate|professional|activité|langue|english|french|arabic|secrétaire)/i) &&
               !line.toLowerCase().includes('certified') && // Extra check for certifications
               !line.toLowerCase().includes('certificate') &&
               !line.toLowerCase().includes('certification')) {
        
        // VERY strict: Must have strong project keywords (NOT just "infrastructure")
        const strongProjectKeywords = /(optimisation|automatisation|amélioration|développement|mise en place|pipeline|système de gestion|plateforme|assistant|application de)/i;
        
        const hasStrongKeywords = line.match(strongProjectKeywords);
        
        if (hasStrongKeywords) {
          const nextLine = i + 1 < searchLines.length ? searchLines[i + 1] : '';
          
          // Must have description on next line
          const hasDescription = nextLine.length > 20;
          
          if (hasDescription) {
            // Collect description (usually 1-3 lines after title)
            let desc = [];
            
            for (let j = i + 1; j < Math.min(i + 4, searchLines.length); j++) {
              const descLine = searchLines[j].trim();
              if (descLine.length === 0) break;
              
              // Stop if we hit a section header
              const descNoSpaces = descLine.replace(/\s+/g, '').toUpperCase();
              if (descNoSpaces.match(/^(TECHSKILLS|CERTIFICATIONS|LANGUAGES|ACTIVITE)/)) {
                break;
              }
              
              desc.push(descLine);
            }
            
            projects.push({
              name: line,
              description: desc,
              technologies: []
            });
            console.log(`✅ Found project (title format): "${line}"`);
          }
        }
      }
    }
  }
  
  // Filter out non-project entries (activities, memberships, description fragments, etc.)
  const realProjects = projects.filter(project => {
    const name = project.name.toLowerCase();
    
    // Skip if it's a description fragment (starts with "tools and", "within", etc.)
    if (name.match(/^(tools and|within|and\s|et\s|avec\s|pour\s|dans\s|using|the\s|le\s|la\s|les\s)/i)) {
      console.log(`🗑️  Filtering out description fragment: "${project.name}"`);
      return false;
    }
    
    // Skip if it's clearly not a project title
    if (name.includes('agile development') || name.includes('experiences & internships') || 
        name.includes('internship at') || name.includes('awaiting') ||
        name.includes('mobile-first components') || name.includes('bootstrap\'s mobile')) {
      console.log(`🗑️  Filtering out non-project text: "${project.name}"`);
      return false;
    }
    
    // Skip if it's an activity/membership rather than a technical project
    if (name.includes('membre') || name.includes('member') || 
        name.includes('hult prize') || name.includes('édition')) {
      console.log(`🗑️  Filtering out activity (not a project): "${project.name}"`);
      return false;
    }
    
    // Skip if name contains skill bullets (➢)
    if (project.name.includes('➢')) {
      console.log(`�️  Filtering out malformed entry: "${project.name}"`);
      return false;
    }
    
    return true;
  });
  
  console.log(`�📊 Total projects found: ${realProjects.length}`);
  return realProjects;
};

/**
 * Extract languages
 */
const extractLanguages = (text) => {
  console.log('🌍 Extracting languages...');
  
  const languages = [];
  const languageSection = findSection(text, ['languages', 'language skills', 'langues']);
  
  console.log('Languages section found:', languageSection ? 'Yes' : 'No');
  
  if (languageSection) {
    console.log('Language section content:', languageSection);
  }
  
  const searchText = languageSection || text;
  
  // Support both English and French language names
  const languageMap = {
    'English': ['English', 'Anglais'],
    'Spanish': ['Spanish', 'Espagnol'],
    'French': ['French', 'Français'],
    'German': ['German', 'Allemand'],
    'Italian': ['Italian', 'Italien'],
    'Portuguese': ['Portuguese', 'Portugais'],
    'Chinese': ['Chinese', 'Chinois'],
    'Japanese': ['Japanese', 'Japonais'],
    'Korean': ['Korean', 'Coréen'],
    'Arabic': ['Arabic', 'Arabe'],
    'Russian': ['Russian', 'Russe'],
    'Hindi': ['Hindi', 'Hindi']
  };

  Object.entries(languageMap).forEach(([englishName, variants]) => {
    variants.forEach(variant => {
      const regex = new RegExp(`\\b${variant}\\b`, 'gi');
      if (regex.test(searchText)) {
        if (!languages.includes(englishName)) {
          languages.push(englishName);
          console.log(`✅ Found language: ${englishName} (variant: ${variant})`);
        }
      }
    });
  });

  return languages;
};

/**
 * Extract certifications
 */
const extractCertifications = (text) => {
  const certifications = [];
  const certSection = findSection(text, ['certifications', 'certificates', 'licenses']);

  if (certSection) {
    const lines = certSection.split('\n').filter(line => line.trim());
    certifications.push(...lines);
  }

  return certifications;
};

/**
 * Helper: Find a section in the CV text
 */
const findSection = (text, keywords) => {
  const lines = text.split('\n');
  let startIndex = -1;
  let endIndex = lines.length;

  // Find section start
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    const lineNoSpaces = line.replace(/\s+/g, ''); // Handle "T E C H S K I L L S"
    
    // Check if line matches any keyword and is likely a header (short line or spaced letters)
    if (keywords.some(keyword => {
      const lineClean = line.replace(/[:\s]/g, '');
      const keywordClean = keyword.replace(/[:\s]/g, '');
      return (lineClean.includes(keywordClean) || lineNoSpaces.includes(keywordClean)) && 
             (line.length < 60 || lineNoSpaces.length < 20);
    })) {
      startIndex = i + 1;
      break;
    }
  }

  if (startIndex === -1) return null;

  // Find section end (next section header or end of document)
  const sectionHeaders = [
    'education', 'experience', 'skills', 'techskills', 'softskills', 'projects', 'certifications', 
    'languages', 'references', 'awards', 'publications', 'interests',
    'diplômes', 'formations', 'expérience', 'compétences', 'compétencestechniques', 'projets',
    'langues', 'centres', 'activités', 'atouts', 'activiteparascolaire'
  ];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    const lineClean = line.replace(/[:\s]/g, '');
    const lineNoSpaces = line.replace(/\s+/g, ''); // Also check spaced headers
    
    // Check if this line is a new section header
    if (sectionHeaders.some(header => {
      const headerClean = header.replace(/[:\s]/g, '');
      return lineClean === headerClean || lineClean === headerClean + 's' || 
             lineNoSpaces.toLowerCase() === headerClean ||
             (line.length < 50 && lineClean.includes(headerClean));
    })) {
      endIndex = i;
      break;
    }
  }

  return lines.slice(startIndex, endIndex).join('\n');
};

/**
 * Helper: Extract year from text
 */
const extractYear = (text) => {
  const yearRegex = /\b(19|20)\d{2}\b/;
  const match = text.match(yearRegex);
  return match ? match[0] : null;
};

/**
 * Helper: Extract duration from text
 */
const extractDuration = (text) => {
  const durationRegex = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})\s*[-–]\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|Present|Current)/i;
  const match = text.match(durationRegex);
  return match ? match[0] : null;
};

/**
 * Helper: Check if line is a job title
 */
const isJobTitle = (line) => {
  const jobTitleKeywords = [
    'engineer', 'developer', 'manager', 'analyst', 'designer', 'consultant',
    'director', 'lead', 'senior', 'junior', 'intern', 'specialist', 'architect',
    'scientist', 'researcher', 'coordinator', 'administrator', 'assistant'
  ];
  
  const lowerLine = line.toLowerCase();
  return jobTitleKeywords.some(keyword => lowerLine.includes(keyword)) && line.length < 100;
};

export default parseCVFile;
