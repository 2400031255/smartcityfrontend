import axios from 'axios';

// Uses Railway Spring Boot backend (production)
// Change to http://localhost:8080/api when running Spring Boot locally
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://smartcity-2-production.up.railway.app/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
