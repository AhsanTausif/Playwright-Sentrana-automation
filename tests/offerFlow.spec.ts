import { test, expect } from './baseTest'; 
import userData from '../test-data/userData.json';

test.describe('Pre-Screen Offer - Landing Page', () => {

  // Fresh page every time — perfect for negative paths, field validation, etc.
  test('Approved path - user should see generated offer', async ({ eligibleLandingPage }) => {
    await eligibleLandingPage.fillForm(userData.eligibleUser);
    await eligibleLandingPage.generateOffer(userData.eligibleUser);

  });

});