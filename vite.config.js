import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['caltos-icon.svg', 'caltos_icon_cropped.png'],
      manifest: {
        name: 'Caltos Calorie Tracker',
        short_name: 'Caltos',
        description: 'Ultra-fast, premium calorie tracking companion with personalized insights.',
        theme_color: '#00e676',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'caltos_icon_cropped.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'caltos_icon_cropped.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'caltos_icon_cropped.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
