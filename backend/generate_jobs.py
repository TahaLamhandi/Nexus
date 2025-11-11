"""
Generate 50,000 job listings with diverse domains (40% IT, 60% other sectors)
"""
import pandas as pd
import random

# Job templates by domain
JOB_TEMPLATES = {
    # IT & Software (40% - 20,000 jobs)
    "IT": [
        {"title": "Software Engineer", "skills": ["Python", "Java", "JavaScript", "Git", "Docker", "AWS"]},
        {"title": "Full Stack Developer", "skills": ["React", "Node.js", "MongoDB", "Express", "JavaScript", "HTML", "CSS"]},
        {"title": "Frontend Developer", "skills": ["React", "Vue.js", "Angular", "JavaScript", "HTML", "CSS", "Tailwind"]},
        {"title": "Backend Developer", "skills": ["Python", "Django", "Flask", "FastAPI", "PostgreSQL", "MongoDB"]},
        {"title": "DevOps Engineer", "skills": ["Docker", "Kubernetes", "Jenkins", "AWS", "Azure", "CI/CD", "Terraform"]},
        {"title": "Data Engineer", "skills": ["Python", "Spark", "Airflow", "SQL", "Kafka", "AWS", "ETL"]},
        {"title": "Data Scientist", "skills": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "Statistics"]},
        {"title": "Mobile Developer", "skills": ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "iOS", "Android"]},
        {"title": "Cloud Architect", "skills": ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "Microservices"]},
        {"title": "ML Engineer", "skills": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Docker", "MLOps"]},
        {"title": "QA Engineer", "skills": ["Selenium", "Cypress", "Jest", "Python", "Java", "Testing", "Automation"]},
        {"title": "Security Engineer", "skills": ["Security", "Penetration Testing", "Firewall", "Python", "Networking"]},
        {"title": "UI/UX Designer", "skills": ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"]},
        {"title": "Product Manager", "skills": ["Agile", "Scrum", "Jira", "Product Strategy", "Roadmap"]},
        {"title": "Database Administrator", "skills": ["MySQL", "PostgreSQL", "MongoDB", "Oracle", "SQL", "Backup"]},
    ],
    
    # Engineering (15% - 7,500 jobs)
    "Engineering": [
        {"title": "Mechanical Engineer", "skills": ["CAD", "SolidWorks", "AutoCAD", "Manufacturing", "Design"]},
        {"title": "Electrical Engineer", "skills": ["Circuit Design", "Electronics", "MATLAB", "PLC", "Automation"]},
        {"title": "Civil Engineer", "skills": ["AutoCAD", "Civil 3D", "Structural Analysis", "Construction", "Project Management"]},
        {"title": "Industrial Engineer", "skills": ["Lean Manufacturing", "Six Sigma", "Process Optimization", "Quality Control"]},
        {"title": "Chemical Engineer", "skills": ["Process Design", "ChemCAD", "Safety", "Quality Assurance"]},
    ],
    
    # Healthcare (10% - 5,000 jobs)
    "Healthcare": [
        {"title": "Registered Nurse", "skills": ["Patient Care", "Medical Records", "CPR", "Healthcare", "Communication"]},
        {"title": "Medical Doctor", "skills": ["Diagnosis", "Treatment", "Patient Care", "Medical Knowledge"]},
        {"title": "Pharmacist", "skills": ["Medication", "Healthcare", "Patient Counseling", "Pharmacy Management"]},
        {"title": "Physical Therapist", "skills": ["Rehabilitation", "Exercise Therapy", "Patient Care", "Assessment"]},
        {"title": "Medical Laboratory Technician", "skills": ["Lab Testing", "Medical Equipment", "Quality Control"]},
    ],
    
    # Finance (10% - 5,000 jobs)
    "Finance": [
        {"title": "Financial Analyst", "skills": ["Excel", "Financial Modeling", "Analysis", "Reporting", "SQL"]},
        {"title": "Accountant", "skills": ["Accounting", "Excel", "QuickBooks", "Tax", "Auditing"]},
        {"title": "Investment Banker", "skills": ["Financial Analysis", "M&A", "Excel", "PowerPoint", "Valuation"]},
        {"title": "Risk Analyst", "skills": ["Risk Management", "Analysis", "Excel", "Statistics", "Compliance"]},
        {"title": "Credit Analyst", "skills": ["Credit Analysis", "Financial Modeling", "Risk Assessment", "Excel"]},
    ],
    
    # Marketing & Sales (10% - 5,000 jobs)
    "Marketing": [
        {"title": "Digital Marketing Specialist", "skills": ["SEO", "Google Analytics", "Social Media", "Content Marketing"]},
        {"title": "Sales Manager", "skills": ["Sales", "CRM", "Negotiation", "Team Management", "Strategy"]},
        {"title": "Content Writer", "skills": ["Writing", "SEO", "Content Strategy", "WordPress", "Communication"]},
        {"title": "Brand Manager", "skills": ["Branding", "Marketing Strategy", "Market Research", "Communication"]},
        {"title": "Social Media Manager", "skills": ["Social Media", "Content Creation", "Analytics", "Community Management"]},
    ],
    
    # Education (5% - 2,500 jobs)
    "Education": [
        {"title": "Teacher", "skills": ["Teaching", "Curriculum Development", "Classroom Management", "Communication"]},
        {"title": "University Professor", "skills": ["Research", "Teaching", "Academic Writing", "Subject Expertise"]},
        {"title": "Training Specialist", "skills": ["Training", "Presentation", "Communication", "Instructional Design"]},
        {"title": "Education Coordinator", "skills": ["Program Management", "Communication", "Organization", "Education"]},
    ],
    
    # Other Sectors (10% - 5,000 jobs)
    "Other": [
        {"title": "Human Resources Manager", "skills": ["HR", "Recruitment", "Employee Relations", "Communication"]},
        {"title": "Project Manager", "skills": ["Project Management", "Agile", "Leadership", "Communication", "Planning"]},
        {"title": "Business Analyst", "skills": ["Analysis", "Requirements Gathering", "SQL", "Excel", "Communication"]},
        {"title": "Operations Manager", "skills": ["Operations", "Process Improvement", "Team Management", "Strategy"]},
        {"title": "Supply Chain Analyst", "skills": ["Supply Chain", "Logistics", "Excel", "Analysis", "SAP"]},
        {"title": "Legal Advisor", "skills": ["Legal Research", "Contract Law", "Communication", "Analysis"]},
        {"title": "Graphic Designer", "skills": ["Adobe Photoshop", "Illustrator", "InDesign", "Creativity", "Design"]},
        {"title": "Customer Success Manager", "skills": ["Customer Service", "CRM", "Communication", "Problem Solving"]},
    ],
}

