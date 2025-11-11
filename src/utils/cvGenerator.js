import { jsPDF } from 'jspdf';

/**
 * Generate a clean, professional CV PDF (Black & White Design)
 * @param {Object} cvData - All CV data (personal, education, experience, projects, skills)
 * @param {string} profileImage - Base64 encoded profile image
 */
export const generateCV = async (cvData, profileImage) => {
  const doc = new jsPDF();
  
  // Clean black and white color palette
  const black = [0, 0, 0];
  const darkGray = [60, 60, 60];
  const mediumGray = [100, 100, 100];
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;
  
  // ===== HEADER - CLEAN BLACK & WHITE =====
  // Name - Large, centered, bold
  doc.setTextColor(black[0], black[1], black[2]);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  const fullName = cvData.personal.fullName.toUpperCase();
  const nameWidth = doc.getTextWidth(fullName);
  doc.text(fullName, (pageWidth - nameWidth) / 2, yPos);
  yPos += 8;
  
  // Title/Position - centered below name
  if (cvData.personal.title) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const titleWidth = doc.getTextWidth(cvData.personal.title.toUpperCase());
    doc.text(cvData.personal.title.toUpperCase(), (pageWidth - titleWidth) / 2, yPos);
    yPos += 8;
  }
  
  // Contact info - centered, single line with separator
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(black[0], black[1], black[2]);
  const contactInfo = [];
  if (cvData.personal.phone) contactInfo.push(cvData.personal.phone);
  if (cvData.personal.email) contactInfo.push(cvData.personal.email);
  if (cvData.personal.location) contactInfo.push(cvData.personal.location);
  const contactText = contactInfo.join(' | ');
  const contactWidth = doc.getTextWidth(contactText);
  doc.text(contactText, (pageWidth - contactWidth) / 2, yPos);
  yPos += 10;
  
  // Horizontal line separator
  doc.setDrawColor(black[0], black[1], black[2]);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 10;
  
  // ===== SUMMARY SECTION (if provided) =====
  if (cvData.personal.summary) {
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY', 15, yPos);
    yPos += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const summaryLines = doc.splitTextToSize(cvData.personal.summary, pageWidth - 30);
    doc.text(summaryLines, 15, yPos);
    yPos += summaryLines.length * 4.5 + 8;
  }
  
  // ===== EDUCATION SECTION =====
  if (cvData.education && cvData.education.length > 0) {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }
    
    // Section header - clean black
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', 15, yPos);
    yPos += 7;
    
    // Education entries
    cvData.education.forEach((edu, index) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }
      
      // Date range (left aligned)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(black[0], black[1], black[2]);
      const startYear = edu.startDate ? new Date(edu.startDate).getFullYear() : '';
      const endYear = edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present';
      doc.text(`${startYear} - ${endYear}`, 15, yPos);
      
      // Degree (uppercase, bold)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(edu.degree.toUpperCase(), 45, yPos);
      yPos += 5;
      
      // Institution and location
      if (edu.institution) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const instText = edu.location ? `${edu.institution} - ${edu.location}` : edu.institution;
        doc.text(instText, 45, yPos);
        yPos += 5;
      }
      
      // Description
      if (edu.description) {
        doc.setFontSize(8);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const descLines = doc.splitTextToSize(edu.description, pageWidth - 50);
        doc.text(descLines, 45, yPos);
        yPos += descLines.length * 4 + 3;
      }
      
      yPos += 3;
    });
    yPos += 5;
  }
  
  // ===== EXPERIENCE SECTION =====
  if (cvData.experience && cvData.experience.length > 0) {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }
    
    // Section header
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EXPERIENCES & INTERNSHIPS', 15, yPos);
    yPos += 7;
    
    // Experience entries
    cvData.experience.forEach((exp, index) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }
      
      // Position (bold)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(exp.position, 15, yPos);
      
      // Date range (right side)
      const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : '';
      const endDate = exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : '';
      const dateText = `(${startDate} - ${endDate})`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.text(dateText, pageWidth - 15 - dateWidth, yPos);
      yPos += 5;
      
      // Company and location
      if (exp.company) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const companyText = exp.location ? `${exp.company}, ${exp.location}` : exp.company;
        doc.text(companyText, 15, yPos);
        yPos += 5;
      }
      
      // Description with bullet points
      if (exp.description) {
        doc.setFontSize(8);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const descLines = exp.description.split('\n').filter(line => line.trim());
        descLines.forEach(line => {
          const bulletLines = doc.splitTextToSize(`- ${line}`, pageWidth - 40);
          doc.text(bulletLines, 20, yPos);
          yPos += bulletLines.length * 4;
        });
        yPos += 3;
      }
      
      yPos += 3;
    });
    yPos += 5;
  }
  
  // ===== PROJECTS SECTION =====
  if (cvData.projects && cvData.projects.length > 0) {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }
    
    // Section header
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECTS', 15, yPos);
    yPos += 7;
    
    // Project entries
    cvData.projects.forEach((proj, index) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }
      
      // Project name (bold)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(proj.name, 15, yPos);
      yPos += 5;
      
      // Description with bullet points
      if (proj.description) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const descLines = proj.description.split('\n').filter(line => line.trim());
        descLines.forEach(line => {
          const bulletLines = doc.splitTextToSize(`- ${line}`, pageWidth - 40);
          doc.text(bulletLines, 20, yPos);
          yPos += bulletLines.length * 4;
        });
        yPos += 2;
      }
      
      // Technologies (if provided)
      if (proj.technologies) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
        const techLines = doc.splitTextToSize(`Technologies: ${proj.technologies}`, pageWidth - 40);
        doc.text(techLines, 20, yPos);
        yPos += techLines.length * 4 + 3;
      }
      
      yPos += 3;
    });
    yPos += 5;
  }
  
  // ===== SKILLS SECTION =====
  if ((cvData.skills.technical && cvData.skills.technical.length > 0) || 
      (cvData.skills.languages && cvData.skills.languages.length > 0)) {
    
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }
    
    // Section header
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLS', 15, yPos);
    yPos += 7;
    
    // Technical Skills - categorized format
    if (cvData.skills.technical.length > 0) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      
      // Group skills by category (simple comma-separated list)
      const skillsText = cvData.skills.technical.join(', ');
      const skillsLines = doc.splitTextToSize(skillsText, pageWidth - 30);
      doc.text(skillsLines, 15, yPos);
      yPos += skillsLines.length * 4.5 + 5;
    }
    
    // Languages
    if (cvData.skills.languages.length > 0) {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text('Languages:', 15, yPos);
      yPos += 5;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      const languagesText = cvData.skills.languages.join(', ');
      const languagesLines = doc.splitTextToSize(languagesText, pageWidth - 30);
      doc.text(languagesLines, 15, yPos);
      yPos += languagesLines.length * 4.5;
    }
    
    // Certifications section (if added later)
    if (cvData.certifications && cvData.certifications.length > 0) {
      yPos += 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text('Certifications:', 15, yPos);
      yPos += 5;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      const certsText = cvData.certifications.join(', ');
      const certsLines = doc.splitTextToSize(certsText, pageWidth - 30);
      doc.text(certsLines, 15, yPos);
      yPos += certsLines.length * 4.5;
    }
  }
  
  // Save the PDF
  const fileName = `${cvData.personal.fullName.replace(/\s+/g, '_')}_CV.pdf`;
  doc.save(fileName);
};
