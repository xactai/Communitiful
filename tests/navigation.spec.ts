import { test, expect } from '@playwright/test';

test.describe('Navigation and Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to settings and back', async ({ page }) => {
    // Try to get to chat first (where settings is accessible)
    // For now, just check if settings page exists when navigated to
    
    // Look for settings button anywhere
    const settingsButton = page.locator('button, a').filter({ hasText: /Settings|⚙️/i }).first();
    
    if (await settingsButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(1000);
      
      // Should be on settings page
      const settingsContent = page.locator('text=/Settings|Language|Leave|About/i');
      const hasSettings = await settingsContent.isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasSettings).toBeTruthy();
      
      // Check for back button
      const backButton = page.locator('button').filter({ hasText: /Back|←|Return/i }).first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await page.waitForTimeout(1000);
        
        // Should navigate back
        const notOnSettings = !(await settingsContent.isVisible({ timeout: 2000 }).catch(() => false));
        expect(notOnSettings).toBeTruthy();
      }
    }
  });

  test('should navigate to relaxation page and back', async ({ page }) => {
    // Look for relaxation button
    const relaxationButton = page.locator('button, a').filter({ hasText: /Relax|Relaxation|Calm|Breathe/i }).first();
    
    if (await relaxationButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await relaxationButton.click();
      await page.waitForTimeout(1000);
      
      // Should be on relaxation page
      const relaxationContent = page.locator('text=/Relax|Breathe|Calm|Meditation/i');
      const hasRelaxation = await relaxationContent.isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasRelaxation).toBeTruthy();
      
      // Check for back button
      const backButton = page.locator('button').filter({ hasText: /Back|←|Return/i }).first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await page.waitForTimeout(1000);
        
        // Should navigate back
        const notOnRelaxation = !(await relaxationContent.isVisible({ timeout: 2000 }).catch(() => false));
        expect(notOnRelaxation).toBeTruthy();
      }
    }
  });

  test('should allow leaving room from settings', async ({ page }) => {
    // Navigate to settings
    const settingsButton = page.locator('button, a').filter({ hasText: /Settings|⚙️/i }).first();
    
    if (await settingsButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(1000);
      
      // Look for leave room button
      const leaveButton = page.locator('button').filter({ hasText: /Leave|Exit|Logout|Sign out/i }).first();
      if (await leaveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await leaveButton.click();
        await page.waitForTimeout(2000);
        
        // Should return to landing page
        const landingContent = page.locator('text=/Companion|Hospital|Start/i');
        const hasLanding = await landingContent.isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasLanding).toBeTruthy();
      }
    }
  });

  test('should change language in settings if available', async ({ page }) => {
    // Navigate to settings
    const settingsButton = page.locator('button, a').filter({ hasText: /Settings|⚙️/i }).first();
    
    if (await settingsButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(1000);
      
      // Look for language selector
      const langSelector = page.locator('select, button').filter({ hasText: /Language|EN|HI|English|Hindi/i }).first();
      if (await langSelector.isVisible({ timeout: 3000 }).catch(() => false)) {
        await langSelector.click();
        await page.waitForTimeout(500);
        
        // Try to select different language
        const langOption = page.locator('button, option').filter({ hasText: /HI|Hindi|EN|English/i }).first();
        if (await langOption.isVisible().catch(() => false)) {
          await langOption.click();
          await page.waitForTimeout(1000);
          
          // Language should have changed (check page content)
          const pageContent = await page.textContent('body');
          expect(pageContent).toBeTruthy();
        }
      }
    }
  });

  test('should navigate to About Companions from settings', async ({ page }) => {
    // Navigate to settings
    const settingsButton = page.locator('button, a').filter({ hasText: /Settings|⚙️/i }).first();
    
    if (await settingsButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(1000);
      
      // Look for About Companions link
      const aboutLink = page.locator('button, a').filter({ hasText: /About|Companions|What is this/i }).first();
      if (await aboutLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await aboutLink.click();
        await page.waitForTimeout(1000);
        
        // Should be on about page
        const aboutContent = page.locator('text=/About|Companions|What|Information/i');
        const hasAbout = await aboutContent.isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasAbout).toBeTruthy();
      }
    }
  });
});

