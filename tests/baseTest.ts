import { test as base } from '@playwright/test';
import { FirstPage } from '../pages/FirstPage';
import userData from '../test-data/userData.json';

// This is the only fixture you need right now
export const test = base.extend<{
  eligibleLandingPage: FirstPage;   // pre-filled with eligible user + offer generated
}>({
  // Basic fixture: just goes to the page, returns FirstPage instance
  eligibleLandingPage: async ({ page }, use) => {
    const firstPage = new FirstPage(page);
    // Navigate without a strict wait condition
    await page.goto('https://fbkc-dev.glyne.ai/myproject', { waitUntil: 'domcontentloaded' });
    
    // NEW CRITICAL STEP: Wait for the network to be idle.
    // This usually covers the initial page load, framework booting, and dynamic fetching (like feature flags) that cause the refresh.
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    
    // Verify an element is visible as a final check
    await firstPage.firstNameInput.waitFor({ state: 'visible' });
    await use(firstPage);
  },
});

export { expect } from '@playwright/test';