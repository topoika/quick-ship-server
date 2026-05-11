import test from "node:test";
import assert from "node:assert/strict";

import { authChecker } from "../../src/middlewares/auth-checker.middleware";

const runAuthChecker = authChecker as (params: {
  context: { req: unknown; res: unknown; user?: unknown };
}) => Promise<boolean>;

test("authChecker only allows requests with a user in context", async () => {
  assert.equal(
    await runAuthChecker({
      context: { req: {} as never, res: {} as never, user: {} },
    }),
    true,
  );

  assert.equal(
    await runAuthChecker({
      context: { req: {} as never, res: {} as never },
    }),
    false,
  );
});
