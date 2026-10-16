import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: { __VERSION__: JSON.stringify('0.2.0') },
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.ts'],
    environmentOptions: { jsdom: { url: 'https://shop.example.com/products/owl', runScripts: 'dangerously' } },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/types.ts'],
      reporter: ['text', 'html'],
    },
  },
});
