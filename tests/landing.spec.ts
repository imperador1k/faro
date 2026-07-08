import { test, expect } from '@playwright/test';

test.describe('Sanity & Authentication Boundaries', () => {

  test('Deve carregar a Landing Page e exibir o título e vibração do Faro', async ({ page }) => {
    await page.goto('/');

    // The header shows "Faro" as the brand name in all locales
    await expect(page.getByText('faro', { exact: false })).toHaveCount(1);

    // Portuguese default hero title: "O jeito grátis, divertido e eficaz de aprender um idioma!"
    await expect(page.getByText('aprender um idioma', { exact: false })).toBeVisible();
  });

  test('Deve navegar para o onboarding ao clicar em Começar', async ({ page }) => {
    await page.goto('/');

    // Intro overlay (z-[9999]) blocks clicks on first visit. Use force to bypass it.
    const comecarBtn = page.getByRole('link', { name: /Comece agora/i }).or(page.getByRole('button', { name: /Comece agora/i }));
    await expect(comecarBtn.first()).toBeVisible({ timeout: 8000 });

    // Force click bypasses the intro overlay's pointer-events interception
    await comecarBtn.first().click({ force: true });

    // Should navigate to onboarding (public route)
    await expect(page).toHaveURL(/\/onboarding/);
  });

});
