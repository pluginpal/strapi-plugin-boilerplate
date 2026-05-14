import path from "node:path";
import { registerAuthSetup } from "@strapi-community/dev-utils";

registerAuthSetup(path.join(__dirname, "../.auth/user.json"));
