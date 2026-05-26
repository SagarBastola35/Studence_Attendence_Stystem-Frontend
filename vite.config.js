import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err);
            res.writeHead(502, {
              "Content-Type": "application/json",
            });
            res.end(
              JSON.stringify({
                error: "Backend server is not running",
                message:
                  "Please make sure the backend server is started on port 5000",
              }),
            );
          });
        },
      },
    },
  },
});
