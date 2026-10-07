import { expect, type Locator, type Page } from '@playwright/test';

export class OrdersPage {
  private readonly page: Page;
  private readonly ordersButton: Locator;
  private readonly orderDetailsId: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ordersButton = page.getByRole('button', { name: 'ORDERS' });
    this.orderDetailsId = page.locator('.col-text');
  }

  private orderRow(orderId: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: orderId });
  }

  async open(): Promise<void> {
    await this.ordersButton.click();
  }

  async openOrderDetails(orderId: string): Promise<void> {
    const orderRow = this.orderRow(orderId);
    await expect(orderRow, `Order ${orderId} should appear in the order history`).toBeVisible();
    await orderRow.locator('button').first().click();
  }

  async expectOrderDetails(orderId: string): Promise<void> {
    await expect(this.orderDetailsId).toHaveText(orderId);
  }
}
