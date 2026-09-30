import { test, expect } from "@playwright/test";

test("motion runs, pauses, persists, and resumes", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:5173");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(
    page.getByRole("button", { name: "Pause animations" }),
  ).toBeVisible();
  const initial = await page
    .locator(".tech-track")
    .evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() =>
      page
        .locator(".tech-track")
        .evaluate((el) => getComputedStyle(el).transform),
    )
    .not.toBe(initial);
  await page.getByRole("button", { name: "Pause animations" }).click();
  await expect(page.locator("html")).toHaveClass(/motion-paused/);
  await expect(page.locator(".tech-set[aria-hidden]")).toBeHidden();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Resume animations" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Resume animations" }).click();
  await expect(page.locator("html")).toHaveClass(/motion-enabled/);
  await page.locator('.header a[href="/projects/"]').click();
  await expect(page.locator(".intro")).toHaveCount(0);
  await page.getByRole("button", { name: /^Snowflake/ }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(4);
  await page.locator('[data-project="air"]').click();
  await expect(page.locator(".case-study")).toBeVisible();
  await page.goBack();
  expect(errors).toEqual([]);
});

test("system reduced motion overrides animation preference", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5173");
  await expect(
    page.getByRole("button", {
      name: "Animations off: reduced motion preference",
    }),
  ).toBeDisabled();
  await expect(page.locator("html")).toHaveClass(/motion-paused/);
  expect(
    await page
      .locator(".tech-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await expect(page.locator(".signal-packet").first()).toBeHidden();
});

test("mobile motion stays within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:5173");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(
    page.getByRole("button", { name: "Pause animations" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator('.header a[href="/projects/"]').click();
  await page
    .getByRole("button", { name: "Work in progress", exact: true })
    .click();
  await expect(page.locator(".project-card:visible")).toHaveCount(3);
  await page.getByRole("button", { name: "Pause animations" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
