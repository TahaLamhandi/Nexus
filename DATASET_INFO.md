# 📊 Job Dataset Information

## Current Dataset: 50,000 Diverse Jobs

### 📈 Distribution by Domain

- **IT & Software**: 40% (20,000 jobs)
  - Software Engineer, Full Stack Developer, Frontend/Backend Developer
  - DevOps Engineer, Data Engineer, Data Scientist
  - Mobile Developer, Cloud Architect, ML Engineer
  - QA Engineer, Security Engineer, UI/UX Designer
  - Product Manager, Database Administrator

- **Engineering**: 15% (7,500 jobs)
  - Mechanical, Electrical, Civil, Industrial, Chemical Engineers

- **Healthcare**: 10% (5,000 jobs)
  - Registered Nurse, Medical Doctor, Pharmacist
  - Physical Therapist, Medical Laboratory Technician

- **Finance**: 10% (5,000 jobs)
  - Financial Analyst, Accountant, Investment Banker
  - Risk Analyst, Credit Analyst

- **Marketing & Sales**: 10% (5,000 jobs)
  - Digital Marketing Specialist, Sales Manager
  - Content Writer, Brand Manager, Social Media Manager

- **Education**: 5% (2,500 jobs)
  - Teacher, University Professor, Training Specialist
  - Education Coordinator

- **Other Sectors**: 10% (5,000 jobs)
  - HR Manager, Project Manager, Business Analyst
  - Operations Manager, Supply Chain Analyst
  - Legal Advisor, Graphic Designer, Customer Success Manager

### 🌍 Countries Covered

- **Morocco** (Casablanca, Rabat, Marrakech, Tangier, Fes, Agadir, Meknes)
- **United States** (New York, San Francisco, Seattle, Austin, Boston, Los Angeles, Chicago)
- **France** (Paris, Lyon, Marseille, Toulouse, Nice, Nantes, Strasbourg)
- **United Kingdom** (London, Manchester, Birmingham, Edinburgh, Glasgow, Bristol)
- **Germany** (Berlin, Munich, Frankfurt, Hamburg, Cologne, Stuttgart)
- **Canada** (Toronto, Vancouver, Montreal, Ottawa, Calgary, Edmonton)

### 🏢 Companies

**85 unique companies** including:
- Tech giants: Google, Meta, Amazon, Microsoft, Apple, Netflix, Tesla
- Consulting: Capgemini, Accenture, CGI, SQLI, Atos, Altran
- Finance: Goldman Sachs, JPMorgan, BMCE Bank, Attijariwafa Bank
- Telecom: Maroc Telecom, Orange, Vodafone
- And many more across all sectors

### 💾 Technical Details

- **File Size**: ~10 MB (compressed in Git)
- **Memory Usage**: ~40 MB when loaded
- **Performance**: Works perfectly on Koyeb free tier (512 MB RAM)
- **Format**: CSV with 10 columns
- **Encoding**: UTF-8

### 📋 Dataset Structure

```csv
Job Title,Company,Company Logo,Location,Work Type,Experience Level,LinkedIn URL,Job Description,Country,Salary Range
```

### 🔧 How to Regenerate

If you need to regenerate the dataset with different parameters:

```bash
cd backend
python generate_jobs.py
```

Edit `generate_jobs.py` to:
- Change total number of jobs
- Adjust domain distribution percentages
- Add/remove job titles or skills
- Modify salary ranges
- Add more countries or companies

### 📊 Memory Efficiency

This dataset is optimized for deployment on free-tier hosting:
- **50,000 jobs** use only ~40 MB RAM
- Previous 1.6M jobs dataset required 5-8 GB RAM (caused OOM crashes)
- **Result**: 10x more efficient, no memory issues!

### ✅ Benefits

1. **No External Dependencies**: Dataset is included in the repository
2. **Fast Loading**: Loads in < 1 second
3. **Memory Efficient**: Works on free hosting tiers
4. **Diverse**: Covers multiple domains and countries
5. **IT-Focused**: 40% of jobs are in tech sector (ideal for tech CVs)
6. **Realistic**: Proper salary ranges by country and experience level