# Companies by country
COMPANIES = {
    "Morocco": [
        "Capgemini Morocco", "Accenture Morocco", "SQLI", "CGI Morocco", "Umanis",
        "Altran", "Aubay", "Outsourcia", "Involys", "HPS",
        "BMCE Bank", "Attijariwafa Bank", "Maroc Telecom", "ONCF", "OCP Group",
        "Managem", "Majorel", "Webhelp", "Teleperformance", "Intelcia"
    ],
    "United States": [
        "Google", "Meta", "Amazon", "Microsoft", "Apple",
        "Netflix", "Tesla", "IBM", "Oracle", "Salesforce",
        "Adobe", "Intel", "Cisco", "PayPal", "Uber",
        "Goldman Sachs", "JPMorgan", "Johnson & Johnson", "Pfizer", "Boeing"
    ],
    "France": [
        "Airbus", "Total", "Orange", "Renault", "L'Oréal",
        "Société Générale", "BNP Paribas", "Carrefour", "Danone", "Thales",
        "Atos", "Dassault", "Michelin", "Schneider Electric", "Sanofi"
    ],
    "United Kingdom": [
        "HSBC", "BP", "Shell", "Unilever", "GlaxoSmithKline",
        "Barclays", "Vodafone", "British Airways", "Rolls-Royce", "Tesco"
    ],
    "Germany": [
        "SAP", "Siemens", "BMW", "Mercedes-Benz", "Volkswagen",
        "Deutsche Bank", "Allianz", "Bayer", "Bosch", "Adidas"
    ],
    "Canada": [
        "Shopify", "RBC", "TD Bank", "Rogers", "Bell Canada",
        "Bombardier", "Air Canada", "Magna", "Scotiabank", "Telus"
    ],
}

CITIES = {
    "Morocco": ["Casablanca", "Rabat", "Marrakech", "Tangier", "Fes", "Agadir", "Meknes"],
    "United States": ["New York", "San Francisco", "Seattle", "Austin", "Boston", "Los Angeles", "Chicago"],
    "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Bristol"],
    "Germany": ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary", "Edmonton"],
}

WORK_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"]
EXPERIENCE_LEVELS = ["Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Principal"]

