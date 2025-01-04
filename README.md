<div style="text-align: center">
  <h1>Strapi Plugin Boilerplate</h1>
  <h5>A test-driven template for building reliable Strapi Plugins</h5>

  <a href="https://codecov.io/gh/pluginpal/strapi-plugin-boilerplate">
    <img src="https://img.shields.io/github/actions/workflow/status/pluginpal/strapi-plugin-boilerplate/tests.yml?branch=main" alt="CI build status" />
  </a>
</div>

## ✨ Features

- [x] Setup using [@strapi/sdk-plugin](https://github.com/strapi/sdk-plugin) with commands for `build` and `watch`.
- [x] An isolated Strapi instance for testing and development, the Playground.
- [x] Github Actions workflow for linting and testing.
- [x] Clear community files like [CONTRIBUTING.md](https://github.com/pluginpal/strapi-plugin-boilerplate/blob/main/CONTRIBUTING.md) and [CODE-OF-CONDUCT.md](https://github.com/pluginpal/strapi-plugin-boilerplate/blob/main/CODE_OF_CONDUCT.md).
- [ ] Jest & Supertest for testing your plugin API's.
- [ ] Cypress for GUI e2e tests

## ⏳ How to use

This repository is meant to be a template for new plugins. It can be used as a starting point, giving you the resources to built a test-driven Strapi plugin.

After creating your copy of the template, do a find-replace through the code and change the following:

1. Change `boilerplate` (lowercase) to be the identifier of your plugin.
2. Change `Boilerplate` (uppercase) to be the human readable name of your plugin.

You're all set! Go make your plugin and write some tests!

## 📓 Tutorials

This repository has been made alongside an article series called **"Automated Testing for Strapi Plugins"**.
To better understand how and why this repository has been setup, please read the following articles:

1. [Using a Playground Instance](https://www.pluginpal.io/automated-testing-for-strapi-plugins-using-a-playground-instance)
2. Integration tests (In Progress)
3. E2E tests (In Progress)

## 🔌 Commands

### Strapi Plugin SDK commands

1. `yarn build`
  - The native build command of `@strapi/sdk-plugin`.
  - [Documentation can be found here](https://docs.strapi.io/dev-docs/plugins/development/plugin-sdk).
2. `yarn watch`
  - The native watch command of `@strapi/sdk-plugin`.
  - [Documentation can be found here](https://docs.strapi.io/dev-docs/plugins/development/plugin-sdk).
3. `yarn watch:link`
  - The native watch:link command of `@strapi/sdk-plugin`.
  - [Documentation can be found here](https://docs.strapi.io/dev-docs/plugins/development/plugin-sdk).
4. `yarn verify`
  - The native verify command of `@strapi/sdk-plugin`.
  - [Documentation can be found here](https://docs.strapi.io/dev-docs/plugins/development/plugin-sdk).
  - Used in the linting step of the pipeline.

### Testing commands

5. `yarn test:ts:front`
  - A check for Typescript errors on the front-end side.
  - Used in the linting step of the pipeline.
6. `yarn test:ts:back`
  - A check for Typescript errors on the back-end side.
  - Used in the linting step of the pipeline.

### Playground commands

7. `yarn playground:install`
  - Installs the plugin into the playground using `yalc-add-link`.
  - Installs all other dependencies of the playground.
8. `yarn playground:yalc-add`
  - Installs a production-like version of the plugin, into the playground.
9. `yarn playground:yalc-add-link`
  - Installs a development build of the plugin, into the playground.
10. `yarn playground:build`
  - The native Strapi build command, ran in the playground.
  - [Documentation can be found here](https://docs.strapi.io/dev-docs/cli).
11. `yarn playground:develop`
  - The native Strapi develop command, ran in the playground.
  - [Documentation can be found here](https://docs.strapi.io/dev-docs/cli).
12. `yarn playground:start`
  - The native Strapi start command, ran in the playground.
  - [Documentation can be found here](https://docs.strapi.io/dev-docs/cli).
