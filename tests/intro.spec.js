import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

test("intro reveals the portfolio and plays again on refresh", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5173", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".intro")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Welcome." })).toBeVisible();
  await expect(page.locator(".data-field")).toHaveCount(0);
  await expect(page.locator(".motion-control")).toHaveCount(0);
  await expect(page.locator(".welcome-medallion")).toBeVisible();
  await expect(page.locator(".medallion-title")).toHaveText([
    "BRONZE",
    "SILVER",
    "GOLD",
  ]);
  await expect(page.getByRole("progressbar")).toBeHidden();
  await page.getByRole("button", { name: "Enter portfolio" }).click();
  await expect(
    page.getByRole("progressbar", { name: "Intro progress" }),
  ).toBeVisible();
  await expect(page.locator(".intro-number")).toHaveText("100", {
    timeout: 7000,
  });
  await expect(page.locator(".pipe-node.is-filled")).toHaveCount(4);
  await expect(page.locator(".intro")).toHaveCount(0, { timeout: 6000 });
  await expect(page.locator("html")).not.toHaveClass(/intro-active/);
  await expect(page.locator(".motion-control")).toBeVisible();
  await page.getByRole("link", { name: /^View projects/ }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".project-card")).toHaveCount(11);
  await expect(page.locator(".intro")).toHaveCount(0);
  await page.locator('.header a[href="/"]').click();
  await expect(page.locator(".intro")).toBeVisible();
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.locator(".intro")).toHaveCount(0);
  await expect(page).toHaveURL(/\/$/);
});

test("mobile intro fits and can be skipped with the keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:5173", { waitUntil: "domcontentloaded" });
  const skip = page.getByRole("button", { name: "Skip intro" });
  await expect(
    page.getByRole("button", { name: "Enter portfolio" }),
  ).toBeFocused();
  expect(
    await page.locator(".intro").evaluate((el) => el.scrollWidth <= innerWidth),
  ).toBe(true);
  await page.screenshot({ path: "test-results/welcome-mobile.png" });
  await page.keyboard.press("Enter");
  await expect(skip).toBeFocused();
  await page.screenshot({ path: "test-results/intro-mobile.png" });
  await page.keyboard.press("Enter");
  await expect(page.locator(".intro")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/intro-active/);
});

test("intro respects reduced motion and skips direct project links", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5173");
  await expect(page.locator(".project-card")).toHaveCount(3);
  await expect(page.locator(".intro")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:5173/projects/fema/");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".intro")).toHaveCount(0);
  await expect(page.locator(".case-study")).toBeVisible();
});

test("Escape dismisses the intro immediately", async ({ page }) => {
  await page.goto("http://127.0.0.1:5173", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".intro")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".intro")).toHaveCount(0);
});
