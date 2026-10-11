import { expect, test } from '@playwright/test';
import { AutomationPracticePage } from '../../pages/AutomationPracticePage';

test.describe('Automation Practice alert popups', () => {
  test('accepts the alert and validates its message', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);
    const name = 'Madhu';

    await practicePage.goto();
    await practicePage.enterName(name);

    const dialog = await practicePage.openAlertAndAccept();

    expect(dialog.type).toBe('alert');
    expect(dialog.message).toContain(name);
    expect(dialog.message).toBe(
      `Hello ${name}, share this practice page and share your knowledge`,
    );
  });

  test('accepts the confirmation dialog and remains on the practice page', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);
    const name = 'Madhu';

    await practicePage.goto();
    await practicePage.enterName(name);

    const dialog = await practicePage.openConfirm(true);

    expect(dialog.type).toBe('confirm');
    expect(dialog.message).toBe(`Hello ${name}, Are you sure you want to confirm?`);
    await practicePage.expectNameCleared();
  });

  test('dismisses the confirmation dialog and remains on the practice page', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);
    const name = 'Madhu';

    await practicePage.goto();
    await practicePage.enterName(name);

    const dialog = await practicePage.openConfirm(false);

    expect(dialog.type).toBe('confirm');
    expect(dialog.message).toBe(`Hello ${name}, Are you sure you want to confirm?`);
    await practicePage.expectNameCleared();
  });
});
