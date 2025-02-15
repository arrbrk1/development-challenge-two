import { defineConfig, mergeConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});

async function viteFinal(config, { configType }) {
  return mergeConfig(config, {
    optimizeDeps: {
      include: ["@date-io/core/IUtils"],
    },
  });
}
