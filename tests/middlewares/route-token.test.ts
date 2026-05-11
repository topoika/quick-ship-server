import test from "node:test";
import assert from "node:assert/strict";

import RouteTokenMiddleware from "../../src/mobile/middlewares/route-middleware";
import { createMockResponse } from "../helpers/mock-response";

function restoreRouteToken(previousToken: string | undefined) {
  if (previousToken === undefined) {
    delete process.env.ROUTE_TOKEN;
    return;
  }

  process.env.ROUTE_TOKEN = previousToken;
}

test("RouteTokenMiddleware accepts the configured route token", () => {
  const previousToken = process.env.ROUTE_TOKEN;
  process.env.ROUTE_TOKEN = "route-token";

  const response = createMockResponse();
  let nextCalled = false;

  try {
    RouteTokenMiddleware(
      { headers: { "x-route-token": "route-token" } } as never,
      response as never,
      () => {
        nextCalled = true;
      },
    );
  } finally {
    restoreRouteToken(previousToken);
  }

  assert.equal(nextCalled, true);
  assert.equal(response.statusCode, 200);
  assert.equal(response.body, undefined);
});

test("RouteTokenMiddleware rejects a missing route token", () => {
  const previousToken = process.env.ROUTE_TOKEN;
  process.env.ROUTE_TOKEN = "route-token";

  const response = createMockResponse();
  let nextCalled = false;

  try {
    RouteTokenMiddleware({ headers: {} } as never, response as never, () => {
      nextCalled = true;
    });
  } finally {
    restoreRouteToken(previousToken);
  }

  assert.equal(nextCalled, false);
  assert.equal(response.statusCode, 422);
  assert.deepEqual(response.body, {
    status: 422,
    message: "Missing/Invalid route token headers",
  });
});
