import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("production pages, direct links, and navigation", async ({ page }) => {
  const errors = [];
  const brokenAssets = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (
      response.url().startsWith("http://127.0.0.1:4173") &&
      response.status() >= 400
    )
      brokenAssets.push(response.url());
  });
  await page.goto("http://127.0.0.1:4173");
  await expect(page.locator(".motion-control")).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(3);
  await expect(page.locator(".filters")).toHaveCount(0);
  await expect(page.locator(".home-about")).toBeVisible();
  await page.locator('header a[href="/projects/"]').click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.locator(".project-card")).toHaveCount(11);
  await page.locator('[data-project="hedge-fund"]').click();
  await expect(page).toHaveURL(/\/projects\/hedge-fund\/$/);
  await page.reload();
  await expect(page.locator(".case-study")).toContainText(
    "independent Python calculation",
  );
  await expect(page.locator(".hero")).toHaveCount(0);
  await page.locator('header a[href="/about/"]').click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".journey-grid")).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(0);
  await page.locator('header a[href="#contact"]').click();
  await expect(page.locator("#contact")).toBeInViewport();
  for (const path of [
    "/projects/",
    "/about/",
    "/projects/fema/",
    "/projects/azure/",
  ]) {
    await page.goto(`http://127.0.0.1:4173${path}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator(".motion-control")).toBeVisible();
    await expect(page.locator(".intro")).toHaveCount(0);
  }
  expect(errors).toEqual([]);
  expect(brokenAssets).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4173");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/audited-desktop.png",
    fullPage: true,
  });
});

test("core information and repository access remain without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Uche Anya",
  );
  await expect(page.locator("noscript")).toBeVisible();
  await expect(page.locator("noscript a")).toHaveAttribute(
    "href",
    "https://github.com/Uche-anya?tab=repositories",
  );
  await expect(
    page.locator('#contact a[href^="mailto:"]').first(),
  ).toBeVisible();
  await page.goto("http://127.0.0.1:4173/projects/fema/");
  await expect(page.locator(".case-study")).toContainText(
    "Proposed deployment",
  );
  await expect(page.locator('.breadcrumbs a[href="/projects/"]')).toBeVisible();
  await context.close();
});

test("every page layout fits desktop and mobile", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      "/",
      "/projects/",
      "/about/",
      "/projects/hedge-fund/",
    ]) {
      await page.goto(`http://127.0.0.1:4173${path}`);
      await expect(page.locator(".motion-control")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `test-results/page-${path.replaceAll("/", "_")}-${width}.png`,
        fullPage: true,
      });
    }
  }
});
