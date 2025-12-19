import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check that the page title is correct
  await expect(page).toHaveTitle(/Communitiful/);
  
  // Check that the root element exists
  const root = page.locator('#root');
  await expect(root).toBeVisible();
});

test('page has basic structure', async ({ page }) => {
  await page.goto('/');
  
  // Wait for React to render
  await page.waitForLoadState('domcontentloaded');
  
  // Verify the root container exists
  const root = page.locator('#root');
  await expect(root).toBeVisible();
});
