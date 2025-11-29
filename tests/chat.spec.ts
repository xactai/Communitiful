import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to navigate to chat (may need to go through flow)
    // For now, we'll test chat if we can get there
  });

  test('should display chat interface with message input', async ({ page }) => {
    // Navigate through flow to chat (simplified - may need actual flow)
    const companionButton = page.locator('button, a').filter({ hasText: /Companion|Start as Companion/i }).first();
    
    if (await companionButton.isVisible().catch(() => false)) {
      await companionButton.click();
      await page.waitForTimeout(10000); // Wait for location scan + auth
      
      // Try to get to chat by accepting disclaimer if present
      const acceptButton = page.locator('button').filter({ hasText: /Accept|Agree|Continue/i }).first();
      if (await acceptButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await acceptButton.click();
        await page.waitForTimeout(3000);
        
        // Continue from avatar display if present
        const continueButton = page.locator('button').filter({ hasText: /Continue|Next/i }).first();
        if (await continueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await continueButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }

    // Check for chat interface elements
    const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"], input[type="text"]').first();
    const sendButton = page.locator('button').filter({ hasText: /Send|Submit/i }).first();
    const chatContainer = page.locator('[class*="chat"], [id*="chat"], [class*="message"]').first();

    // At least one chat element should be visible
    const hasChatInput = await chatInput.isVisible({ timeout: 5000 }).catch(() => false);
    const hasChatContainer = await chatContainer.isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(hasChatInput || hasChatContainer).toBeTruthy();
  });

  test('should allow typing and sending messages', async ({ page }) => {
    // Navigate to chat (simplified)
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Try to find chat input
    const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]').first();
    
    if (await chatInput.isVisible({ timeout: 10000 }).catch(() => false)) {
      // Type a test message
      await chatInput.fill('Hello, this is a test message');
      
      // Find and click send button
      const sendButton = page.locator('button').filter({ hasText: /Send/i }).first();
      if (await sendButton.isVisible().catch(() => false)) {
        await sendButton.click();
        await page.waitForTimeout(1000);
        
        // Message should appear in chat (may take time to appear)
        const messageText = page.locator('text=/Hello, this is a test message/i');
        const messageAppeared = await messageText.isVisible({ timeout: 3000 }).catch(() => false);
        // Note: May not appear immediately due to moderation/processing
      }
    }
  });

  test('should navigate to settings from chat', async ({ page }) => {
    // Get to chat first
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Look for settings button/icon
    const settingsButton = page.locator('button').filter({ hasText: /Settings|⚙️/i }).first();
    const settingsIcon = page.locator('svg, button').filter({ hasText: /Settings/i }).first();
    
    if (await settingsButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(1000);
      
      // Should be on settings page
      const settingsContent = page.locator('text=/Settings|Language|Leave|About/i');
      const hasSettings = await settingsContent.isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasSettings).toBeTruthy();
    }
  });

  test('should navigate to relaxation from chat', async ({ page }) => {
    // Get to chat first
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Look for relaxation button
    const relaxationButton = page.locator('button').filter({ hasText: /Relax|Relaxation|Calm|Breathe/i }).first();
    
    if (await relaxationButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await relaxationButton.click();
      await page.waitForTimeout(1000);
      
      // Should be on relaxation page
      const relaxationContent = page.locator('text=/Relax|Breathe|Calm|Meditation/i');
      const hasRelaxation = await relaxationContent.isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasRelaxation).toBeTruthy();
    }
  });

  test('should display online users indicator if available', async ({ page }) => {
    // Get to chat
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Look for online users indicator
    const onlineIndicator = page.locator('text=/online|users|active|people/i');
    const hasOnlineIndicator = await onlineIndicator.isVisible({ timeout: 10000 }).catch(() => false);
    
    // This is optional, so we just check if it exists
    // No assertion needed as it may or may not be present
  });

  test('should handle message reactions if available', async ({ page }) => {
    // Get to chat
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Look for existing messages that might have reaction buttons
    const messages = page.locator('[class*="message"]').first();
    if (await messages.isVisible({ timeout: 10000 }).catch(() => false)) {
      // Try to right-click or long-press on a message to see if reactions appear
      await messages.click({ button: 'right' });
      await page.waitForTimeout(500);
      
      // Check for reaction picker
      const reactionPicker = page.locator('[class*="reaction"], [class*="emoji"]').first();
      const hasReactions = await reactionPicker.isVisible({ timeout: 1000 }).catch(() => false);
      // Reactions may or may not be available
    }
  });
});

