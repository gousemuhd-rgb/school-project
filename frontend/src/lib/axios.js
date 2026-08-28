/**
 * axios.js — Pre-configured Axios instance.
 * Automatically attaches Authorization header from Zustand auth store.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor: attach JWT if present
api.interceptors.request.use(
  (config) => {
    // Read token from localStorage (Zustand persists it there)
    try {
      const raw = localStorage.getItem('auth-storage');
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (_) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: surface error messages consistently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.errors?.[0]?.msg ||
      error?.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
