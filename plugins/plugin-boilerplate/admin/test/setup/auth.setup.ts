import path from "node:path";
import { registerAuthSetup } from "@pluginpal/dev-utils";

registerAuthSetup(path.join(__dirname, "../.auth/user.json"));
