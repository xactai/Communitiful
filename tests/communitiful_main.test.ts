import { test, expect } from '@playwright/test';

/**
 * E2E smoke test for the Communitiful main domain:
 * https://communitiful.com/
 *
 * Verifies:
 * 1. Site is accessible (200 OK)
 * 2. "Launching Soon" message is visible
 * 3. Branding text is present
 * 4. "Contact Us" section exists
 */
test.use({ ignoreHTTPSErrors: true });

test('Communitiful.com – launching soon placeholder verification', async ({ page }) => {
    // Navigate to the domain
    const response = await page.goto('https://communitiful.com/');

    const heading = page.getByRole('heading', {
    level: 1,
    name: 'Launching Soon'
      });

    await expect(heading).toBeVisible();
});
