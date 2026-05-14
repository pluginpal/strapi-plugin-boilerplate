import { expect, test } from "@playwright/test";

const PLUGIN_URL = "/admin/plugins/plugin-boilerplate";

test.describe("Plugin home page", () => {
  test("renders the welcome heading", async ({ page }) => {
    await page.goto(PLUGIN_URL);

    await expect(
      page.getByRole("heading", { name: /welcome to/i }),
    ).toBeVisible();
  });

  test("renders the plugin name in the heading", async ({ page }) => {
    await page.goto(PLUGIN_URL);

    await expect(
      page.getByRole("heading", { name: /plugin-boilerplate/i }),
    ).toBeVisible();
  });
});
