import { test } from '@playwright/test';
import { AutomationPracticePage } from '../../pages/AutomationPracticePage';

const checkboxLabels = ['Option1', 'Option2', 'Option3'];

test.describe('Automation Practice checkboxes', () => {
  test('shows enabled checkboxes that are initially unchecked', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();

    await Promise.all(checkboxLabels.map((label) => practicePage.expectCheckboxReady(label)));
    await Promise.all(checkboxLabels.map((label) => practicePage.expectCheckboxState(label, false)));
  });

  test('selects Option1 without selecting the other checkboxes', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.checkCheckbox('Option1');

    await practicePage.expectCheckboxState('Option1', true);
    await practicePage.expectCheckboxState('Option2', false);
    await practicePage.expectCheckboxState('Option3', false);
  });

  test('selects Option2 while the other checkboxes remain unchecked', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.checkCheckbox('Option2');

    await practicePage.expectCheckboxState('Option1', false);
    await practicePage.expectCheckboxState('Option2', true);
    await practicePage.expectCheckboxState('Option3', false);
  });

  test('selects Option3 while the other checkboxes remain unchecked', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.checkCheckbox('Option3');

    await practicePage.expectCheckboxState('Option1', false);
    await practicePage.expectCheckboxState('Option2', false);
    await practicePage.expectCheckboxState('Option3', true);
  });

  test('allows all three checkboxes to be selected at the same time', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    for (const label of checkboxLabels) {
      await practicePage.checkCheckbox(label);
    }

    for (const label of checkboxLabels) {
      await practicePage.expectCheckboxState(label, true);
    }
  });

  test('unchecks a selected Option1 checkbox', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.checkCheckbox('Option1');
    await practicePage.uncheckCheckbox('Option1');

    await practicePage.expectCheckboxState('Option1', false);
  });

  test('toggles Option1 off and on again', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.checkCheckbox('Option1');
    await practicePage.expectCheckboxState('Option1', true);

    await practicePage.uncheckCheckbox('Option1');
    await practicePage.expectCheckboxState('Option1', false);

    await practicePage.checkCheckbox('Option1');
    await practicePage.expectCheckboxState('Option1', true);
  });

  test('changes Option1 independently while Option3 stays checked', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.checkCheckbox('Option1');
    await practicePage.checkCheckbox('Option3');

    await practicePage.expectCheckboxState('Option1', true);
    await practicePage.expectCheckboxState('Option2', false);
    await practicePage.expectCheckboxState('Option3', true);

    await practicePage.uncheckCheckbox('Option1');

    await practicePage.expectCheckboxState('Option1', false);
    await practicePage.expectCheckboxState('Option3', true);
  });
});
