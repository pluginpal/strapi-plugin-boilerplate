const request = require('supertest');
const { setupStrapi, stopStrapi } = require('../../playground/tests/helpers');

let strapi;

beforeAll(async () => {
  strapi = await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

it('should return a successful response from the example endpoint', async () => {
  const response = await request(strapi.server.httpServer)
    .get('/api/boilerplate')
    .expect(200);

  expect(response.text).toBe('Welcome to Strapi 🚀');
});

it('should return the correct message from the example service', async () => {
  const welcomeMessage = strapi.service('plugin::boilerplate.service').getWelcomeMessage();

  expect(welcomeMessage).toBe('Welcome to Strapi 🚀');
});
