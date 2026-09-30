import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });

test("project filters and dedicated case study pages work", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:5173/projects/");
  await expect(page.locator(".project-card:visible")).toHaveCount(11);
  await page.getByRole("button", { name: /^Azure/ }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(2);
  expect(
    await page
      .locator(".project-card:visible")
      .evaluateAll((nodes) => nodes.map((n) => n.dataset.projectId)),
  ).toEqual(["finance", "azure"]);
  await expect(page.getByRole("button", { name: /^Azure/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: /^AWS/ }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(1);
  await expect(page.locator(".project-card:visible")).toHaveAttribute(
    "data-project-id",
    "london",
  );
  await expect(page.getByRole("button", { name: /^AWS/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: /^Databricks/ }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(4);
  expect(
    await page
      .locator(".project-card:visible [data-project]")
      .evaluateAll((nodes) => nodes.map((n) => n.dataset.project)),
  ).toEqual(["northstar", "commerce", "finance", "rides"]);
  await page.getByRole("button", { name: /^Snowflake/ }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(4);
  expect(
    await page
      .locator(".project-card:visible")
      .evaluateAll((nodes) => nodes.map((n) => n.dataset.projectId)),
  ).toEqual(["air", "cricket", "dbt", "hedge-fund"]);
  await expect(
    page.getByRole("button", { name: /^Snowflake/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: /^Databricks/ }),
  ).toHaveAttribute("aria-pressed", "false");
  await page
    .getByRole("button", { name: "Data engineering", exact: true })
    .click();
  await expect(page.locator(".project-card:visible")).toHaveCount(11);
  await page
    .getByRole("button", { name: "Platform engineering", exact: true })
    .click();
  await expect(page.locator(".project-card:visible")).toHaveCount(5);
  await page
    .getByRole("button", { name: "Analytics & BI", exact: true })
    .click();
  await expect(page.locator(".project-card:visible")).toHaveCount(7);
  await page.getByRole("button", { name: "ML & LLMs", exact: true }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Work in progress", exact: true })
    .click();
  await expect(page.locator(".project-card:visible")).toHaveCount(3);
  expect(
    await page
      .locator(".project-card:visible")
      .evaluateAll((nodes) => nodes.map((n) => n.dataset.projectId)),
  ).toEqual(["commerce", "fema", "hedge-fund"]);
  await expect(
    page.locator(".project-card:visible .project-status"),
  ).toHaveCount(3);
  await page.getByRole("button", { name: "All projects" }).click();
  for (const id of await page
    .locator("[data-project]")
    .evaluateAll((nodes) => nodes.map((n) => n.dataset.project))) {
    const button = page.locator(`[data-project="${id}"]`);
    await button.click();
    await expect(page.locator(".case-study")).toBeVisible();
    if (id === "fema") {
      await expect(page.locator(".case-study")).toContainText(
        "Current pipeline",
      );
      await expect(page.locator(".case-study")).toContainText(
        "Proposed deployment",
      );
      await expect(page.locator(".case-study")).toContainText(
        "Extensions in progress",
      );
      await expect(
        page.getByRole("link", { name: "View repository" }),
      ).toHaveCount(0);
    } else if (id === "hedge-fund") {
      await expect(page.locator(".case-study")).toContainText(
        "250,000 historical price records across 503 tickers",
      );
      await expect(page.locator(".case-study")).toContainText(
        "23 trading days, 20 stocks, two accounts, and 3,200 fictional trades",
      );
      await expect(page.locator(".case-study")).toContainText(
        "historical replay in development",
      );
      await expect(page.locator(".case-study")).toContainText(
        "independent Python calculation",
      );
      await expect(
        page.getByRole("link", { name: "View repository" }),
      ).toHaveCount(0);
    } else {
      await expect(
        page.getByRole("link", { name: "View repository" }),
      ).toHaveAttribute("href", /^https:\/\/github.com\/Uche-anya\//);
    }
    await page.goBack();
    await expect(page.locator(".case-study")).not.toBeVisible();
    await expect(button).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("responsive layout stays within the viewport", async ({ page }) => {
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:5173");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const card of await page.locator(".project-card").all()) {
      const outer = await card.boundingBox();
      const content = await card.locator(".project-content").boundingBox();
      expect(content.y + content.height).toBeLessThanOrEqual(
        outer.y + outer.height + 1,
      );
    }
    if (width === 390 || width === 1440)
      await page.screenshot({
        path: `test-results/portfolio-${width}.png`,
        fullPage: true,
      });
  }
});
