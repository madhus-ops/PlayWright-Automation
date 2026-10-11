import { expect, test } from '@playwright/test';
import { AutomationPracticePage } from '../../pages/AutomationPracticePage';

test.describe('Automation Practice dropdown', () => {
  test('shows an enabled dropdown with Select as the default', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.expectDropdownReady();

    await practicePage.expectDropdownLabel('Select');
    await practicePage.expectDropdownValue('');
  });

  test('provides all dropdown options in the expected order', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();

    const options = await practicePage.getDropdownOptions();
    expect(options).toEqual([
      { label: 'Select', value: '' },
      { label: 'Option1', value: 'option1' },
      { label: 'Option2', value: 'option2' },
      { label: 'Option3', value: 'option3' },
    ]);
  });

  test('selects Option1 by its label and verifies its value', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.selectDropdownOption('Option1');

    await practicePage.expectDropdownValue('option1');
    await practicePage.expectDropdownLabel('Option1');
  });

  test('selects Option2 by its label and verifies its value', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.selectDropdownOption('Option2');

    await practicePage.expectDropdownValue('option2');
    await practicePage.expectDropdownLabel('Option2');
  });

  test('selects Option3 by its label and verifies its value', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.selectDropdownOption('Option3');

    await practicePage.expectDropdownValue('option3');
    await practicePage.expectDropdownLabel('Option3');
  });

  test('changes the selection from Option1 to Option3', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.selectDropdownOption('Option1');
    await practicePage.selectDropdownOption('Option3');

    await practicePage.expectDropdownValue('option3');
    await practicePage.expectDropdownLabel('Option3');
  });

  test('resets the selection to Select', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.selectDropdownOption('Option2');
    await practicePage.selectDropdownOption('Select');

    await practicePage.expectDropdownValue('');
    await practicePage.expectDropdownLabel('Select');
  });
});
