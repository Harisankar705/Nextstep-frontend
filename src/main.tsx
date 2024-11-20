import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
const clientId = import.meta.env.VITE_AUTH_GOOGLE_ID
if(!clientId)
{
  console.error('google auth missing')
}
console.log("CLIEND",clientId)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>

  </StrictMode>,
)
