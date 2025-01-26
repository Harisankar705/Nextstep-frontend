import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [react()],
  define:{
    'import.meta.API_BASE_URL':JSON.stringify(process.env.API_BASE_URL)
  }
})
