import { defineConfig } from "vite";

// We want to keep your current publish="." on Netlify,
// so we'll emit the bundle to a subfolder and NOT wipe the root.
export default defineConfig({
  root: ".",                 // use your repo root (where index.html lives)
  publicDir: false,          // we aren't using Vite's public copying here
  build: {
    outDir: "assets/build",  // bundle goes here (keeps your root clean)
    emptyOutDir: false,      // don't delete your existing files
    rollupOptions: {
      input: {
        // Name this entry "home" → outputs main.js to assets/build/
        home: "scripts/firebase/entry-home.js",
      },
      output: {
        // Deterministic filenames (no hashes) so you can link them easily
        entryFileNames: "main.js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
