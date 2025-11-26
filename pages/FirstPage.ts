import { Page, expect, test, Locator } from '@playwright/test';

export class FirstPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly emailInput: Locator;
  readonly socialSecurityInput: Locator;
  readonly citizenshipSelect: Locator;
  readonly employerNameInput: Locator;
  readonly employerStartDateInput: Locator;
  readonly annualIncomeInput: Locator;
  readonly streetAddressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly projectCostInput: Locator;
  readonly generateOfferButton: Locator;
  readonly offerDisplayed: Locator;  // Selector for pre-screen offer element
  //readonly declineReason: Locator;   // Selector for decline message

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input.custom-input').first();
    this.lastNameInput = page.locator('input.custom-input').nth(1);
    this.dateOfBirthInput = page.locator('app-date-field').filter({ hasText: 'Date of Birth' }).locator('input');
    // Phone Number Input
    this.phoneNumberInput = page.locator('app-field')
    .filter({ hasText: 'Phone Number' })
    .locator('input.custom-input'); 
    // Email Input
    this.emailInput = page.locator('app-field')
    .filter({ hasText: 'Email' })
    .locator('input.custom-input');
    this.socialSecurityInput = page.getByPlaceholder('XXX-XX-XXXX');
    this.citizenshipSelect = page.getByText('Select Citizenship')
    this.employerNameInput = page.locator('app-field')
    .filter({ hasText: 'Employer Name' })
    .locator('input.custom-input');
    this.employerStartDateInput = page.locator('#mat-input-2');
    this.annualIncomeInput = page.locator('app-field')
    .filter({ hasText: 'Annual Gross Income' })
    .locator('input.custom-input');
    this.streetAddressInput = page.locator('#formSugg');
    this.cityInput = page.getByPlaceholder('City');
    this.stateInput = page.getByPlaceholder('State');
    this.zipInput = page.getByPlaceholder('Zip Code');
    this.projectCostInput = page.locator('app-field')
    .filter({ hasText: 'What is the cost of your project' }) 
    .locator('input.custom-input');    
    this.generateOfferButton = page.getByText('Generate Offer', { exact: true })
    this.offerDisplayed = page.locator('input.custom-input[readonly]');
   // this.offerDisplayed = page.locator('.pre-screen-offer');
   // this.declineReason = page.locator('.decline-reason');
  }

  async fillForm(data: any) {
    await this.fillPersonalInformation(data);
    await this.selectCitizenship(data.citizenship);
    await this.employerNameInput.fill(data.employerName);
    await this.employerStartDateInput.fill(data.employerStartDate);
    await this.annualIncomeInput.fill(data.annualIncome);

    
    // Specialized Address Interaction (The Integration Point)
    // Instead of filling city/state/zip, call the function that handles selection and verification
    await this.fillAndSelectAddress(
            data.partialAddress,
            data.fullAddressToSelect,
            data.expectedCity,
            data.expectedState,
            data.expectedZip
    );

 // await this.streetAddressInput.fill(data.streetAddress);
 // await this.cityInput.fill(data.city);
 // await this.stateInput.fill(data.state);
 // await this.zipInput.fill(data.zip);
    await this.projectCostInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.projectCostInput.fill(data.projectCost);
  }
  
  async fillPersonalInformation(data: any) {
    await test.step('Filling Personal Information Fields', async () => {
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.dateOfBirthInput.fill(data.dateOfBirth);
        await this.phoneNumberInput.fill(data.phoneNumber);
        await this.emailInput.fill(data.email);
        await this.socialSecurityInput.fill(data.socialSecurity);
    });
 }

  async selectCitizenship(citizenshipType: string) {
        await test.step(`Select citizenship type: ${citizenshipType}`, async () => {
            // Click the trigger (using the locator defined in the constructor)
            await this.citizenshipSelect.click(); 

            // Click the desired option text from the overlay
            const optionToSelect = this.page.getByText(citizenshipType, { exact: true });
            await optionToSelect.click();
        });
    }
    
   /*Clicks the generate offer button */
    async generateOffer() {
        await test.step('Click Generate Offer Button', async () => {
            await this.generateOfferButton.click();
            // Wait for either the offer or the decline message to be visible
            await expect(this.offerDisplayed).toBeVisible();

            // confirming the API call succeeded and filled the amount.
            await expect(this.offerDisplayed).not.toBeEmpty();
        });
    }

  // Update fillAndSelectAddress to accept dynamic expected values
    async fillAndSelectAddress(
        partialAddress: string, 
        fullAddressToSelect: string, 
        expectedCity: string, 
        expectedState: string, 
        expectedZip: string
   )  
   {  
    await test.step(`Entering address '${partialAddress}' and selecting suggestion '${fullAddressToSelect}'`, async () => {
        const streetAddressInput = this.streetAddressInput;

        await streetAddressInput.fill(partialAddress);

        const suggestionLocator = this.page.getByText(fullAddressToSelect, { exact: false }).first();

         // Wait for the suggestion to appear (this is critical - debounced API call)
        await expect(suggestionLocator).toBeVisible();

        await suggestionLocator.click({ timeout: 10000 });

        // Pass the expected values to the verification helper
        await this.verifyPreFilledFields(expectedCity, expectedState, expectedZip);
    });
}

    /* Helper function to verify the dynamic pre-filled fields.*/
    async verifyPreFilledFields(expectedCity: string, expectedState: string, expectedZip: string) {
        await test.step('Verifying pre-filled City, State, and Zip', async () => {
        // Verification 1: Check City
        await expect(this.cityInput).toHaveValue(expectedCity);

        // Verification 2: Check State
        await expect(this.stateInput).toHaveValue(expectedState);

        // Verification 3: Check Zip
        await expect(this.zipInput).toHaveValue(expectedZip);
    });


}
}  