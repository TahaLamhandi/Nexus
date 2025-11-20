// API Configuration for Development and Production
// Production: Uses VITE_API_URL from environment variables
// Development: Falls back to Render deployed backend
const API_URL = import.meta.env.VITE_API_URL || 'https://nexus-backend-s3ij.onrender.com';

console.log('🔗 API URL:', API_URL); // Debug log

export default API_URL;
