import { test, expect } from './baseTest'; 
import userData from '../test-data/userData.json';

test.describe('Pre-Screen Offer - Landing Page', () => {

  // Fresh page every time — perfect for negative paths, field validation, etc.
  test('Approved path - user should see generated offer', async ({ landingPage }) => {
    await landingPage.fillForm(userData.eligibleUser);
    await landingPage.generateOffer(userData.eligibleUser);

    //await expect(landingPage.isOfferEligibleLocator).not.toBeVisible();
   // await expect(landingPage.declineReasonLocator).toBeVisible();
   // await expect(landingPage.declineReasonLocator).toContainText('income', { ignoreCase: true });
  });

});