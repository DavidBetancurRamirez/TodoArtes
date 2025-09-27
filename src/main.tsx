import './styles/index.css';

import React from 'react';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import AnalyticsProvider from './components/AnalyticsProvider.tsx';
import Auth from './components/Auth.tsx';

import App from './App.tsx';

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  client_secret: import.meta.env.VITE_COGNITO_CLIENT_SECRET,
  post_logout_redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: import.meta.env.VITE_COGNITO_RESPONSE_TYPE,
  scope: import.meta.env.VITE_COGNITO_SCOPE,
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <AnalyticsProvider />

        <Auth>
          <App />
        </Auth>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
