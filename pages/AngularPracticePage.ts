import { expect, type Locator, type Page } from '@playwright/test';

type VisibilityOptions = {
  timeout?: number;
};

type PracticeFormData = {
  gender: string;
  password: string;
};

export class AngularPracticePage {
  private readonly page: Page;
  private readonly iceCreamCheckbox: Locator;
  private readonly employedRadio: Locator;
  private readonly genderDropdown: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly successMessage: Locator;
  private readonly shopLink: Locator;
  private readonly shopHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.iceCreamCheckbox = page.getByLabel('Check me out if you Love IceCreams!');
    this.employedRadio = page.getByLabel('Employed');
    this.genderDropdown = page.getByLabel('Gender');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successMessage = page.getByText('Success! The Form has been submitted successfully!.');
    this.shopLink = page.getByRole('link', { name: 'Shop' });
    this.shopHeading = page.locator('.my-4').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('https://rahulshettyacademy.com/angularpractice/');
  }

  async completePracticeForm({ gender, password }: PracticeFormData): Promise<void> {
    await this.iceCreamCheckbox.click();
    await this.employedRadio.check();
    await this.genderDropdown.selectOption(gender);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  async expectSuccessMessage(options: VisibilityOptions = {}): Promise<void> {
    await expect(this.successMessage).toBeVisible(options);
  }

  async openShop(): Promise<void> {
    await this.shopLink.click();
  }

  async expectShopHeading(expectedText: string, assertion: typeof expect = expect): Promise<void> {
    await assertion(this.shopHeading).toHaveText(expectedText);
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.page
      .locator('app-card')
      .filter({ hasText: productName })
      .getByRole('button')
      .click();
  }
}
