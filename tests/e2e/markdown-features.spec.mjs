import { test, expect } from '@playwright/test';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('external links, youtube, and file embeds', async ({ page }) => {
  await page.goto('/docs/markdown-features/');

  const astroLink = page.getByRole('link', { name: 'Astro documentation' });
  await expect(astroLink).toHaveAttribute('target', '_blank');
  await expect(astroLink).toHaveAttribute('rel', 'noopener noreferrer');

  await expect(page.locator('.youtube-embed iframe')).toBeVisible();
  await expect(page.locator('.youtube-embed iframe')).toHaveAttribute('src', /youtube-nocookie/);

  await expect(page.locator('.code-block[data-language="javascript"]')).toBeVisible();
  await expect(page.locator('.code-block[data-language="yaml"]')).toBeVisible();

  const openRaw = page.locator('a:has-text("Open raw")').first();
  await expect(openRaw).toHaveAttribute('target', '_blank');
  await expect(openRaw).toHaveAttribute('rel', 'noopener noreferrer');
});

test('Mermaid diagrams provide zoom and pointer pan controls', async ({ page }) => {
  await page.goto('/docs/sources/azure-knowledge/concepts/azure-well-architected/');

  const diagram = page.locator('[data-diagram]').first();
  await expect(diagram).toBeVisible();
  await expect(diagram.getByRole('button', { name: 'Zoom in' })).toBeVisible();
  await expect(diagram.getByRole('button', { name: 'Zoom out' })).toBeVisible();
  await expect(diagram.getByRole('button', { name: 'Reset' })).toBeVisible();

  await diagram.getByRole('button', { name: 'Zoom in' }).click();
  await expect(diagram).toHaveAttribute('data-zoom', '1.25');
  await diagram.getByRole('button', { name: 'Reset' }).click();
  await expect(diagram).toHaveAttribute('data-zoom', '1');

  const viewport = diagram.locator('[data-diagram-viewport]');
  const box = await viewport.boundingBox();
  if (!box) throw new Error('Diagram viewport has no bounds');
  await page.mouse.move(box.x + 300, box.y + 110);
  await page.mouse.down();
  await page.mouse.move(box.x + 350, box.y + 110);
  await page.mouse.up();
  await expect(diagram.locator('[data-diagram-canvas]')).toHaveAttribute('style', /translate\(50px/);
});

test('markdown enhancements work in the published docs page', async ({ page }) => {
  await page.goto('/docs/markdown-features/');

  await expect(page.locator('.code-block[data-language="html"]')).toBeVisible();
  await expect(page.locator('.code-block__language').first()).toHaveText('HTML');
  await expect(page.locator('[data-jsfiddle]')).toBeVisible();
  await expect(page.locator('.prose details')).toHaveCount(1);

  await page.locator('[data-preview-toggle]').click();
  await expect(page.locator('[data-preview-srcdoc]')).toHaveAttribute('hidden', '');
  await page.locator('[data-preview-toggle]').click();
  await expect(page.locator('[data-preview-srcdoc]')).not.toHaveAttribute('hidden');

  await page.locator('[data-copy-code]').first().click();
  await expect(page.locator('[data-copy-code]').first()).toHaveText('Copied');

  await page.locator('[data-copy-to-clipboard]').click();
  await expect(page.locator('[data-copy-to-clipboard]')).toHaveText('Copied');

  // SVGs are now rendered inline for CSS styling — no zoom button needed
  const inlineSvg = page.locator('.markdown-svg svg').first();
  await expect(inlineSvg).toBeVisible();
  await expect(inlineSvg).toHaveAttribute('role', 'img');

  await expect(page.getByRole('link', { name: 'Edit on GitHub' })).toHaveAttribute('href', /\/edit\/main\/content\/portal\/markdown-features\.md$/);
});
