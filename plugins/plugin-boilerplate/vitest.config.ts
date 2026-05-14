import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    pool: "threads",
    maxWorkers: 1,
    include: ["server/test/**/*.test.ts"],
    hookTimeout: 60000,
  },
});
