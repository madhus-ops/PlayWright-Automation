import { expect, test } from '@playwright/test';
import { AutomationPracticePage } from '../../pages/AutomationPracticePage';

test('extracts the subscriber count from the All Access iframe', async ({ page }) => {
  const practicePage = new AutomationPracticePage(page);

  await practicePage.goto();
  await practicePage.openAllAccessPlanInIframe();
  await practicePage.expectSubscriberHeadingVisible();

  const headingText = await practicePage.getSubscriberHeadingText();
  const subscriberMatch = headingText.match(
    /Join\s+([\d,]+)\s+Happy\s+Subsc(?:r)?ibers!/i,
  );

  expect(subscriberMatch, `Subscriber count was not found in: ${headingText}`).not.toBeNull();

  const subscriberNumber = subscriberMatch?.[1] ?? '';
  expect(subscriberNumber).toMatch(/^\d{1,3}(?:,\d{3})*$/);
  expect(Number(subscriberNumber.replace(/,/g, ''))).toBeGreaterThan(0);

  console.log(subscriberNumber);
  // await page.pause();
});
