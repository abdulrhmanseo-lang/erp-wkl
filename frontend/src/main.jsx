import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = "1234567890-mockclientid.apps.googleusercontent.com"; // Replace with your real Client ID

// global fetch interceptor for auth
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const url = typeof resource === 'string' ? resource : resource.url;

  if (url && url.includes('/api/v1/')) {
    config = config || {};
    const headers = new Headers(config.headers || {});
    try {
      const raw = localStorage.getItem('smartops_user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.token && !headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${u.token}`);
        }
      }
    } catch (e) { }
    config.headers = headers;
  }

  const response = await originalFetch(resource, config);
  if (response.status === 401 && url && url.includes('/api/v1/')) {
    // Handle unauthorized globally
    localStorage.removeItem('smartops_user');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
