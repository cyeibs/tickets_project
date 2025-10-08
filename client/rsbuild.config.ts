import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  html: {
    template: "./public/index.html",
  },

  resolve: {
    alias: {
      "@": "./src",
      "@app": "./src/app",
      "@pages": "./src/pages",
      "@widgets": "./src/widgets",
      "@features": "./src/features",
      "@entities": "./src/entities",
      "@shared": "./src/shared",
    },
  },
});