SALARY_RANGES = {
    "Morocco": {
        "Entry Level": "150000-220000 MAD",
        "Junior": "180000-260000 MAD",
        "Mid-Level": "220000-320000 MAD",
        "Senior": "280000-450000 MAD",
        "Lead": "350000-550000 MAD",
        "Principal": "450000-700000 MAD",
    },
    "United States": {
        "Entry Level": "$60000-$85000",
        "Junior": "$75000-$110000",
        "Mid-Level": "$95000-$150000",
        "Senior": "$130000-$200000",
        "Lead": "$170000-$280000",
        "Principal": "$220000-$350000",
    },
    "France": {
        "Entry Level": "€30000-€42000",
        "Junior": "€38000-€55000",
        "Mid-Level": "€48000-€75000",
        "Senior": "€65000-€100000",
        "Lead": "€85000-€140000",
        "Principal": "€110000-€175000",
    },
    "United Kingdom": {
        "Entry Level": "£28000-£40000",
        "Junior": "£35000-£52000",
        "Mid-Level": "£45000-£72000",
        "Senior": "£62000-£95000",
        "Lead": "£80000-£135000",
        "Principal": "£105000-£170000",
    },
    "Germany": {
        "Entry Level": "€32000-€45000",
        "Junior": "€40000-€58000",
        "Mid-Level": "€52000-€80000",
        "Senior": "€68000-€105000",
        "Lead": "€90000-€145000",
        "Principal": "€115000-€180000",
    },
    "Canada": {
        "Entry Level": "C$50000-C$72000",
        "Junior": "C$62000-C$92000",
        "Mid-Level": "C$78000-C$125000",
        "Senior": "C$105000-C$165000",
        "Lead": "C$140000-C$230000",
        "Principal": "C$180000-C$290000",
    },
}

def generate_jobs(total_jobs=50000):
    """Generate diverse job listings"""
    jobs = []
    
    # Calculate jobs per domain based on percentages
    domain_distribution = {
        "IT": int(total_jobs * 0.40),  # 40%
        "Engineering": int(total_jobs * 0.15),  # 15%
        "Healthcare": int(total_jobs * 0.10),  # 10%
        "Finance": int(total_jobs * 0.10),  # 10%
        "Marketing": int(total_jobs * 0.10),  # 10%
        "Education": int(total_jobs * 0.05),  # 5%
        "Other": int(total_jobs * 0.10),  # 10%
    }
    
    job_id = 1
    
    for domain, count in domain_distribution.items():
        templates = JOB_TEMPLATES[domain]
        
        for i in range(count):
            # Random selections
            country = random.choice(list(COMPANIES.keys()))
            company = random.choice(COMPANIES[country])
            city = random.choice(CITIES[country])
            template = random.choice(templates)
            work_type = random.choice(WORK_TYPES)
            experience = random.choice(EXPERIENCE_LEVELS)
            
            # Generate job description
            skills_text = ", ".join(template["skills"][:random.randint(3, 6)])
            job_desc = f"We are looking for a talented {template['title']} with expertise in {skills_text}. "
            
            if domain == "IT":
                job_desc += "Join our innovative team and work on cutting-edge technology solutions."
            elif domain == "Engineering":
                job_desc += "Contribute to exciting engineering projects and drive innovation."
            elif domain == "Healthcare":
                job_desc += "Make a difference in patient care and healthcare excellence."
            elif domain == "Finance":
                job_desc += "Drive financial excellence and strategic decision-making."
            elif domain == "Marketing":
                job_desc += "Create compelling campaigns and drive brand growth."
            elif domain == "Education":
                job_desc += "Shape the future through quality education and mentorship."
            else:
                job_desc += "Be part of a dynamic team driving organizational success."
            
            # Create job entry
            job = {
                "Job Title": template["title"],
                "Company": company,
                "Company Logo": f"https://logo.clearbit.com/{company.lower().replace(' ', '')}.com",
                "Location": city,
                "Work Type": work_type,
                "Experience Level": experience,
                "LinkedIn URL": f"https://linkedin.com/jobs/{job_id}",
                "Job Description": job_desc,
                "Country": country,
                "Salary Range": SALARY_RANGES[country][experience],
            }
            
            jobs.append(job)
            job_id += 1
            
            # Progress indicator
            if job_id % 5000 == 0:
                print(f"Generated {job_id} jobs...")
    
    return jobs

if __name__ == "__main__":
    print("🚀 Generating 50,000 job listings...")
    print("📊 Distribution: 40% IT, 15% Engineering, 10% Healthcare, 10% Finance, 10% Marketing, 5% Education, 10% Other")
    
    jobs_data = generate_jobs(50000)
    
    # Create DataFrame
    df = pd.DataFrame(jobs_data)
    
    # Save to CSV
    output_file = "jobs_dataset_50k.csv"
    df.to_csv(output_file, index=False, encoding='utf-8')
    
    print(f"\n✅ Successfully generated {len(df)} jobs!")
    print(f"📁 Saved to: {output_file}")
    print(f"📊 File size: {df.memory_usage(deep=True).sum() / (1024*1024):.2f} MB in memory")
    print(f"\n📋 Distribution by domain:")
    print(f"   - IT & Software: {len([j for j in jobs_data if any(keyword in j['Job Title'].lower() for keyword in ['software', 'developer', 'devops', 'data', 'cloud', 'mobile', 'qa', 'security', 'designer', 'product', 'database'])])} jobs")
    print(f"   - Countries covered: {len(COMPANIES)} countries")
    print(f"   - Companies: {sum(len(companies) for companies in COMPANIES.values())} unique companies")
