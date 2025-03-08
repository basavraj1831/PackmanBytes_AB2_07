import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "blood.comm",
          short_name: "blood.comm",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#317EFB",
          description: "blood community",
          icons: [
            {
              src: "/logo.png",
              type: "image/png",
              sizes: "192x192",
            },
            {
              src: "/logo.png",
              type: "image/png",
              sizes: "512x512",
            },
          ],
        },
      }),
    ],

})
