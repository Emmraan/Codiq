import { describe, expect, it } from "vitest";

import { createExpressValidator } from "./express";

const SERVER = `
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

app.get("/users/:id", (req, res) => {
  res.status(200).json({ id: req.params.id });
});

app.post("/users", (req, res) => {
  res.status(201).json({ created: true });
});
`;

describe("express validator", () => {
  it("validates routes, statuses and bodies without executing code", async () => {
    const validator = createExpressValidator({
      requests: [
        {
          id: "home",
          method: "GET",
          path: "/",
          expect: { status: 200, body: { message: "hello" } },
        },
        {
          id: "create",
          method: "POST",
          path: "/users",
          expect: { status: 201, body: { created: true } },
        },
      ],
    });
    const result = await validator.run({ code: { "server.js": SERVER }, config: {} });
    expect(result.passed).toBe(true);
  });

  it("matches route params", async () => {
    const validator = createExpressValidator({
      requests: [{ id: "user", method: "GET", path: "/users/7", expect: { status: 200 } }],
    });
    const result = await validator.run({ code: { "server.js": SERVER }, config: {} });
    expect(result.passed).toBe(true);
  });

  it("flags missing routes as 404 with a directive hint", async () => {
    const validator = createExpressValidator({
      requests: [{ id: "delete", method: "DELETE", path: "/users/1" }],
    });
    const result = await validator.run({ code: { "server.js": SERVER }, config: {} });
    expect(result.passed).toBe(false);
    expect(result.checks[0]?.message).toContain("404");
    expect(result.checks[0]?.hint).toContain("DELETE /users/1");
  });

  it("reports a mismatched status and body", async () => {
    const validator = createExpressValidator({
      requests: [
        {
          id: "home",
          method: "GET",
          path: "/",
          expect: { status: 201, body: { message: "nope" } },
        },
      ],
    });
    const result = await validator.run({ code: { "server.js": SERVER }, config: {} });
    expect(result.passed).toBe(false);
    expect(result.checks[0]?.message).toContain("expected status 201");
    expect(result.checks[0]?.message).toContain("nope");
  });
});
