import { expect, test } from '@playwright/test';
import { DocumentsPage } from '../pages/DocumentsPage';
import { PracticeLoginPage } from '../pages/PracticeLoginPage';
import { invalidPracticeUser, practiceUser } from '../utils/testData';

test.describe('Practice login page', () => {
  test('validates login and displays products', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new PracticeLoginPage(page, context);

    await loginPage.goto();
    console.log(await page.title());

    await loginPage.login(invalidPracticeUser.username, invalidPracticeUser.password);
    await loginPage.expectIncorrectLogin();

    await loginPage.loginAsShopper(practiceUser.username, practiceUser.password);
    console.log(await loginPage.getProductTitles());

    await context.close();
  });
});

test('page playwright test', async ({ page }) => {
  await page.goto('https://google.com/');
  console.log(await page.title());
  await expect(page).toHaveTitle('Google');
});

test('UI controls', async ({ page }) => {
  const loginPage = new PracticeLoginPage(page);

  await loginPage.goto();
  await loginPage.login(practiceUser.username, practiceUser.password);
  await loginPage.selectConsultantRole();
  await loginPage.selectUserType(1);
  await loginPage.acceptAndClearTerms();
  await loginPage.expectDocumentLinkBlinking();
});

test('Child window handled', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new PracticeLoginPage(page, context);

  await loginPage.goto();
  const documentPage = new DocumentsPage(await loginPage.openDocumentsPage());
  const domain = await documentPage.getSuggestedEmailDomain();

  await loginPage.fillUsername(domain);
  console.log(await loginPage.userName.inputValue());
  await loginPage.expectUsername(domain);

  await context.close();
});
