import { test, expect } from '@playwright/test';

/**
 * E2E test suite for the complete user journey:
 * 1. Landing Page validation
 * 2. Hospital Registration with autofill validation
 * 3. Fetch Location and save companion number
 * 4. Submit Hospital Registration
 * 5. Return to Landing Page with success
 * 6. Switch to Companion Mode
 * 7. Authenticate with saved mobile number
 * 8. Navigate through disclaimer (with checkbox) and avatar selection
 * 9. Chat interaction (Sending message)
 * 10. Logout and Feedback submission
 * 11. Final Landing Page validation
 */
test.describe('Full User Journey', () => {
    test('should complete the entire registration and chat flow', async ({ page }) => {
        // Increase timeout for this long-running flow
        test.setTimeout(180000); // 3 minutes

        // ========== STEP 1: Landing Page ==========
        await page.goto('https://communitiful-xinthe.netlify.app/');
        await page.waitForLoadState('networkidle');

        // Check title
        await expect(page).toHaveTitle(/Communitiful/);

        // ========== STEP 2: Hospital Registration ==========
        // Ensure Hospital Mode is selected (default)
        await expect(page.getByText('Hospital Mode').first()).toBeVisible();

        // Click Get Started
        await page.getByRole('button', { name: /Get Started/i }).click();

        // Wait for the Hospital Form to load
        await expect(page.getByText('Patient Details').first()).toBeVisible({ timeout: 15000 });

        // Wait for autofill animations to complete
        await page.waitForTimeout(10000);

        // Validate that details are autofilled
        await expect(page.locator('#patient-name')).not.toHaveValue('', { timeout: 15000 });
        const patientName = await page.locator('#patient-name').inputValue();
        console.log(`Autofilled patient name: ${patientName}`);

        // Save companion mobile number
        await expect(page.locator('#companion-number-0')).not.toHaveValue('', { timeout: 15000 });
        const savedCompanionNumber = await page.locator('#companion-number-0').inputValue();
        console.log(`Saved companion number: ${savedCompanionNumber}`);

        // Click Fetch Location for Companion 1
        const fetchLocationBtn = page.getByText('Fetch Location').first();
        await fetchLocationBtn.click();

        // Wait for "Location Fetched"
        await expect(page.getByText('Location Fetched').first()).toBeVisible({ timeout: 15000 });

        // Submit Hospital Registration
        const submitBtn = page.getByText('Submit Registration').first();
        await submitBtn.click();

        // ========== STEP 3: Return to Landing with Success ==========
        // Wait for landing page to appear again
        await expect(page.getByRole('heading', { name: 'Communitiful' })).toBeVisible({ timeout: 30000 });

        // ========== STEP 4: Companion Mode Toggle ==========
        const modeToggle = page.locator('#mode-toggle');
        await modeToggle.click();

        // Start as Companion
        await page.getByRole('button', { name: /Get Started/i }).click();

        // ========== STEP 5: Location Scan ==========
        // Location scan auto-completes after ~6.8 seconds
        await expect(page.getByText(/Scanning|Verifying/i).first()).toBeVisible({ timeout: 15000 });
        // Wait for auto-transition to the authentication page
        await page.waitForSelector('input[type="tel"]', { timeout: 30000 });

        // ========== STEP 6: Companion Authentication ==========
        const phoneInput = page.locator('input[type="tel"]').first();
        await phoneInput.fill(savedCompanionNumber);

        // Click Continue
        await page.getByRole('button', { name: /Continue/i }).click();

        // ========== STEP 7: Disclaimer & Avatar ==========
        // Wait for disclaimer page
        await expect(page.getByText(/Anonymous|Respectful/i).first()).toBeVisible({ timeout: 15000 });

        // Click the checkbox
        const disclaimerCheckbox = page.locator('#accept');
        await disclaimerCheckbox.click();

        // Now click continue/agree
        await page.getByRole('button', { name: /Accept|Agree|Continue/i }).click();

        // Avatar Selection/Display
        await expect(page.getByRole('button', { name: /Continue|Start Chat|Enter/i }).first()).toBeVisible({ timeout: 15000 });

        // Record the assigned identity
        const identityText = await page.locator('h1, h2').last().textContent();
        console.log(`Identity assigned: ${identityText}`);

        await page.getByRole('button', { name: /Continue|Start Chat|Enter/i }).first().click();

        // ========== STEP 8: Chat Page ==========
        // Wait for chat input - using the correct placeholder from lib/translations.ts
        const chatInput = page.getByPlaceholder(/fellow companions/i);
        await expect(chatInput).toBeVisible({ timeout: 20000 });

        const testMessage = 'Hello from E2E test! 👋';

        // Fill the message
        await chatInput.click();
        await chatInput.fill(testMessage);
        await page.waitForTimeout(500); // Wait for state update

        // Send message - targeting the button with the send icon specifically
        const sendBtn = page.locator('button').filter({ has: page.locator('svg[class*="lucide-send"]') }).first();
        await sendBtn.click();

        // Wait for message to appear in the chat stream
        await expect(page.getByText(testMessage).first()).toBeVisible({ timeout: 10000 });

        // ========== STEP 9: Logout & Feedback ==========
        // Logout button has an aria-label "Leave chat"
        const leaveBtn = page.getByLabel('Leave chat');
        await expect(leaveBtn).toBeVisible({ timeout: 10000 });
        await leaveBtn.click();

        // Feedback dialog appears
        await expect(page.getByText(/How was your chat experience/i).first()).toBeVisible({ timeout: 10000 });

        // Click a rating emoji (Rate 5 is the best)
        const rating5 = page.getByLabel('Rate 5');
        await expect(rating5).toBeVisible({ timeout: 5000 });
        await rating5.click();

        // Feedback text
        const feedbackArea = page.getByPlaceholder(/Anything we could improve/i);
        if (await feedbackArea.isVisible()) {
            await feedbackArea.fill('E2E test feedback: App is working smoothly!');
        }

        // Submit and Exit
        const finalSubmit = page.getByRole('button', { name: /Submit & Exit/i }).first();
        await finalSubmit.click();

        // Wait for the "Thank you" transition
        await expect(page.getByText(/Thank you for your feedback/i)).toBeVisible({ timeout: 10000 });

        // Final redirect to landing
        await expect(page.getByRole('heading', { name: 'Communitiful' })).toBeVisible({ timeout: 20000 });
    });
});
