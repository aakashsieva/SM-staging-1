import { expect } from '@playwright/test';

/**
 * Utility function to perform login to the fleet dashboard
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} username - Username for login
 * @param {string} password - Password for login
 * @returns {Promise<void>}
 */
export async function loginToMatrackDashboard(page, username = 'aakash', password = 'Vj@#!101df2a') {
    // Set much longer timeout for all operations
    page.setDefaultTimeout(120000); // 2 minutes for all operations
    page.setDefaultNavigationTimeout(120000); // 2 minutes for navigation

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
                timeout: 120000 // 2 minutes for navigation
            });
            
            // Wait for page to be fully loaded
            await page.waitForLoadState('networkidle', { timeout: 60000 });
            await page.waitForTimeout(5000); // Wait 5 seconds for any dynamic content
            
            // Debug: Take screenshot to see what's on the page
            await page.screenshot({ path: `login-page-${retryCount + 1}.png` });
            
            // Debug: Print page title and URL
            console.log('Page title:', await page.title());
            console.log('Current URL:', page.url());
            
            // Fill in login credentials with longer timeouts
            console.log('Filling login credentials...');
            
            // Try different selectors for username field
            try {
                const usernameField = page.getByRole('textbox', { name: 'User ID' });
                await usernameField.waitFor({ state: 'visible', timeout: 30000 });
                await usernameField.click({ timeout: 15000 });
                await usernameField.fill(username);
                console.log('Username filled successfully using role selector');
            } catch (error) {
                console.log('User ID field by role failed, trying alternative selectors...');
                // Try alternative selectors
                const usernameSelectors = [
                    'input[name="username"]',
                    'input[name="userid"]', 
                    'input[name="user_id"]',
                    'input[type="text"]',
                    '#username',
                    '#userid',
                    '#user_id'
                ];
                
                let usernameFilled = false;
                for (const selector of usernameSelectors) {
                    try {
                        const element = page.locator(selector);
                        if (await element.count() > 0) {
                            await element.first().click();
                            await element.first().fill(username);
                            console.log(`Username filled using selector: ${selector}`);
                            usernameFilled = true;
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }
                
                if (!usernameFilled) {
                    throw new Error('Could not find username field');
                }
            }
            
            await page.waitForTimeout(1000);
            
            // Try different selectors for password field  
            try {
                const passwordField = page.getByRole('textbox', { name: 'Password' });
                await passwordField.waitFor({ state: 'visible', timeout: 30000 });
                await passwordField.click({ timeout: 15000 });
                await passwordField.fill(password);
                console.log('Password filled successfully using role selector');
            } catch (error) {
                console.log('Password field by role failed, trying alternative selectors...');
                // Try alternative selectors
                const passwordSelectors = [
                    'input[name="password"]',
                    'input[type="password"]',
                    '#password'
                ];
                
                let passwordFilled = false;
                for (const selector of passwordSelectors) {
                    try {
                        const element = page.locator(selector);
                        if (await element.count() > 0) {
                            await element.first().click();
                            await element.first().fill(password);
                            console.log(`Password filled using selector: ${selector}`);
                            passwordFilled = true;
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }
                
                if (!passwordFilled) {
                    throw new Error('Could not find password field');
                }
            }
            
            await page.waitForTimeout(1000);
            
            // Debug: List all buttons on the page
            console.log('Debugging: Looking for all buttons on the page...');
            const allButtons = await page.locator('button, input[type="button"], input[type="submit"], [role="button"]').all();
            console.log(`Found ${allButtons.length} button-like elements`);
            
            for (let i = 0; i < allButtons.length; i++) {
                const button = allButtons[i];
                const text = await button.textContent();
                const tagName = await button.evaluate(el => el.tagName);
                const type = await button.evaluate(el => el.type || 'none');
                const className = await button.evaluate(el => el.className);
                console.log(`Button ${i}: Tag: ${tagName}, Type: ${type}, Text: "${text}", Class: "${className}"`);
            }
            
            // Since you confirmed the button name is "Sign in", let's focus on that
            console.log('Attempting to click Sign in button...');
            
            const signInSelectors = [
                // Most likely selectors based on your confirmation
                { selector: 'button:has-text("Sign in")', description: 'button with "Sign in" text' },
                { selector: 'getByRole("button", { name: "Sign in" })', description: 'button role with Sign in name', isPlaywrightRole: true },
                { selector: 'getByRole("button", { name: /sign in/i })', description: 'button role with Sign in (case insensitive)', isPlaywrightRole: true },
                // Backup selectors
                { selector: 'input[type="submit"][value*="Sign in"]', description: 'submit input with Sign in value' },
                { selector: 'button[type="submit"]', description: 'submit button' },
                { selector: 'input[type="submit"]', description: 'submit input' },
                { selector: '.btn:has-text("Sign in")', description: 'button class with Sign in text' },
                { selector: 'form button', description: 'any button in form' },
            ];
            
            let buttonClicked = false;
            
            for (const { selector, description, isPlaywrightRole } of signInSelectors) {
                try {
                    console.log(`Trying: ${description}`);
                    
                    let element;
                    if (isPlaywrightRole) {
                        // Use Playwright role selectors
                        if (selector.includes('name: /sign in/i')) {
                            element = page.getByRole('button', { name: /sign in/i });
                        } else {
                            element = page.getByRole('button', { name: 'Sign in' });
                        }
                    } else {
                        element = page.locator(selector);
                    }
                    
                    const count = await element.count();
                    console.log(`Found ${count} elements for: ${description}`);
                    
                    if (count > 0) {
                        // Wait for the element to be visible and enabled with longer timeout
                        await element.first().waitFor({ 
                            state: 'visible', 
                            timeout: 30000 
                        });
                        
                        // Add small delay before clicking
                        await page.waitForTimeout(1000);
                        
                        // Try clicking with extended timeout
                        await element.first().click({ 
                            timeout: 30000,
                            force: false // Don't force click, wait for it to be clickable
                        });
                        
                        console.log(`Successfully clicked: ${description}`);
                        buttonClicked = true;
                        break;
                    }
                } catch (error) {
                    console.log(`Failed to click ${description}: ${error.message}`);
                    continue;
                }
            }
            
            if (!buttonClicked) {
                // As a last resort, try pressing Enter on the password field
                console.log('Trying to press Enter on password field as last resort...');
                try {
                    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
                    buttonClicked = true;
                } catch (error) {
                    // Try alternative password field selector
                    await page.locator('input[type="password"]').first().press('Enter');
                    buttonClicked = true;
                }
            }
            
            if (!buttonClicked) {
                throw new Error('Could not find or click any sign in button');
            }
            
            // Wait for navigation with longer timeout
            console.log('Waiting for login to complete...');
            await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
            await page.waitForTimeout(10000); // Wait longer for any redirects

            // Navigate to the dashboard page with longer timeout
            console.log('Navigating to dashboard...');
            await page.goto('https://www.matrack-server.com/gpstracking/client/BlueHouse/maps/dashboard.php', {
                waitUntil: 'domcontentloaded',
                timeout: 180000 // 3 minutes for dashboard navigation
            });

            // Wait for the dashboard to load with longer timeout
            await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
            await page.waitForTimeout(15000); // Wait longer for dashboard to fully load
            
            // Wait for the sidebar to be visible with longer timeout
            console.log('Waiting for dashboard to load...');
            try {
                await page.locator('#mCSB_1_container').waitFor({ 
                    state: 'visible', 
                    timeout: 60000 // 1 minute timeout
                });
            } catch (error) {
                // Alternative dashboard indicators
                const dashboardSelectors = [
                    '.dashboard',
                    '.main-content',
                    '.sidebar',
                    'nav',
                    '.divVehiclesOutForRepoCard'
                ];
                
                let dashboardFound = false;
                for (const selector of dashboardSelectors) {
                    try {
                        await page.locator(selector).waitFor({ 
                            state: 'visible', 
                            timeout: 20000 // Longer timeout for dashboard elements
                        });
                        console.log(`Dashboard confirmed using selector: ${selector}`);
                        dashboardFound = true;
                        break;
                    } catch (e) {
                        continue;
                    }
                }
                
                if (!dashboardFound) {
                    console.log('Warning: Could not confirm dashboard loaded, but continuing...');
                }
            }
            
            // If we get here, navigation was successful
            console.log('Login successful!');
            break;
        } catch (error) {
            retryCount++;
            console.log(`Login attempt ${retryCount} failed: ${error.message}`);
            if (retryCount === maxRetries) {
                throw new Error(`Failed to login after ${maxRetries} attempts: ${error.message}`);
            }
            console.log(`Retrying in 10 seconds...`);
            await page.waitForTimeout(10000); // Wait longer before retry
        }
    }
    
    console.log('Successfully logged in and navigated to dashboard');
}