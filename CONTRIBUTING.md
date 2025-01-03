# Contributing

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project.

## Development Workflow

This plugin provides a local development instance of Strapi to develop it's features. We call this instance `playground` and it can be found in the playground folder in the root of the project. For that reason it is not needed to have your own Strapi instance running to work on this plugin. Just clone the repo and you're ready to go!

#### 1. Fork the [repository](https://github.com/pluginpal/strapi-plugin-boilerplate)

[Go to the repository](https://github.com/pluginpal/strapi-plugin-boilerplate) and fork it to your own GitHub account.

#### 2. Clone the forked repository

```bash
git clone git@github.com:YOUR_USERNAME/strapi-plugin-boilerplate.git
```

#### 3. Install the dependencies

Go to the folder and install the dependencies

```bash
cd strapi-plugin-boilerplate && yarn install
```

#### 4. Install the playground dependencies

Run this in the root of the repository

```bash
yarn playground:install
```

#### 5. Run the compiler of the plugin 

We use `yalc` to publish the package to a local registry. Run the following command o watch for changes and push to `yalc` every time a change is made:

```bash
yarn watch:link
```

#### 6. Start the playground instance

Leave the watcher running, open up a new terminal window and browse back to the root of the plugin repo. Run the following command:

```bash
yarn playground:develop
```

This will start the playground instance that will have the plugin installed from the `yalc` registry. Browse to http://localhost:1337 and create a test admin user to log in to the playground.

#### 7. Start your contribution!

You can now start working on your contribution. If you had trouble setting up this testing environment please feel free to report an issue on Github.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn verify`: Checks that your folder structure aligns with the @strapi/sdk-plugin standard.
- `yarn test:ts:front`: Checks that typescript has found no errors on the front-end.
- `yarn test:ts:back`: Checks that typescript has found no errors on the back-end.

### Sending a pull request

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
