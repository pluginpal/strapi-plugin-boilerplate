import { spawnSync } from "node:child_process";
import path from "node:path";

// packages/dev-utils/src → packages/dev-utils (where docker-compose.yml lives)
const COMPOSE_DIR = path.resolve(__dirname, "..");

function spawnOrThrow(
	cmd: string,
	args: string[],
	env?: NodeJS.ProcessEnv,
): void {
	const result = spawnSync(cmd, args, {
		stdio: "pipe",
		env: env ?? process.env,
	});
	if (result.status !== 0 || result.error) {
		const stderr = result.stderr?.toString().trim() ?? "";
		const stdout = result.stdout?.toString().trim() ?? "";
		const spawnErr = result.error ? ` (${result.error.message})` : "";
		const output = [stderr, stdout].filter(Boolean).join("\n");
		throw new Error(`[db] Command failed: ${cmd} ${args.join(" ")}${spawnErr}${output ? `\n${output}` : ""}`);
	}
}

function createRemoteDb(name: string): void {
	const client = process.env.DATABASE_CLIENT!;
	const user = process.env.DATABASE_USERNAME ?? "strapi";

	if (client === "postgres") {
		spawnOrThrow("docker", [
			"compose", "--project-directory", COMPOSE_DIR,
			"exec", "-T", "postgres",
			"psql", "-U", user, "postgres", "-c", `CREATE DATABASE "${name}"`,
		]);
	} else if (client === "mysql") {
		spawnOrThrow("docker", [
			"compose", "--project-directory", COMPOSE_DIR,
			"exec", "-T", "mysql",
			"mysql", "-u", "root", "-proot",
			"-e", `CREATE DATABASE \`${name}\`; GRANT ALL ON \`${name}\`.* TO '${user}'@'%';`,
		]);
	}
}

/**
 * Sets up the database for a test process and returns the env vars that
 * configure the database connection (for use in process.env or webServer.env).
 *
 * - sqlite: sets DATABASE_FILENAME to a per-instance file and removes any stale file.
 *   Cleanup of the .db file is handled by with-db on exit.
 * - postgres/mysql: creates an ephemeral database (strapi_<instanceId>) when
 *   DATABASE_NAME is not already set, then sets DATABASE_NAME.
 */
export function setupDb(
	instanceId: string,
): Record<string, string> {
	const client = process.env.DATABASE_CLIENT ?? "sqlite";

	if (client === "sqlite") {
		const filename = `.tmp/strapi_${instanceId}.db`;
		process.env.DATABASE_FILENAME = filename;
		return { DATABASE_CLIENT: "sqlite", DATABASE_FILENAME: filename };
	}

	if (!process.env.DATABASE_NAME) {
		const dbName = `strapi_${instanceId}`;
		console.log(`[dev-utils] Creating ephemeral database ${dbName}...`);
		createRemoteDb(dbName);
		process.env.DATABASE_NAME = dbName;
	}

	return {
		DATABASE_CLIENT: client,
		DATABASE_HOST: process.env.DATABASE_HOST ?? "127.0.0.1",
		DATABASE_PORT:
			process.env.DATABASE_PORT ?? (client === "postgres" ? "5432" : "3306"),
		DATABASE_NAME: process.env.DATABASE_NAME!,
		DATABASE_USERNAME: process.env.DATABASE_USERNAME ?? "strapi",
		DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? "strapi",
	};
}

