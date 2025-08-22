import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_SM_staging';

test('Fuel Display Option and Validate API Response', async ({ page }) => {
  test.setTimeout(120000);

  await loginToMatrackDashboard(page);
  await page.waitForTimeout(5000);

  console.log('Navigating to Admin Settings...');
  const reportsMenu = page.locator('a:has-text("Admin Settings")');
  await reportsMenu.click();
  await page.waitForTimeout(2000);

  const allUnitStatusSelectors = [
    page.locator('#aChangeDisplayOptions_fuel').first(),
    page.getByRole('link', { name: 'Fuel Display Options' }),
    page.locator('a:has-text("Fuel Display Options")'),
  ];

  let locationHistoryClicked = false;
  let response;
  for (const selector of allUnitStatusSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      [response] = await Promise.all([
        page.waitForResponse(
          res => res.url().includes('getFuel.php'),
          { timeout: 5000 }
        ),
        selector.click(),
      ]);
      console.log('getting fuel display option value from API');
      locationHistoryClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
    }
  }

  if (!locationHistoryClicked) {
    throw new Error('Failed to click Fuel Display Option');
  }

  const rawText = await response.text();
  console.log('fuel type response:', rawText);
  await page.waitForTimeout(10000);
  
  // Extract the string value from the quoted response
  let fuelType = rawText.trim();
  // Remove quotes if present (both single and double quotes)
  fuelType = fuelType.replace(/^["']|["']$/g, '').toLowerCase();
  console.log('extracted fuel type:', fuelType);
  
  // if current fuel type is "regular" then change to "otr" else change to "regular"
  if (fuelType === "regular") {
    console.log('clicking fuel type response - OTR');
    const otrRadio = page.locator('#divChangeDisplayOptions_fuel input[type="radio"][value="otr"]');
    await otrRadio.waitFor({ state: 'visible', timeout: 10000 });
    await otrRadio.click();
    console.log('OTR radio button clicked successfully');
    await page.waitForTimeout(3000);
  } else {
    console.log('clicking fuel type response - Regular');
    const regularRadio = page.locator('#divChangeDisplayOptions_fuel input[type="radio"][value="regular"]');
    await regularRadio.waitFor({ state: 'visible', timeout: 10000 });
    await regularRadio.click();
    console.log('Regular radio button clicked successfully');
    await page.waitForTimeout(3000);
  }
  //expect(text).toBe('-7');
  await page.locator('#divChangeDisplayOptions_fuel .submit').click();
  // wait for 5 seconds
  await page.waitForTimeout(5000);

});
