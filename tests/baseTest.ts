import { test as base } from '@playwright/test';
import { FirstPage } from '../pages/FirstPage';
import userData from '../test-data/userData.json';

// This is the only fixture you need right now
export const test = base.extend<{
  landingPage: FirstPage;
  eligibleLandingPage: FirstPage;   // pre-filled with eligible user + offer generated
}>({
  // Basic fixture: just goes to the page, returns FirstPage instance
  landingPage: async ({ page }, use) => {
    const firstPage = new FirstPage(page);
    // 1. Navigate without a strict wait condition
    await page.goto('https://fbkc-dev.glyne.ai/myproject');
    
    // 2. Explicitly wait for the most important element to be visible
    // This confirms the page is fully rendered and interactive.
    await firstPage.firstNameInput.waitFor({ state: 'visible', timeout: 100000 });
    await use(firstPage);
  },

  // Golden path fixture: fills form with eligible user and generates offer
  eligibleLandingPage: async ({ landingPage }, use) => {
    await landingPage.fillForm(userData.eligibleUser);
    //await landingPage.generateOffer();

    await use(landingPage);
  },
});

export { expect } from '@playwright/test';