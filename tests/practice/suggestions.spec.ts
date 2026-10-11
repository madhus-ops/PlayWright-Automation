import { expect, test } from '@playwright/test';
import { AutomationPracticePage } from '../../pages/AutomationPracticePage';

test.describe('Automation Practice suggestion box', () => {
  test('shows an enabled input that accepts text', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.expectSuggestionInputReady();
    await practicePage.enterCountrySearch('Canada');

    await practicePage.expectCountryInputValue('Canada');
  });

  test('shows matching country suggestions for partial input', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.enterCountrySearch('in');
    await practicePage.expectSuggestionsVisible();

    const suggestions = await practicePage.getCountrySuggestions();
    expect(suggestions.length).toBeGreaterThan(1);
    expect(suggestions).toContain('India');
  });

  test('selects India from the matching suggestions', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.enterCountrySearch('Ind');
    await practicePage.selectCountrySuggestion('India');

    await practicePage.expectCountryInputValue('India');
  });

  test('updates suggestions when the search text changes', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.enterCountrySearch('in');
    await practicePage.expectSuggestionVisible('India');
    const initialSuggestions = await practicePage.getCountrySuggestions();

    await practicePage.enterCountrySearch('can');
    await practicePage.expectSuggestionVisible('Canada');
    const updatedSuggestions = await practicePage.getCountrySuggestions();

    expect(updatedSuggestions).not.toEqual(initialSuggestions);
    expect(updatedSuggestions).toContain('Canada');
    expect(updatedSuggestions).not.toContain('India');
  });

  test('closes the suggestions when there is no matching country', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.enterCountrySearch('in');
    await practicePage.expectSuggestionsVisible();

    await practicePage.enterCountrySearch('zzqcountry999');
    await practicePage.expectSuggestionsClosed();
  });

  test('selects India with the keyboard', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);

    await practicePage.goto();
    await practicePage.enterCountrySearch('India');
    await practicePage.selectCountrySuggestionWithKeyboard('India');

    await practicePage.expectCountryInputValue('India');
  });
});
