import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  private readonly page: Page;
  private readonly countryInput: Locator;
  private readonly emailLabel: Locator;
  private readonly placeOrderButton: Locator;
  private readonly orderConfirmationTitle: Locator;
  private readonly orderConfirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countryInput = page.locator("[placeholder*='Country']");
    this.emailLabel = page.locator(".user__name [type='text']").first();
    this.placeOrderButton = page.locator('.action__submit');
    this.orderConfirmationTitle = page.locator('.hero-primary');
    this.orderConfirmation = page.locator('.em-spacer-1 .ng-star-inserted');
  }

  async selectCountry(countrySearchText: string, countryName: string): Promise<void> {
    await this.countryInput.pressSequentially(countrySearchText);

    const countryOption = this.page.locator('.ta-results button').filter({
      hasText: new RegExp(`^\\s*${countryName}\\s*$`),
    });
    await expect(countryOption).toBeVisible();
    await countryOption.click();
  }

  async expectUserEmail(email: string): Promise<void> {
    await expect(this.emailLabel).toHaveText(email);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async getOrderId(): Promise<string | undefined> {
    await expect(this.orderConfirmationTitle).toContainText('Thankyou for the order.');
    const confirmationText = await this.orderConfirmation.textContent();
    return confirmationText?.split('|')[1]?.trim();
  }
}
