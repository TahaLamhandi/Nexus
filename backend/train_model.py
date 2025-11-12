"""
Advanced ML Model Training for Job Matching
Trains multiple models and selects the best one
Uses TF-IDF, Word2Vec, and advanced feature engineering
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os
from datetime import datetime
import re

class JobMatchingMLTrainer:
    """
    Advanced ML trainer for job matching system
    """
    
    def __init__(self, dataset_path='jobs_dataset_50k.csv'):
        self.dataset_path = dataset_path
        self.df = None
        self.models = {}
        self.vectorizers = {}
        self.encoders = {}
        self.scaler = None
        self.best_model = None
        self.best_model_name = None
        self.best_score = 0
        
        # Skills taxonomy (expanded)
        self.all_skills = [
            # Programming Languages
            'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'C', 'PHP',
            'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'R', 'MATLAB', 'Scala',
            
            # Web Technologies
            'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
            'FastAPI', 'Laravel', 'Spring', 'ASP.NET', 'Next.js', 'Svelte',
            
            # Databases
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle',
            'SQL Server', 'Cassandra', 'DynamoDB', 'Firebase',
            
            # Cloud & DevOps
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
            'Terraform', 'Ansible', 'Chef', 'Puppet', 'CI/CD',
            
            # Data Science & ML
            'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras',
            'Scikit-learn', 'Pandas', 'NumPy', 'Data Analysis', 'Statistics',
            
            # Engineering
            'CAD', 'SolidWorks', 'AutoCAD', 'ANSYS', 'MATLAB', 'Simulink',
            'PLC', 'SCADA', 'Lean Manufacturing', 'Six Sigma', 'Quality Control',
            
            # Other
            'Git', 'Linux', 'Agile', 'Scrum', 'Project Management', 'Communication',
            'Leadership', 'Problem Solving', 'Team Work', 'REST API', 'GraphQL'
        ]
    
    def load_data(self):
        """Load and prepare dataset"""
        print("="*70)
        print("📂 LOADING DATASET")
        print("="*70)
        
        self.df = pd.read_csv(self.dataset_path, encoding='utf-8')
        print(f"✅ Loaded {len(self.df)} jobs")
        print(f"📊 Columns: {list(self.df.columns)}")
        print(f"\n📈 Dataset Info:")
        print(f"  - Companies: {self.df['Company'].nunique()}")
        print(f"  - Countries: {self.df['Country'].nunique()}")
        print(f"  - Domains: {self.df['Domain'].nunique() if 'Domain' in self.df.columns else 'N/A'}")
        
        return self.df
    
    def extract_skills_from_text(self, text):
        """Extract skills from job description or CV"""
        if pd.isna(text):
            return []
        
        text_lower = str(text).lower()
        found_skills = []
        
        for skill in self.all_skills:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return found_skills
    
    def create_skill_features(self, text):
        """Create binary skill features"""
        skills = self.extract_skills_from_text(text)
        features = {}
        
        for skill in self.all_skills:
            features[f'has_{skill.lower().replace(" ", "_")}'] = 1 if skill in skills else 0
        
        return features
    
    def feature_engineering(self):
        """Advanced feature engineering"""
        print("\n" + "="*70)
        print("🔧 FEATURE ENGINEERING")
        print("="*70)
        
        # 1. Text features from job descriptions
        print("\n1️⃣ Creating TF-IDF features from job descriptions...")
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=500,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=2
        )
        
        job_descriptions = self.df['Job Description'].fillna('')
        tfidf_features = self.tfidf_vectorizer.fit_transform(job_descriptions)
        print(f"   ✅ Created {tfidf_features.shape[1]} TF-IDF features")
        
        # 2. Skill-based features
        print("\n2️⃣ Extracting skill-based features...")
        skill_features_list = []
        for desc in job_descriptions:
            features = self.create_skill_features(desc)
            skill_features_list.append(features)
        
        skill_df = pd.DataFrame(skill_features_list)
        print(f"   ✅ Created {len(skill_df.columns)} skill features")
        
        # 3. Categorical encoding
        print("\n3️⃣ Encoding categorical features...")
        
        # Experience Level
        if 'Experience Level' in self.df.columns:
            self.exp_encoder = LabelEncoder()
            self.df['exp_level_encoded'] = self.exp_encoder.fit_transform(
                self.df['Experience Level'].fillna('Mid-Level')
            )
        
        # Work Type
        if 'Work Type' in self.df.columns:
            self.work_encoder = LabelEncoder()
            self.df['work_type_encoded'] = self.work_encoder.fit_transform(
                self.df['Work Type'].fillna('Full-time')
            )
        
        # Domain (target for classification)
        if 'Domain' in self.df.columns:
            self.domain_encoder = LabelEncoder()
            self.df['domain_encoded'] = self.domain_encoder.fit_transform(
                self.df['Domain'].fillna('Not specified')
            )
            print(f"   ✅ Encoded domains: {list(self.domain_encoder.classes_)}")
        
        # 4. Combine all features
        print("\n4️⃣ Combining all features...")
        
        # Convert TF-IDF to DataFrame
        tfidf_df = pd.DataFrame(
            tfidf_features.toarray(),
            columns=[f'tfidf_{i}' for i in range(tfidf_features.shape[1])]
        )
        
        # Combine features
        categorical_features = []
        if 'exp_level_encoded' in self.df.columns:
            categorical_features.append('exp_level_encoded')
        if 'work_type_encoded' in self.df.columns:
            categorical_features.append('work_type_encoded')
        
        # Create final feature matrix
        X = pd.concat([
            tfidf_df,
            skill_df,
            self.df[categorical_features] if categorical_features else pd.DataFrame()
        ], axis=1)
        
        # Target variable (domain classification)
        y = self.df['domain_encoded'] if 'domain_encoded' in self.df.columns else None
        
        print(f"\n✅ Final feature matrix: {X.shape}")
        print(f"   - TF-IDF features: {tfidf_features.shape[1]}")
        print(f"   - Skill features: {len(skill_df.columns)}")
        print(f"   - Categorical features: {len(categorical_features)}")
        print(f"   - Total features: {X.shape[1]}")
        
        return X, y
    
    def train_models(self, X, y):
        """Train multiple ML models"""
        print("\n" + "="*70)
        print("🤖 TRAINING ML MODELS")
        print("="*70)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"\n📊 Data split:")
        print(f"   - Training: {len(X_train)} samples")
        print(f"   - Testing: {len(X_test)} samples")
        
        # Define models to train
        models_to_train = {
            'Random Forest': RandomForestClassifier(
                n_estimators=100,
                max_depth=20,
                min_samples_split=5,
                random_state=42,
                n_jobs=-1
            ),
            'Gradient Boosting': GradientBoostingClassifier(
                n_estimators=100,
                max_depth=10,
                learning_rate=0.1,
                random_state=42
            ),
            'K-Nearest Neighbors': KNeighborsClassifier(
                n_neighbors=15,
                weights='distance',
                n_jobs=-1
            ),
            'Naive Bayes': MultinomialNB(alpha=0.1)
        }
        
        results = {}
        
        # Train and evaluate each model
        for name, model in models_to_train.items():
            print(f"\n🔧 Training {name}...")
            
            try:
                # Train
                model.fit(X_train, y_train)
                
                # Predict
                y_pred = model.predict(X_test)
                
                # Evaluate
                accuracy = accuracy_score(y_test, y_pred)
                
                # Cross-validation
                cv_scores = cross_val_score(model, X_train, y_train, cv=5, n_jobs=-1)
                cv_mean = cv_scores.mean()
                cv_std = cv_scores.std()
                
                results[name] = {
                    'model': model,
                    'accuracy': accuracy,
                    'cv_mean': cv_mean,
                    'cv_std': cv_std
                }
                
                print(f"   ✅ {name}")
                print(f"      Test Accuracy: {accuracy:.4f}")
                print(f"      CV Score: {cv_mean:.4f} (+/- {cv_std:.4f})")
                
                # Save model
                self.models[name] = model
                
                # Track best model
                if cv_mean > self.best_score:
                    self.best_score = cv_mean
                    self.best_model = model
                    self.best_model_name = name
            
            except Exception as e:
                print(f"   ❌ Error training {name}: {e}")
        
        # Print comparison
        print("\n" + "="*70)
        print("📊 MODEL COMPARISON")
        print("="*70)
        
        results_df = pd.DataFrame({
            'Model': list(results.keys()),
            'Test Accuracy': [r['accuracy'] for r in results.values()],
            'CV Mean': [r['cv_mean'] for r in results.values()],
            'CV Std': [r['cv_std'] for r in results.values()]
        })
        
        results_df = results_df.sort_values('CV Mean', ascending=False)
        print(results_df.to_string(index=False))
        
        print(f"\n🏆 Best Model: {self.best_model_name}")
        print(f"   Score: {self.best_score:.4f}")
        
        return X_test, y_test, results
    
    def save_models(self):
        """Save trained models and artifacts"""
        print("\n" + "="*70)
        print("💾 SAVING MODELS")
        print("="*70)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        models_dir = 'ml_models'
        os.makedirs(models_dir, exist_ok=True)
        
        # Save best model
        best_model_path = os.path.join(models_dir, f'best_model_{timestamp}.pkl')
        joblib.dump(self.best_model, best_model_path)
        print(f"✅ Saved best model: {best_model_path}")
        
        # Save all models
        for name, model in self.models.items():
            model_path = os.path.join(models_dir, f'{name.replace(" ", "_").lower()}_{timestamp}.pkl')
            joblib.dump(model, model_path)
            print(f"✅ Saved {name}: {model_path}")
        
        # Save vectorizers and encoders
        artifacts = {
            'tfidf_vectorizer': self.tfidf_vectorizer,
            'domain_encoder': self.domain_encoder if hasattr(self, 'domain_encoder') else None,
            'exp_encoder': self.exp_encoder if hasattr(self, 'exp_encoder') else None,
            'work_encoder': self.work_encoder if hasattr(self, 'work_encoder') else None,
            'all_skills': self.all_skills
        }
        
        artifacts_path = os.path.join(models_dir, f'artifacts_{timestamp}.pkl')
        joblib.dump(artifacts, artifacts_path)
        print(f"✅ Saved artifacts: {artifacts_path}")
        
        # Save metadata
        metadata = {
            'timestamp': timestamp,
            'best_model': self.best_model_name,
            'best_score': self.best_score,
            'dataset_path': self.dataset_path,
            'total_jobs': len(self.df),
            'num_features': len(self.all_skills) + 500,  # TF-IDF + skills
            'models_trained': list(self.models.keys())
        }
        
        metadata_path = os.path.join(models_dir, f'metadata_{timestamp}.txt')
        with open(metadata_path, 'w') as f:
            for key, value in metadata.items():
                f.write(f"{key}: {value}\n")
        print(f"✅ Saved metadata: {metadata_path}")
        
        print(f"\n📦 All models saved in: {models_dir}/")
        
        return models_dir


def main():
    """Main training pipeline"""
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║         ML Model Training - Job Matching System 🤖          ║
    ║             Advanced Feature Engineering & Training          ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    
    # Initialize trainer
    trainer = JobMatchingMLTrainer('jobs_dataset_50k.csv')
    
    # Load data
    df = trainer.load_data()
    
    # Feature engineering
    X, y = trainer.feature_engineering()
    
    if y is None:
        print("\n❌ No domain labels found in dataset!")
        print("   Make sure your dataset has a 'Domain' column")
        return
    
    # Train models
    X_test, y_test, results = trainer.train_models(X, y)
    
    # Save models
    models_dir = trainer.save_models()
    
    # Final summary
    print("\n" + "="*70)
    print("🎉 TRAINING COMPLETE!")
    print("="*70)
    print(f"✅ Trained {len(trainer.models)} models")
    print(f"🏆 Best model: {trainer.best_model_name}")
    print(f"📊 Best CV score: {trainer.best_score:.4f}")
    print(f"💾 Models saved in: {models_dir}/")
    
    print("\n✨ Next steps:")
    print("  1. Review model performance above")
    print("  2. Test predictions with your CV")
    print("  3. Integrate best model into app.py")
    print("  4. Deploy and test!")
    
    print("\n🚀 Your ML model is ready for production!")


if __name__ == "__main__":
    main()
