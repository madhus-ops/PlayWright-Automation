import { test } from '@playwright/test';
import { AutomationPracticePage } from '../../pages/AutomationPracticePage';

test.describe('Automation Practice mouse hover menu', () => {
  test('shows the Top and Reload options on hover', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.expectMouseHoverButtonVisible();
    await practicePage.expectMouseHoverOptionsHidden();

    await practicePage.hoverOverMouseHoverButton();

    await practicePage.expectMouseHoverOptionsVisible();
  // await page.pause();

  });

  test('returns to the top of the page using the Top option', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await page.setViewportSize({ width: 1280, height: 1200 });
    await practicePage.goto();
    await practicePage.hoverOverMouseHoverButton();
    await practicePage.expectMouseHoverOptionsVisible();
    await practicePage.clickTop();

    await practicePage.expectPageAtTop();
   
  });

  test('reloads the practice page using the Reload option', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.hoverOverMouseHoverButton();
    await practicePage.expectMouseHoverOptionsVisible();
    await practicePage.clickReload();

    await practicePage.expectPracticePageAvailable();
    //  await page.pause();
  });
});
