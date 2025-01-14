import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { SocketProvider } from './SocketContext.tsx'
const clientId = import.meta.env.VITE_AUTH_GOOGLE_ID

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SocketProvider>
          <App />
          </SocketProvider>
        </PersistGate>

      </Provider>
    </GoogleOAuthProvider>



  </StrictMode>,
)
