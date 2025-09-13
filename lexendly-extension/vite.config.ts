import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import fs from "fs";

function transformManifest(): Plugin {
  return {
    name: "transform-manifest",
    closeBundle() {
      const manifestPath = resolve(__dirname, "src/manifest.json");
      if (!fs.existsSync(manifestPath)) {
        console.error("manifest.json not found in src/");
        return;
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

      if (manifest.background?.service_worker) {
        manifest.background.service_worker =
          manifest.background.service_worker.replace(/^src\//, "");
      }

      if (manifest.content_scripts) {
        manifest.content_scripts = manifest.content_scripts.map(
          (script: any) => {
            if (script.js) {
              script.js = script.js.map((jsPath: string) =>
                jsPath.replace(/^src\//, "")
              );
            }
            return script;
          }
        );
      }

      if (manifest.action?.default_popup) {
        manifest.action.default_popup = manifest.action.default_popup.replace(
          /^src\//,
          ""
        );
      }

      const outPath = resolve(__dirname, "dist/manifest.json");
      fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
      console.log("✅ manifest.json written to dist/");
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), transformManifest()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup/index.html"),
        background: resolve(__dirname, "src/background/background.ts"),
        content: resolve(__dirname, "src/content/content.ts"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
