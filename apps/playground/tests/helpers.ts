const { createStrapi, compileStrapi } = require("@strapi/strapi");
const fs = require("fs");

let instance;

/**
 * Setups strapi for futher testing
 */
async function setupStrapi() {
  if (!instance) {
    const app = await createStrapi({
      appDir: "./playground",
      distDir: "./playground/dist",
    }).load();

    instance = app; // strapi is global now

    await instance.server.mount();
  }
  return instance;
}

/**
 * Closes strapi after testing
 */
async function stopStrapi() {
  if (instance) {
    await instance.server.httpServer.close();
    await instance.db.connection.destroy();
    instance.destroy();
    const tmpDbFile = strapi.config.get(
      "database.connection.connection.filename"
    );

    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }

  }
  return instance;
}

module.exports = {
  setupStrapi,
  stopStrapi,
};
