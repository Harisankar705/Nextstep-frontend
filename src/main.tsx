import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { SocketProvider } from './SocketContext.tsx'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const clientId = import.meta.env.VITE_AUTH_GOOGLE_ID 
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SocketProvider>
          <Elements stripe={stripePromise}>
          <App />
        </Elements>
          </SocketProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
)
