import test from "node:test";
import assert from "node:assert/strict";

import catchAsync from "../../src/mobile/utils/catchAsync";
import { createMockResponse } from "../helpers/mock-response";

test("catchAsync returns a 500 response when the handler fails", async () => {
  const response = createMockResponse();
  const originalLog = console.log;
  console.log = () => undefined;

  try {
    const wrappedHandler = catchAsync(async () => {
      throw new Error("boom");
    });

    wrappedHandler({} as never, response as never, () => undefined);

    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(response.statusCode, 500);
    assert.deepEqual(response.body, {
      status: 500,
      message: "An error occurred",
      error: "boom",
    });
  } finally {
    console.log = originalLog;
  }
});
