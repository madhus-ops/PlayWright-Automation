import { expect, test } from '@playwright/test';
import { AngularPracticePage } from '../pages/AngularPracticePage';
import { products } from '../utils/testData';

test('Special locators', async ({ page }) => {
  const practicePage = new AngularPracticePage(page);

  await practicePage.goto();
  await practicePage.completePracticeForm({ gender: 'Male', password: 'test@123' });
  await practicePage.expectSuccessMessage({ timeout: 6000 });
  await practicePage.openShop();
  await practicePage.addProductToCart(products.angularPractice);
});

test('test level timeout', async ({ page }) => {
  const slowExpect = expect.configure({ timeout: 9000 });
  const practicePage = new AngularPracticePage(page);

  await practicePage.goto();
  await practicePage.submitForm();
  await practicePage.expectSuccessMessage();
  await practicePage.openShop();
  await practicePage.expectShopHeading('Shop Name', slowExpect);
  await practicePage.addProductToCart(products.angularPractice);
});
