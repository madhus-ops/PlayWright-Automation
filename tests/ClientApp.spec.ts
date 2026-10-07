import { expect, test, type Page } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ClientLoginPage } from '../pages/ClientLoginPage';
import { ClientProductDetailsPage } from '../pages/ClientProductDetailsPage';
import { ClientProductsPage } from '../pages/ClientProductsPage';
import { OrdersPage } from '../pages/OrdersPage';
import { clientUser, products } from '../utils/testData';

async function login(page: Page): Promise<ClientProductsPage> {
  const loginPage = new ClientLoginPage(page);
  const productsPage = new ClientProductsPage(page);

  await loginPage.goto();
  await loginPage.login(clientUser.email, clientUser.password);
  await productsPage.waitForProducts();

  return productsPage;
}

test('displays products and allows the user to sign out', async ({ page }) => {
  const productsPage = await login(page);

  console.log(await productsPage.getProductTitles());

  await productsPage.signOut();
  await productsPage.expectSignedOut();
});

test('displays product details from the view button', async ({ page }) => {
  const productsPage = await login(page);
  const productDetailsPage = new ClientProductDetailsPage(page);

  await productsPage.viewProduct(products.clientApp);
  await productDetailsPage.expectProductDetails(products.clientApp, products.clientAppPrice);
});

test('returns to products after continue shopping from details', async ({ page }) => {
  const productsPage = await login(page);
  const productDetailsPage = new ClientProductDetailsPage(page);

  await productsPage.viewProduct(products.clientApp);
  await productDetailsPage.expectProductDetails(products.clientApp, products.clientAppPrice);
  await productDetailsPage.continueShopping();
  await productsPage.expectProductListing(products.clientApp);
  await expect(page).toHaveURL(/\/dashboard\/dash$/);
});

test('removes a product from the cart', async ({ page }) => {
  const productsPage = await login(page);
  const cartPage = new CartPage(page);

  await productsPage.addProductToCart(products.clientApp);
  await productsPage.openCart();
  await cartPage.expectProductInCart(products.clientApp);
  await cartPage.deleteProduct(products.clientApp);
  await cartPage.expectProductDeleted(products.clientApp);
});

test('completes an end-to-end purchase flow', async ({ page }) => {
  const productsPage = await login(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const ordersPage = new OrdersPage(page);

  await productsPage.addProductToCart(products.clientApp);
  await productsPage.openCart();
  await cartPage.expectProductInCart(products.clientApp);
  await cartPage.checkout();

  await checkoutPage.selectCountry('Ind', 'India');
  await checkoutPage.expectUserEmail(clientUser.email);
  await checkoutPage.placeOrder();

  const orderId = await checkoutPage.getOrderId();
  if (!orderId) {
    throw new Error('A valid order ID should be displayed.');
  }

  expect(orderId, 'A valid order ID should be displayed').toBeTruthy();

  await ordersPage.open();
  await ordersPage.openOrderDetails(orderId);
  await ordersPage.expectOrderDetails(orderId);
});
