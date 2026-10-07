import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  private readonly page: Page;
  private readonly checkoutButton: Locator;
  private readonly deleteButton: Locator;
  private readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByText('Checkout', { exact: true });
    this.deleteButton = page.locator('button.btn-danger');
    this.emptyCartMessage = page.getByText('No Products in Your Cart !');
  }

  private productInCart(productName: string): Locator {
    return this.page.locator('h3').filter({ hasText: productName });
  }

  async expectProductInCart(productName: string): Promise<void> {
    await expect(this.productInCart(productName)).toBeVisible();
  }

  async deleteProduct(productName: string): Promise<void> {
    await this.expectProductInCart(productName);
    await this.deleteButton.click();
  }

  async expectProductDeleted(productName: string): Promise<void> {
    await expect(this.productInCart(productName)).toBeHidden();
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
