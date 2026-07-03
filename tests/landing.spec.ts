import { test, expect } from '@playwright/test';

test.describe('Sanity & Authentication Boundaries', () => {

  test('Deve carregar a Landing Page e exibir o título e vibração do Faro', async ({ page }) => {
    await page.goto('/');

    // The header shows "Faro" as the brand name in all locales
    await expect(page.getByText('faro', { exact: false })).toHaveCount(1);

    // Portuguese default hero title: "O jeito grátis, divertido e eficaz de aprender um idioma!"
    await expect(page.getByText('aprender um idioma', { exact: false })).toBeVisible();
  });

  test('Deve redirecionar para a autenticação Clerk ao clicar em Começar', async ({ page }) => {
    await page.goto('/');

    // Dismiss the intro overlay (first visit). Skip button = "Saltar" in PT, "Skip" in EN.
    const skipBtn = page.locator('button', { hasText: /Saltar|Skip/i });
    if (await skipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await skipBtn.click();
    }

    // Find the 'Comece agora' button / link
    const comecarBtn = page.getByRole('button', { name: /Comece agora/i }).or(page.getByRole('link', { name: /Comece agora/i }));
    await expect(comecarBtn.first()).toBeVisible({ timeout: 5000 });

    // Click to trigger Clerk redirect
    await comecarBtn.first().click();

    // Assert redirect to Clerk auth (sign-in, sign-up, or accounts domain)
    await expect(page).toHaveURL(/.*(sign-in|sign-up|accounts|clerk).*/);
  });

});
