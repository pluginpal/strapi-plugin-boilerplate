import { setupStrapi, stopStrapi } from "@strapi-community/dev-utils";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const PLUGIN_ENDPOINT = "/api/plugin-boilerplate";
const WELCOME_MESSAGE = "Welcome to Strapi";

let accessKey: string;

beforeAll(async () => {
  await setupStrapi();

  const apiToken = await strapi.service("admin::api-token-content-api").create({
    name: "test",
    description: "test",
    type: "full-access",
    lifespan: null,
  });

  accessKey = apiToken.accessKey;
});

afterAll(async () => {
  await stopStrapi();
});

describe("plugin welcome message", () => {
  it("returns the welcome message from the API", async () => {
    const res = await request(strapi.server.httpServer)
      .get(PLUGIN_ENDPOINT)
      .set("Authorization", `Bearer ${accessKey}`);

    expect(res.status).toBe(200);
    expect(res.text).toContain(WELCOME_MESSAGE);
  });

  it("returns the welcome message from the service directly", () => {
    const message = strapi
      .plugin("plugin-boilerplate")
      .service("service")
      .getWelcomeMessage();

    expect(message).toContain(WELCOME_MESSAGE);
  });
});
