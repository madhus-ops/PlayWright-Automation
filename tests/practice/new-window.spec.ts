import { expect, test } from '@playwright/test';
import { AutomationPracticePage } from '../../pages/AutomationPracticePage';

const destinationUrl = /^https:\/\/(?:www\.)?qaclickacademy\.com(?:\/|$)/i;

test.describe('Automation Practice new window handling', () => {
  test('opens a new page when Open Window is clicked', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);
    await practicePage.goto();
    const context = page.context();
    const originalPageCount = context.pages().length;

    const newPage = await practicePage.openNewWindow();

    expect(newPage).not.toBe(page);
    expect(context.pages()).toHaveLength(originalPageCount + 1);
    expect(newPage.url()).not.toBe('');
  });

  test('reports the new window destination and any loading error', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);
    await practicePage.goto();

    const newPage = await practicePage.openNewWindow();
    await newPage.waitForURL(destinationUrl);
    await newPage.waitForLoadState('domcontentloaded');

    const url = newPage.url();
    const title = await newPage.title();
    const bodyText = await newPage.locator('body').innerText();
    const isCloudflare526 = /Invalid SSL certificate|Error code\s*526|\b526\s*:/i.test(
      `${title}\n${bodyText}`,
    );
    const destinationError = isCloudflare526
      ? 'Cloudflare Error 526 (Invalid SSL certificate)'
      : 'none detected';

    console.log(`New window URL: ${url}`);
    console.log(`New window title: ${title}`);
    console.log(`Observed destination error: ${destinationError}`);

    expect(url).toMatch(destinationUrl);
    expect(title.trim()).not.toBe('');
    expect(
      isCloudflare526,
      `The destination is unavailable at ${url}; page title: ${title}; observed error: ${destinationError}`,
    ).toBe(false);
  });

  test('keeps the original practice page open', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);
    await practicePage.goto();

    const newPage = await practicePage.openNewWindow();

    expect(newPage).not.toBe(page);
    expect(page.isClosed()).toBe(false);
    await practicePage.expectPracticePageAvailable();
  });

  test('can close the new page while keeping the original usable', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);
    await practicePage.goto();

    const newPage = await practicePage.openNewWindow();
    await newPage.close();

    expect(newPage.isClosed()).toBe(true);
    expect(page.isClosed()).toBe(false);
    await practicePage.expectPracticePageAvailable();
  });
});
