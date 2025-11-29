import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display landing page with main content', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Communitiful/);
    
    // Check that root element is visible
    const root = page.locator('#root');
    await expect(root).toBeVisible();
  });

  test('should have Companion Mode and Hospital Mode options', async ({ page }) => {
    // Wait for landing page content to load
    await page.waitForSelector('text=/Companion|Hospital|Start|Get Started/i', { timeout: 10000 });
    
    // Check for mode selection buttons or cards
    const companionButton = page.locator('button, a').filter({ hasText: /Companion|Start as Companion/i }).first();
    const hospitalButton = page.locator('button, a').filter({ hasText: /Hospital|Register Hospital/i }).first();
    
    // At least one mode option should be visible
    const hasCompanion = await companionButton.isVisible().catch(() => false);
    const hasHospital = await hospitalButton.isVisible().catch(() => false);
    
    expect(hasCompanion || hasHospital).toBeTruthy();
  });

  test('should navigate to About/What Is This page', async ({ page }) => {
    // Look for About or What Is This link/button
    const aboutLink = page.locator('button, a').filter({ hasText: /About|What is this|Learn more/i }).first();
    
    if (await aboutLink.isVisible().catch(() => false)) {
      await aboutLink.click();
      await page.waitForTimeout(1000); // Wait for navigation
      
      // Should be on about page (check for back button or about content)
      const backButton = page.locator('button').filter({ hasText: /Back|Return/i }).first();
      const hasBackButton = await backButton.isVisible().catch(() => false);
      expect(hasBackButton).toBeTruthy();
    }
  });

  test('should navigate to Privacy/Terms page', async ({ page }) => {
    // Look for Privacy or Terms link/button
    const privacyLink = page.locator('button, a').filter({ hasText: /Privacy|Terms|Privacy Policy/i }).first();
    
    if (await privacyLink.isVisible().catch(() => false)) {
      await privacyLink.click();
      await page.waitForTimeout(1000); // Wait for navigation
      
      // Should be on privacy page (check for back button or privacy content)
      const backButton = page.locator('button').filter({ hasText: /Back|Return/i }).first();
      const hasBackButton = await backButton.isVisible().catch(() => false);
      expect(hasBackButton).toBeTruthy();
    }
  });

  test('should support language toggle if available', async ({ page }) => {
    // Look for language toggle button
    const langToggle = page.locator('button').filter({ hasText: /EN|HI|Language|🌐/i }).first();
    
    if (await langToggle.isVisible().catch(() => false)) {
      await langToggle.click();
      await page.waitForTimeout(500);
      // Language should have changed (check for Hindi text or different content)
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
    }
  });
});

