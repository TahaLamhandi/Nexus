// API Configuration for Development and Production
// Production: Uses VITE_API_URL from environment variables
// Development: Falls back to localhost:8000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('🔗 API URL:', API_URL); // Debug log

export default API_URL;
