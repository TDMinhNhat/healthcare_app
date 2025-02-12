import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import fs from "fs"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        // react()
    ],
    optimizeDeps: {
        exclude: ['js-big-decimal']
    },
    server: {
        https: {
            key: fs.readFileSync("localhost+3-key.pem"),
            cert: fs.readFileSync("localhost+3.pem")
        },
        port: 5173,
        host: true,
        allowedHosts: true,
        headers: {
            "Content-Security-Policy":
                "default-src 'self' 'unsafe-inline'; " +
                "script-src 'self' 'nonce-healthcare' 'unsafe-inline' 'unsafe-eval' blob:; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https://*.tile.openstreetmap.org https://tile.openstreetmap.org;" +
                "font-src 'self' data:; " +
                "connect-src 'self' ws: wss: http://localhost:8081;" +
                "object-src 'none'; " +
                "base-uri 'none'; " +
                "form-action 'none';",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block"
        }
    }
})
