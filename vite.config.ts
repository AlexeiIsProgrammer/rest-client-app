import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, type UserConfig } from 'vite';
import { intlayerPlugin } from 'vite-intlayer';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    !process.env.VITEST && reactRouter(),
    tsconfigPaths(),
    intlayerPlugin(),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    provider: 'v8',
    setupFiles: './tests/setup.ts',
    coverage: {
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.content.{js,jsx,ts,tsx}',
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/index.{js,jsx,ts,tsx}',
        'src/setupTests.{js,ts}',
        'src/**/*.d.ts',
      ],
    },
    coverageThreshold: {
      global: {
        statements: 80,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
} as UserConfig);
