import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crossDeviceApiPlugin } from './src/server/crossDeviceApiPlugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crossDeviceApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all',
    open: false
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
})

