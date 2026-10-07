import { expect, type Locator, type Page } from '@playwright/test';

export class ClientProductDetailsPage {
  private readonly addToCartButton: Locator;
  private readonly continueShoppingLink: Locator;
  private readonly detailsSection: Locator;
  private readonly productName: Locator;
  private readonly productPrice: Locator;
  private readonly shareSection: Locator;

  constructor(page: Page) {
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.continueShoppingLink = page.getByRole('link', { name: 'Continue Shopping' });
    this.detailsSection = page.locator('.border-product').filter({ hasText: 'product details' });
    this.productName = page.locator('.rtl-text h2');
    this.productPrice = page.locator('.rtl-text h3');
    this.shareSection = page.locator('.border-product').filter({ hasText: 'Share It' });
  }

  async expectProductDetails(productName: string, productPrice: string): Promise<void> {
    await expect(this.productName).toHaveText(productName);
    await expect(this.productPrice).toContainText(productPrice);
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.detailsSection).toBeVisible();
    await expect(this.continueShoppingLink).toBeVisible();
    await this.expectShareOptions();
  }

  async continueShopping(): Promise<void> {
    await expect(this.continueShoppingLink).toBeVisible();
    await this.continueShoppingLink.click();
  }

  private async expectShareOptions(): Promise<void> {
    await expect(this.shareSection).toBeVisible();
    await expect(this.shareSection.locator('.product-social a')).toHaveCount(5);
    await expect(this.shareSection.locator('.fa-facebook')).toBeVisible();
    await expect(this.shareSection.locator('.fa-google-plus')).toBeVisible();
    await expect(this.shareSection.locator('.fa-twitter')).toBeVisible();
    await expect(this.shareSection.locator('.fa-instagram')).toBeVisible();
    await expect(this.shareSection.locator('.fa-rss')).toBeVisible();
  }
}
