import type { Context } from "koa";

const controller = () => ({
  index(ctx: Context) {
    ctx.body = strapi
      .plugin("plugin-boilerplate")
      // the name of the service file & the method.
      .service("service")
      .getWelcomeMessage();
  },
});

export default controller;
