import { type Locator, type Page } from '@playwright/test';

export class DocumentsPage {
  private readonly instructionText: Locator;

  constructor(page: Page) {
    this.instructionText = page.locator('.red');
  }

  async getSuggestedEmailDomain(): Promise<string> {
    const textContent = await this.instructionText.textContent();
    const domain = textContent?.split('@')[1]?.split(' ')[0];

    if (!domain) {
      throw new Error('Unable to find suggested email domain on documents page.');
    }

    return domain;
  }
}
