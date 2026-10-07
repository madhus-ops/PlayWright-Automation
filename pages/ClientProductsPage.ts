import { expect, type Locator, type Page } from '@playwright/test';

export class ClientProductsPage {
  private readonly productCards: Locator;
  private readonly productTitles: Locator;
  private readonly cartLink: Locator;
  private readonly signOutButton: Locator;
  private readonly logoutMessage: Locator;

  constructor(page: Page) {
    this.productCards = page.locator('.card-body');
    this.productTitles = page.locator('.card-body b');
    this.cartLink = page.locator("[routerlink*='cart']");
    this.signOutButton = page.getByText('Sign Out', { exact: true });
    this.logoutMessage = page.getByText('Logout Successfully');
  }

  async waitForProducts(): Promise<void> {
    await expect(this.productCards.first()).toBeVisible();
  }

  async expectProductListing(productName: string): Promise<void> {
    await expect(this.productCards.filter({ hasText: productName })).toBeVisible();
    await expect(this.productTitles.filter({ hasText: productName })).toBeVisible();
  }

  async getProductTitles(): Promise<string[]> {
    await expect(this.productTitles.first()).toBeVisible();
    return this.productTitles.allTextContents();
  }

  async addProductToCart(productName: string): Promise<void> {
    const productCard = this.productCards.filter({ hasText: productName });
    await expect(productCard).toBeVisible();
    await productCard.getByText('Add To Cart').click();
  }

  async viewProduct(productName: string): Promise<void> {
    const productCard = this.productCards.filter({ hasText: productName });
    await expect(productCard).toBeVisible();
    await productCard.getByText('View').click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async signOut(): Promise<void> {
    await this.signOutButton.click();
  }

  async expectSignedOut(): Promise<void> {
    await expect(this.logoutMessage).toContainText('Logout');
  }
}
