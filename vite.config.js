import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('Vite config loaded');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

})
