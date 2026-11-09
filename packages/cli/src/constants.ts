// TEMPORARY: defaults to `main` while the CLI is on a feature branch and
// unpublished. Before the first npm publish, flip this to a stable git tag
// (e.g. "v1.0.0") and bump it manually per CLI release.
export const DEFAULT_TEMPLATE_REPO = "github:pluginpal/strapi-plugin-boilerplate";
export const DEFAULT_TEMPLATE_REF = "main";

export const TEMPLATE_SOURCE = `${DEFAULT_TEMPLATE_REPO}#${DEFAULT_TEMPLATE_REF}`;
