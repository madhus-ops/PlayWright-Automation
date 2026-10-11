import { expect, type Dialog, type Locator, type Page } from '@playwright/test';

const checkboxIds: Record<string, string> = {
  Option1: 'checkBoxOption1',
  Option2: 'checkBoxOption2',
  Option3: 'checkBoxOption3',
};

export type DialogDetails = {
  message: string;
  type: ReturnType<Dialog['type']>;
};

export class AutomationPracticePage {
  private readonly page: Page;
  private readonly nameInput: Locator;
  private readonly alertButton: Locator;
  private readonly confirmButton: Locator;
  private readonly mouseHoverButton: Locator;
  private readonly topLink: Locator;
  private readonly reloadLink: Locator;
  private readonly practicePageHeading: Locator;
  private readonly subscriberHeading: Locator;
  private readonly suggestionInput: Locator;
  private readonly suggestionMenu: Locator;
  private readonly suggestionOptions: Locator;
  private readonly dropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('#name');
    this.alertButton = page.locator('#alertbtn');
    this.confirmButton = page.locator('#confirmbtn');
    this.mouseHoverButton = page.getByRole('button', { name: 'Mouse Hover', exact: true });
    this.topLink = page.getByRole('link', { name: 'Top', exact: true });
    this.reloadLink = page.getByRole('link', { name: 'Reload', exact: true });
    this.practicePageHeading = page.getByRole('heading', { name: 'Practice Page' });
    this.subscriberHeading = page
      .frameLocator('#courses-iframe')
      .getByRole('heading', { name: /Join\s+[\d,]+\s+Happy Subsc(?:r)?ibers!/i });
    this.suggestionInput = page.getByPlaceholder('Type to Select Countries', { exact: true });
    this.suggestionMenu = page.locator('ul.ui-autocomplete');
    this.suggestionOptions = this.suggestionMenu.locator('.ui-menu-item div');
    this.dropdown = page.locator('#dropdown-class-example');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://rahulshettyacademy.com/AutomationPractice/', {
      waitUntil: 'domcontentloaded',
    });
    await expect(this.practicePageHeading).toBeVisible();
  }

  async enterName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async openAlertAndAccept(): Promise<DialogDetails> {
    return this.handleDialog(this.alertButton, true);
  }

  async openConfirm(accept: boolean): Promise<DialogDetails> {
    return this.handleDialog(this.confirmButton, accept);
  }

  async expectNameCleared(): Promise<void> {
    await expect(this.nameInput).toHaveValue('');
    await expect(this.page).toHaveURL(/\/AutomationPractice\/?$/);
  }

  async expectMouseHoverButtonVisible(): Promise<void> {
    await expect(this.mouseHoverButton).toBeVisible();
  }

  async expectMouseHoverOptionsHidden(): Promise<void> {
    await Promise.all([
      expect(this.topLink).toBeHidden(),
      expect(this.reloadLink).toBeHidden(),
    ]);
  }

  async hoverOverMouseHoverButton(): Promise<void> {
    await this.mouseHoverButton.hover();
  }

  async expectMouseHoverOptionsVisible(): Promise<void> {
    await Promise.all([
      expect(this.topLink).toBeVisible(),
      expect(this.reloadLink).toBeVisible(),
    ]);
  }

  async clickTop(): Promise<void> {
    await this.topLink.click();
  }

  async expectPageAtTop(): Promise<void> {
    await expect(this.practicePageHeading).toBeInViewport();
    await expect(this.mouseHoverButton).not.toBeInViewport();
  }

  async clickReload(): Promise<void> {
    await Promise.all([
      this.page.waitForEvent('load'),
      this.reloadLink.click(),
    ]);
  }

  async expectPracticePageAvailable(): Promise<void> {
    await expect(this.page).toHaveURL(/\/AutomationPractice\/?$/);
    await expect(this.practicePageHeading).toBeVisible();
    await expect(this.mouseHoverButton).toBeVisible();
  }

  async expectSubscriberHeadingVisible(): Promise<void> {
    await expect(this.subscriberHeading).toBeVisible();
  }

  async openAllAccessPlanInIframe(): Promise<void> {
    const iframe = this.page.locator('#courses-iframe');
    await expect(iframe).toBeAttached();
    await iframe.scrollIntoViewIfNeeded();

    await expect
      .poll(() => this.page.frames().some((frame) => frame.name() === 'iframe-name'))
      .toBe(true);

    const frame = this.page.frame({ name: 'iframe-name' });
    if (!frame) {
      throw new Error('The Automation Practice iframe was not found.');
    }

    await frame.goto('https://legacy.rahulshettyacademy.com/lifetime-access', {
      waitUntil: 'domcontentloaded',
    });
  }

  async getSubscriberHeadingText(): Promise<string> {
    return this.subscriberHeading.innerText();
  }

  async expectSuggestionInputReady(): Promise<void> {
    await expect(this.suggestionInput).toBeVisible();
    await expect(this.suggestionInput).toBeEnabled();
  }

  async enterCountrySearch(searchText: string): Promise<void> {
    await this.suggestionInput.fill(searchText);
  }

  async expectCountryInputValue(expectedValue: string): Promise<void> {
    await expect(this.suggestionInput).toHaveValue(expectedValue);
  }

  async expectSuggestionsVisible(): Promise<void> {
    await expect(this.suggestionOptions.first()).toBeVisible();
  }

  async expectSuggestionVisible(country: string): Promise<void> {
    await expect(this.suggestionMenu.getByText(country, { exact: true })).toBeVisible();
  }

  async getCountrySuggestions(): Promise<string[]> {
    const suggestions = await this.suggestionOptions.allTextContents();
    return suggestions.map((suggestion) => suggestion.trim()).filter(Boolean);
  }

  async selectCountrySuggestion(country: string): Promise<void> {
    const suggestion = this.suggestionMenu.getByText(country, { exact: true });
    await expect(suggestion).toBeVisible();
    await suggestion.click();
    await expect(this.suggestionInput).toHaveValue(country);
  }

  async expectSuggestionsClosed(): Promise<void> {
    await expect(this.suggestionMenu).toBeHidden();
  }

  async expectDropdownReady(): Promise<void> {
    await expect(this.dropdown).toBeVisible();
    await expect(this.dropdown).toBeEnabled();
  }

  async getDropdownOptions(): Promise<Array<{ label: string; value: string }>> {
    return this.dropdown.locator('option').evaluateAll((options) =>
      options.map((option) => ({
        label: option.textContent?.trim() ?? '',
        value: (option as HTMLOptionElement).value,
      })),
    );
  }

  async selectDropdownOption(label: string): Promise<void> {
    await this.dropdown.selectOption({ label });
  }

  async getSelectedDropdownValue(): Promise<string> {
    return this.dropdown.inputValue();
  }

  async expectDropdownValue(value: string): Promise<void> {
    await expect(this.dropdown).toHaveValue(value);
  }

  async expectDropdownLabel(label: string): Promise<void> {
    await expect(this.dropdown.locator('option:checked')).toHaveText(label);
  }

  getCheckbox(label: string): Locator {
    const checkboxId = checkboxIds[label];
    if (!checkboxId) {
      throw new Error(`Unknown practice-page checkbox: ${label}`);
    }

    return this.page.locator(`#${checkboxId}`);
  }

  async expectCheckboxReady(label: string): Promise<void> {
    const checkbox = this.getCheckbox(label);
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeEnabled();
  }

  async checkCheckbox(label: string): Promise<void> {
    await this.getCheckbox(label).check();
  }

  async uncheckCheckbox(label: string): Promise<void> {
    await this.getCheckbox(label).uncheck();
  }

  async expectCheckboxState(label: string, checked: boolean): Promise<void> {
    await expect(this.getCheckbox(label)).toBeChecked({ checked });
  }

  async selectCountrySuggestionWithKeyboard(country: string): Promise<void> {
    await this.expectSuggestionVisible(country);

    const suggestions = await this.getCountrySuggestions();
    const countryIndex = suggestions.indexOf(country);
    if (countryIndex < 0) {
      throw new Error(`The ${country} suggestion was not found.`);
    }

    for (let index = 0; index <= countryIndex; index += 1) {
      await this.suggestionInput.press('ArrowDown');
    }
    await this.suggestionInput.press('Enter');
    await expect(this.suggestionInput).toHaveValue(country);
  }

  private async handleDialog(
    trigger: Locator,
    accept: boolean,
  ): Promise<DialogDetails> {
    const dialogHandled = new Promise<DialogDetails>((resolve, reject) => {
      this.page.once('dialog', async (dialog) => {
        const details: DialogDetails = {
          message: dialog.message(),
          type: dialog.type(),
        };

        try {
          if (accept) {
            await dialog.accept();
          } else {
            await dialog.dismiss();
          }
          resolve(details);
        } catch (error) {
          reject(error);
        }
      });
    });

    await trigger.click();
    return dialogHandled;
  }
}
