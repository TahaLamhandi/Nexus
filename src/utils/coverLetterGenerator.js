import { jsPDF } from 'jspdf';

/**
 * Fetch company logo using Google Favicon API
 * @param {string} companyName - Name of the company
 * @returns {string} - Logo URL
 */
const fetchCompanyLogo = (companyName) => {
  // Use Google's favicon service which is very reliable
  const domain = companyName.toLowerCase().replace(/\s+/g, '') + '.com';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

/**
 * Generate a professional cover letter PDF
 * @param {Object} params - Cover letter parameters
 * @param {string} params.applicantName - Name of the applicant
 * @param {string} params.email - Applicant's email
 * @param {string} params.phone - Applicant's phone
 * @param {string} params.companyName - Target company name
 * @param {string} params.letterType - 'internship' or 'job'
 * @param {Array} params.skills - Array of skills
 * @param {string} params.biography - Brief biography
 * @param {Array} params.projects - Array of projects
 */
export const generateCoverLetter = async ({
  applicantName,
  email,
  phone,
  companyName,
  letterType,
  skills,
  biography,
  projects
}) => {
  const doc = new jsPDF();
  
  // Beautiful Nexus color palette
  const primaryColor = [99, 102, 241]; // #6366F1 (Indigo)
  const secondaryColor = [139, 92, 246]; // #8B5CF6 (Purple)
  const accentColor = [236, 72, 153]; // #EC4899 (Pink)
  const textColor = [31, 41, 55]; // #1F2937 (Gray-800)
  const lightGray = [107, 114, 128]; // #6B7280 (Gray-500)
  const veryLightGray = [243, 244, 246]; // #F3F4F6 (Gray-100)
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;
  
  // Get company logo URL (Google Favicon API - always available)
  const logoUrl = fetchCompanyLogo(companyName);
  
  // ===== COMPANY LOGO =====
  if (logoUrl) {
    try {
      // Create image element and load logo
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // Use async/await to ensure logo loads before continuing
      await new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Add logo at top right corner
            doc.addImage(img, 'PNG', pageWidth - 45, yPos - 5, 35, 35);
            resolve();
          } catch (err) {
            console.log('Error adding logo to PDF:', err);
            resolve(); // Continue even if logo fails
          }
        };
        img.onerror = () => {
          console.log('Logo failed to load, continuing without it');
          resolve(); // Continue without logo
        };
        img.src = logoUrl;
      });
    } catch (error) {
      console.log('Could not load company logo:', error);
    }
  }
  
  // ===== DATE =====
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(today, 20, yPos);
  
  yPos += 15;
  
  // ===== APPLICANT INFO =====
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(applicantName, 20, yPos);
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  if (email) {
    doc.text(email, 20, yPos);
    yPos += 5;
  }
  if (phone) {
    doc.text(phone, 20, yPos);
    yPos += 5;
  }
  
  yPos += 12;
  
  // ===== COMPANY INFO =====
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(companyName, 20, yPos);
  yPos += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text('Human Resources Department', 20, yPos);
  
  yPos += 15;
  
  // ===== SUBJECT =====
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  const subject = letterType === 'internship' 
    ? `Subject: Application for Internship Position` 
    : `Subject: Application for Employment Position`;
  doc.text(subject, 20, yPos);
  
  yPos += 12;
  
  // ===== LETTER CONTENT (TEXT-BASED, NO SECTIONS) =====
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  // Opening
  doc.text('Dear Hiring Manager,', 20, yPos);
  yPos += 10;
  
  // Build the letter as continuous text
  let letterContent = '';
  
  // Introduction paragraph
  if (letterType === 'internship') {
    letterContent = `I am writing to express my strong interest in securing an internship position at ${companyName}. `;
    letterContent += biography ? `${biography} ` : 'As a motivated and dedicated student, I am eager to apply my technical skills and knowledge in a professional environment. ';
  } else {
    letterContent = `I am writing to express my strong interest in joining ${companyName} as a member of your team. `;
    letterContent += biography ? `${biography} ` : 'As a skilled professional with a strong technical background, I am confident in my ability to contribute to your organization\'s success. ';
  }
  
  // Skills paragraph
  if (skills && skills.length > 0) {
    const skillsList = skills.slice(0, 12).join(', ');
    letterContent += `I possess strong proficiency in ${skillsList}, which aligns perfectly with the requirements of your organization. `;
  }
  
  // Projects paragraph
  if (projects && projects.length > 0) {
    const projectNames = projects.slice(0, 2).map(p => p.name).join(' and ');
    letterContent += `I have successfully completed several projects including ${projectNames}, which demonstrate my practical experience and problem-solving abilities. `;
  }
  
  // Motivation paragraph
  if (letterType === 'internship') {
    letterContent += `I am particularly excited about the opportunity to learn from your experienced team and contribute to innovative projects at ${companyName}. I am confident that this internship will provide valuable hands-on experience and allow me to grow professionally while adding value to your organization.`;
  } else {
    letterContent += `I am particularly excited about the opportunity to bring my expertise to ${companyName} and contribute to your team's success. I am confident that my technical skills, combined with my passion for innovation, make me a strong candidate for this position.`;
  }
  
  // Split and render the continuous text
  const contentLines = doc.splitTextToSize(letterContent, pageWidth - 40);
  doc.text(contentLines, 20, yPos);
  yPos += contentLines.length * 6 + 10;
  
  // Closing paragraph
  const closingText = 'Thank you for considering my application. I look forward to the opportunity to discuss how my skills and enthusiasm can contribute to your team.';
  const closingLines = doc.splitTextToSize(closingText, pageWidth - 40);
  doc.text(closingLines, 20, yPos);
  yPos += closingLines.length * 6 + 12;
  
  // ===== SIGNATURE =====
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('Sincerely,', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(applicantName, 20, yPos);
  
  // ===== SIMPLE FOOTER WITH BOLD HORIZONTAL LINE =====
  const footerY = pageHeight - 20;
  
  // Bold horizontal line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(2);
  doc.line(20, footerY, pageWidth - 20, footerY);
  
  // Save the PDF
  const fileName = `${companyName.replace(/\s+/g, '_')}_${letterType}_letter.pdf`;
  doc.save(fileName);
};
