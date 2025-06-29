import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  output: {
    cssModules: {
      // Enable CSS Modules for files with .module.scss extension
      auto: (resource) => resource.includes('.module.'),
      // Use camelCase for CSS class names
      exportLocalsConvention: 'camelCase',
    },
    copy: [{ from: 'public', to: '' }],
  },
  resolve: {
    alias: {
      '@': './src',
      '@app': './src/app',
      '@pages': './src/pages',
      '@widgets': './src/widgets',
      '@features': './src/features',
      '@entities': './src/entities',
      '@shared': './src/shared',
    },
  },
});
