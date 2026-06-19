import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*-specs.ts',
  workers: 1,
  timeout: 60000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  reporter: 'html'
});
