import { expect, type BrowserContext, type Locator, type Page } from '@playwright/test';

export class PracticeLoginPage {
  readonly page: Page;
  readonly context?: BrowserContext;
  readonly userName: Locator;
  private readonly password: Locator;
  private readonly signInButton: Locator;
  private readonly errorMessage: Locator;
  private readonly productTitles: Locator;
  private readonly userTypeOptions: Locator;
  private readonly termsCheckbox: Locator;
  private readonly documentLink: Locator;
  private readonly roleDropdown: Locator;
  private readonly okayButton: Locator;

  constructor(page: Page, context?: BrowserContext) {
    this.page = page;
    this.context = context;
    this.userName = page.locator('#username');
    this.password = page.locator("[type='password']");
    this.signInButton = page.locator('#signInBtn');
    this.errorMessage = page.locator("[style*='block']");
    this.productTitles = page.locator('.card-body a');
    this.userTypeOptions = page.locator('.radiotextsty');
    this.termsCheckbox = page.locator('#terms');
    this.documentLink = page.locator("[href*='documents-request']");
    this.roleDropdown = page.locator('select.form-control');
    this.okayButton = page.locator('#okayBtn');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.userName.fill(username);
    await this.password.fill(password);
    await this.signInButton.click();
  }

  async expectIncorrectLogin(): Promise<void> {
    await expect(this.errorMessage).toContainText('Incorrect');
  }

  async loginAsShopper(username: string, password: string): Promise<void> {
    await this.userName.fill('');
    await this.password.fill('');
    await this.login(username, password);
    await this.productTitles.first().waitFor();
  }

  async getProductTitles(): Promise<string[]> {
    return this.productTitles.allTextContents();
  }

  async selectConsultantRole(): Promise<void> {
    await this.roleDropdown.selectOption('consult');
  }

  async selectUserType(userTypeIndex: number): Promise<void> {
    await this.userTypeOptions.nth(userTypeIndex).click();
    await expect(this.userTypeOptions.nth(userTypeIndex)).toBeChecked();
    await this.okayButton.click();
  }

  async acceptAndClearTerms(): Promise<void> {
    await this.termsCheckbox.click();
    await expect(this.termsCheckbox).toBeChecked();
    await this.termsCheckbox.uncheck();
    expect(await this.termsCheckbox.isChecked()).toBeFalsy();
  }

  async expectDocumentLinkBlinking(): Promise<void> {
    await expect(this.documentLink).toHaveAttribute('class', 'blinkingText');
  }

  async openDocumentsPage(): Promise<Page> {
    if (!this.context) {
      throw new Error('Browser context is required to open the documents page.');
    }

    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.documentLink.click(),
    ]);

    return newPage;
  }

  async fillUsername(username: string): Promise<void> {
    await this.userName.fill(username);
  }

  async expectUsername(username: string): Promise<void> {
    await expect(this.userName).toHaveValue(username);
  }
}
