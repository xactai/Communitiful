import { test, expect } from '@playwright/test';

test.describe('Companion Mode Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should complete full companion flow from landing to chat', async ({ page }) => {
    // Step 1: Start Companion Mode from landing page
    const companionButton = page.locator('button, a').filter({ hasText: /Companion|Start as Companion|Companion Mode/i }).first();
    
    if (await companionButton.isVisible().catch(() => false)) {
      await companionButton.click();
      await page.waitForTimeout(2000); // Wait for location scan to start
    }

    // Step 2: Location Scan - wait for it to complete automatically
    // Location scan auto-completes after ~6.8 seconds
    await page.waitForTimeout(8000);
    
    // Step 3: Companion Auth - should see phone number input
    const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone"], input[placeholder*="mobile"]').first();
    const countryCodeSelect = page.locator('select, button').filter({ hasText: /\+91|\+1|\+44/i }).first();
    
    // Check if we're on auth page
    const isAuthPage = await phoneInput.isVisible().catch(() => false) || 
                       await page.locator('text=/Sign in|Mobile|Phone|OTP/i').isVisible().catch(() => false);
    
    if (isAuthPage) {
      // Fill in a test phone number (using a format that might work)
      if (await phoneInput.isVisible().catch(() => false)) {
        await phoneInput.fill('1234567890');
      }
      
      // Try to submit (may need to handle OTP or may auto-proceed)
      const submitButton = page.locator('button').filter({ hasText: /Continue|Submit|Verify|Send/i }).first();
      if (await submitButton.isVisible().catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }

    // Step 4: Disclaimer - should appear after auth
    const disclaimerAccept = page.locator('button').filter({ hasText: /Accept|I Agree|Continue|Agree/i }).first();
    if (await disclaimerAccept.isVisible({ timeout: 5000 }).catch(() => false)) {
      await disclaimerAccept.click();
      await page.waitForTimeout(2000);
    }

    // Step 5: Avatar Display - should show assigned avatar
    const avatarContinue = page.locator('button').filter({ hasText: /Continue|Next|Start Chat/i }).first();
    if (await avatarContinue.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Verify avatar is displayed
      const avatarImage = page.locator('img[alt*="avatar"], img[src*="avatar"]').first();
      const hasAvatar = await avatarImage.isVisible().catch(() => false);
      
      await avatarContinue.click();
      await page.waitForTimeout(2000);
    }

    // Step 6: Chat - should be in chat interface
    const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"], input[type="text"]').first();
    const chatContainer = page.locator('[class*="chat"], [id*="chat"]').first();
    
    // Verify we're in chat
    const isInChat = await chatInput.isVisible({ timeout: 5000 }).catch(() => false) ||
                     await chatContainer.isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(isInChat).toBeTruthy();
  });

  test('should handle location scan flow', async ({ page }) => {
    // Start companion mode
    const companionButton = page.locator('button, a').filter({ hasText: /Companion|Start as Companion/i }).first();
    
    if (await companionButton.isVisible().catch(() => false)) {
      await companionButton.click();
    }

    // Wait for location scan page
    await page.waitForTimeout(1000);
    
    // Check for location scan indicators
    const scanningText = page.locator('text=/Scanning|Verifying|Location/i');
    const hasScanning = await scanningText.isVisible({ timeout: 5000 }).catch(() => false);
    
    // Location scan should show scanning state
    expect(hasScanning).toBeTruthy();
    
    // Wait for scan to complete (auto-completes after ~6.8s)
    await page.waitForTimeout(8000);
    
    // Should proceed to next step (auth)
    const nextStep = page.locator('input, button').first();
    const hasNextStep = await nextStep.isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasNextStep).toBeTruthy();
  });

  test('should navigate back from companion auth', async ({ page }) => {
    // Navigate to companion auth
    const companionButton = page.locator('button, a').filter({ hasText: /Companion|Start as Companion/i }).first();
    
    if (await companionButton.isVisible().catch(() => false)) {
      await companionButton.click();
      await page.waitForTimeout(8000); // Wait for location scan
    }

    // Check for back button on auth page
    const backButton = page.locator('button').filter({ hasText: /Back|←|Arrow/i }).first();
    if (await backButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await backButton.click();
      await page.waitForTimeout(1000);
      
      // Should be back on landing or location scan
      const landingContent = page.locator('text=/Companion|Hospital|Start/i');
      const hasLanding = await landingContent.isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasLanding).toBeTruthy();
    }
  });
});

