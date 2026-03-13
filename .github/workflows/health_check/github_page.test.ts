import { test, expect } from '@playwright/test';

test('Communitiful GitHub Page – full landing page verification', async ({ page }) => {
    // -------------------------
    // Page load
    // -------------------------
    await page.goto('https://xactai.github.io/Communitiful/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/github\.io\/Communitiful/);
    await expect(page).toHaveTitle(/Companions Anonymous/);

    // -------------------------
    // Hero section
    // -------------------------
    const headline = page.getByText(
        'A Safe Space for Companions, Right Outside the Clinic'
    );
    await expect(headline).toBeVisible();

    const subHeadline = page.getByText(
        /While patients get care, their loved ones get comfort/i
    );
    await expect(subHeadline).toBeVisible();

    // -------------------------
    // Primary CTAs
    // -------------------------
    const learnButton = page.getByRole('button', {
        name: /Learn How It Works/i,
    });
    const hospitalsButton = page.getByRole('button', {
        name: /For Hospitals/i,
    });

    await expect(learnButton).toBeVisible();
    await expect(hospitalsButton).toBeVisible();

    // -------------------------
    // How It Works navigation
    // -------------------------
    await learnButton.click();

    const howItWorksHeading = page.getByRole('heading', {
        name: /How It Works/i,
    });
    await expect(howItWorksHeading).toBeVisible();

    await expect(page.getByText('Hospital Registration')).toBeVisible();
    await expect(page.getByText('Scan QR Code')).toBeVisible();
    await expect(page.getByText('Join Chat Room')).toBeVisible();

    // -------------------------
    // Feature / mission content
    // -------------------------
    await expect(
        page.getByText(/Safe & Private/i).first()
    ).toBeVisible();

    await expect(
        page.getByText(/AI-powered/i).first()
    ).toBeVisible();

    // -------------------------
    // Footer
    // -------------------------
    await page.evaluate(() =>
        window.scrollTo(0, document.body.scrollHeight)
    );

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    await expect(
        page.getByText(/Companions Anonymous/i).last()
    ).toBeVisible();

    // -------------------------
    // Mobile responsiveness
    // -------------------------
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(headline).toBeVisible();
    await expect(learnButton).toBeVisible();
});
