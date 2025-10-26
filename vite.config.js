import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '::',
    port: 3000,
  },
  preview: {
    host: '::',
    port: 3000,
  },
  optimizeDeps: {
    include: ['react-redux', '@reduxjs/toolkit']
  },
  build: {
    commonjsOptions: {
      include: [/react-redux/, /@reduxjs\/toolkit/, /node_modules/]
    }
  }
})
