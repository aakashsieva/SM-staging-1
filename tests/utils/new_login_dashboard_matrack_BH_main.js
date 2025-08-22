import { expect } from '@playwright/test';

/**
 * Utility function to perform login to the fleet dashboard
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} username - Username for login
 * @param {string} password - Password for login
 * @returns {Promise<void>}
 */
export async function loginToMatrackDashboard(page, username = 'aakash', password = 'Vj@#!101df2a') {
    // Set longer timeout for navigation
    page.setDefaultTimeout(60000); // 60 seconds

    console.log('Starting login process...');

    // Navigate to login page with retry logic
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
        try {
            console.log(`Login attempt ${retryCount + 1}/${maxRetries}`);
            
            // Navigate to login page
            console.log('Navigating to login page...');
            await page.goto('https://www.matrack-server.com/gpstracking/adminnew/view/login.php', {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });
            
            // Fill in login credentials
            console.log('Filling login credentials...');
            await page.getByRole('textbox', { name: 'User ID' }).click();
            await page.getByRole('textbox', { name: 'User ID' }).fill(username);
            await page.getByRole('textbox', { name: 'User ID' }).press('Tab');
            await page.getByRole('textbox', { name: 'Password' }).fill(password);
            await page.getByRole('textbox', { name: 'Password' }).press('Enter');
            await page.getByRole('textbox', { name: 'Password' }).press('Tab');
            
            // Click sign in button
            console.log('Clicking sign in button...');
            await page.getByRole('button', { name: ' SIGN IN' }).press('Enter');
            await page.getByRole('button', { name: ' SIGN IN' }).click();
            
            // Wait for navigation with more reliable strategy
            console.log('Waiting for login to complete...');
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(12000);

            // Navigate to the dashboard page with retry logic
            console.log('Navigating to dashboard...');
            await page.goto('https://www.matrack-server.com/gpstracking/client/BlueHouse/maps/dashboard.php', {
                waitUntil: 'domcontentloaded',
                timeout: 120000
            });

            // Wait for the dashboard to load with more reliable strategy
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(12000);
            
            // Wait for the sidebar to be visible to confirm we're on the dashboard
            console.log('Waiting for dashboard to load...');
            await page.locator('#mCSB_1_container').waitFor({ state: 'visible', timeout: 30000 });
            
            // If we get here, navigation was successful
            console.log('Login successful!');
            break;
        } catch (error) {
            retryCount++;
            console.log(`Login attempt ${retryCount} failed: ${error.message}`);
            if (retryCount === maxRetries) {
                throw new Error(`Failed to login after ${maxRetries} attempts: ${error.message}`);
            }
            console.log(`Retrying in 5 seconds...`);
            await page.waitForTimeout(5000); // Wait before retry
        }
    }
    
    console.log('Successfully logged in and navigated to dashboard');
} 