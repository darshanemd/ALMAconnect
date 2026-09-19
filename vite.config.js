import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to redirect Recharts' CommonJS es-toolkit/compat subpath imports to native ESM
function esToolkitCompatPlugin() {
  return {
    name: 'es-toolkit-compat-esm',
    enforce: 'pre',
    resolveId(source) {
      if (source.startsWith('es-toolkit/compat/')) {
        return `\0virtual:${source}`;
      }
    },
    load(id) {
      if (id.startsWith('\0virtual:es-toolkit/compat/')) {
        const fnName = id.replace('\0virtual:es-toolkit/compat/', '');
        return `export { ${fnName} as default } from 'es-toolkit/compat';`;
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [esToolkitCompatPlugin(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        ws: true,
        secure: false
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
