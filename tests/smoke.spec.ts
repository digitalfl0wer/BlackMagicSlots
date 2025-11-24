import { test, expect } from '@playwright/test'

test('loads home and shows title', async ({ page }) => {
  await page.goto('/slotmachine.html')
  await expect(page.getByRole('heading', { name: 'Black Magic Reels' })).toBeVisible()
})

test('spin button is present', async ({ page }) => {
  await page.goto('/slotmachine.html')
  await expect(page.getByRole('button', { name: /spin/i })).toBeVisible()
})


