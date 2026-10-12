import { test } from '@playwright/test';
import { AutomationPracticePage } from '../../pages/AutomationPracticePage';

const radioButtonNames = ['Radio1', 'Radio2', 'Radio3'];

test.describe('Automation Practice radio buttons', () => {
  test('shows enabled radio buttons with none selected initially', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();

    await Promise.all(
      radioButtonNames.map((name) => practicePage.expectRadioButtonReady(name)),
    );
    await practicePage.expectRadioButtonState('Radio1', false);
    await practicePage.expectRadioButtonState('Radio2', false);
    await practicePage.expectRadioButtonState('Radio3', false);
  });

  test('selects Radio1', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.selectRadioButton('Radio1');

    await practicePage.expectRadioButtonState('Radio1', true);
    await practicePage.expectRadioButtonState('Radio2', false);
    await practicePage.expectRadioButtonState('Radio3', false);
  });

  test('selects Radio2 and deselects the other radio buttons', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.selectRadioButton('Radio2');

    await practicePage.expectRadioButtonState('Radio1', false);
    await practicePage.expectRadioButtonState('Radio2', true);
    await practicePage.expectRadioButtonState('Radio3', false);
  });

  test('selects Radio3 and deselects the other radio buttons', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.selectRadioButton('Radio3');

    await practicePage.expectRadioButtonState('Radio1', false);
    await practicePage.expectRadioButtonState('Radio2', false);
    await practicePage.expectRadioButtonState('Radio3', true);
  });

  test('keeps only the most recently selected radio button checked', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();

    await practicePage.selectRadioButton('Radio1');
    await practicePage.expectRadioButtonState('Radio1', true);
    await practicePage.selectRadioButton('Radio2');
    await practicePage.expectRadioButtonState('Radio1', false);
    await practicePage.expectRadioButtonState('Radio2', true);
    await practicePage.selectRadioButton('Radio3');

    await practicePage.expectRadioButtonState('Radio1', false);
    await practicePage.expectRadioButtonState('Radio2', false);
    await practicePage.expectRadioButtonState('Radio3', true);
  });

  test('allows the selected radio button to be changed repeatedly', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();

    await practicePage.selectRadioButton('Radio1');
    await practicePage.expectRadioButtonState('Radio1', true);
    await practicePage.selectRadioButton('Radio3');
    await practicePage.expectRadioButtonState('Radio1', false);
    await practicePage.expectRadioButtonState('Radio3', true);
    await practicePage.selectRadioButton('Radio2');

    await practicePage.expectRadioButtonState('Radio1', false);
    await practicePage.expectRadioButtonState('Radio2', true);
    await practicePage.expectRadioButtonState('Radio3', false);
  });
});
