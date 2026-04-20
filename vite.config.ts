import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function serviceWorkerManifestPlugin(): import("vite").Plugin {
  return {
    name: "service-worker-manifest",
    generateBundle(_options, bundle) {
      const assets = Object.values(bundle as Record<string, { type: string; fileName: string }>)
        .filter((chunk) => chunk.type === "chunk" || chunk.type === "asset")
        .map((chunk) => `/${chunk.fileName}`)
        .filter((fileName) => !fileName.endsWith("sw-manifest.js"));

      const manifest = {
        version: Date.now().toString(36),
        assets: ["/", "/index.html", ...assets],
      };

      this.emitFile({
        type: "asset",
        fileName: "sw-manifest.js",
        source: `self.__SW_MANIFEST = ${JSON.stringify(manifest)};`,
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [path.resolve(__dirname, "."), path.resolve(__dirname, "./backend")],
    },
    proxy: {
      "/public": {
        target: "http://127.0.0.1:4400",
        changeOrigin: true,
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), serviceWorkerManifestPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@tanstack")) return "react-query";
          if (id.includes("react-router")) return "router";
          if (id.includes("cmdk") || id.includes("sonner") || id.includes("vaul") || id.includes("lenis")) {
            return "app-chrome";
          }
          return "vendor";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
