import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import manifestJson from "./manifest.json"

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: ["icon.png"],
    manifest: manifestJson
}

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  base: "/cosmos-manager/",
  server: {
    port: 3001,
  }
})
