import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
    
ReactDOM.createRoot(document.getElementById('root')).render(
  
  <GoogleOAuthProvider clientId="869066910090-ksp9ti1j32etaffvfcvhqte0d0qrqmaq.apps.googleusercontent.com">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>,
    document.getElementById('root')

    )
