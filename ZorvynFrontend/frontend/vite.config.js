import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // loads .env, .env.development, etc.
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/user': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        }
      }
    }
  }
})