import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const serverPort = Number(env.VITE_PORT) || 3000
  const rawHost = env.VITE_HOST?.trim()
  const serverHost =
    rawHost?.toLowerCase() === 'true'
      ? true
      : rawHost?.toLowerCase() === 'false'
        ? false
        : rawHost || 'localhost'

  const gatewayUrl = env.VITE_GATEWAY_URL?.trim()
  const apiBaseUrl = env.VITE_API_BASE_URL?.trim()

  let proxyTarget = 'http://localhost:4000'
  if (gatewayUrl) {
    proxyTarget = gatewayUrl.replace(/\/+$/, '')
  } else if (apiBaseUrl) {
    try {
      const apiUrl = new URL(apiBaseUrl)
      proxyTarget = `${apiUrl.protocol}//${apiUrl.host}`
    } catch {
      proxyTarget = apiBaseUrl.replace(/\/+$/, '')
    }
  }

  return {
    plugins: [react()],
    server: {
      port: serverPort,
      host: serverHost,
      strictPort: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      },
      hmr: {
        host: typeof serverHost === 'string' ? serverHost : 'localhost'
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            animations: ['framer-motion'],
            routing: ['react-router-dom'],
            forms: ['react-hook-form'],
            api: ['axios'],
            icons: ['lucide-react']
          }
        }
      },
      target: 'es2015',
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'react-router-dom',
        'react-hook-form',
        'axios',
        'lucide-react'
      ]
    },
    define: {
      __PWA_VERSION__: JSON.stringify(
        process.env.npm_package_version || env.VITE_APP_VERSION || '1.0.0'
      )
    }
  }
})
