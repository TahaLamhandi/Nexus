// API Configuration for Development and Production
// Production: Uses VITE_API_URL from environment variables
// Development: Falls back to Koyeb deployed backend
const API_URL = import.meta.env.VITE_API_URL || 'https://hissing-pierette-1tahaaaaa1-fff858c6.koyeb.app';

console.log('🔗 API URL:', API_URL); // Debug log

export default API_URL;
