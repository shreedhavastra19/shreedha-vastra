// ================================================================
// Shreedha Vastra — Axios API Instance
// ================================================================
// Central HTTP client. `withCredentials: true` is essential — it
// lets the browser send/receive the httpOnly JWT cookie set by
// the backend on login. Without it, auth would silently fail.
// ================================================================
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Global response error handling — surfaces backend error messages
// as toasts, and redirects to login on session expiry.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    const isSilent = error.config?.silent;
    // Don't toast validation errors here — forms handle those inline
    if (!isSilent && (eorror.response?.status !==400 || !error.response?.data?.errors)){
      toast.error(message);
    }

    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Session expired or not logged in — let calling code decide navigation;
      // we just surface the error rather than force-redirecting here to avoid
      // interrupting public-page browsing.
    }

    return Promise.reject(error);
  }
);

export default api;
