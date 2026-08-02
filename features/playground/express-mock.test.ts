import { describe, expect, it } from "vitest";

import {
  jsLiteralToJson,
  matchRequest,
  parseExpressRoutes,
} from "@/features/playground/express-mock";

const SAMPLE = `
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from the mock API" });
});

app.get("/users/:id", (req, res) => {
  res.json({ id: req.params.id, name: "Ada Lovelace" });
});

app.post("/users", (req, res) => {
  res.status(201).json({ created: true });
});

app.put("/health", (req, res) => res.send("ok"));
`;

describe("parseExpressRoutes", () => {
  it("extracts routes, params, statuses and bodies", () => {
    const routes = parseExpressRoutes(SAMPLE);

    expect(routes).toHaveLength(4);

    const index = routes[0]!;
    expect(index.method).toBe("GET");
    expect(index.path).toBe("/");
    expect(index.status).toBe(200);
    expect(index.body).toEqual({ message: "Hello from the mock API" });

    const user = routes[1]!;
    expect(user.path).toBe("/users/:id");
    expect(user.params).toEqual(["id"]);
    expect(user.body).toEqual({ id: null, name: "Ada Lovelace" });

    const create = routes[2]!;
    expect(create.method).toBe("POST");
    expect(create.status).toBe(201);
    expect(create.body).toEqual({ created: true });

    const health = routes[3]!;
    expect(health.body).toBe("ok");
  });

  it("returns no routes for non-express code", () => {
    expect(parseExpressRoutes("const x = 1;")).toEqual([]);
  });

  it("ignores app.use declarations", () => {
    const routes = parseExpressRoutes(
      'app.use(express.json()); app.get("/", (req, res) => res.end());',
    );
    expect(routes).toHaveLength(1);
    expect(routes[0]!.path).toBe("/");
  });
});

describe("matchRequest", () => {
  const routes = parseExpressRoutes(SAMPLE);

  it("matches exact routes", () => {
    const res = matchRequest(routes, "GET", "/");
    expect(res.status).toBe(200);
    expect(res.matchedPath).toBe("/");
  });

  it("captures path params", () => {
    const res = matchRequest(routes, "GET", "/users/42?active=true");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: null, name: "Ada Lovelace" });
  });

  it("parses the request body", () => {
    const res = matchRequest(routes, "POST", "/users", '{"name":"Grace"}');
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ created: true });
  });

  it("returns 404 for unmatched routes", () => {
    const res = matchRequest(routes, "DELETE", "/nope");
    expect(res.status).toBe(404);
  });

  it("method mismatch yields 404", () => {
    const res = matchRequest(routes, "DELETE", "/");
    expect(res.status).toBe(404);
  });
});

describe("jsLiteralToJson", () => {
  it("normalises single-quoted and unquoted keys", () => {
    expect(jsLiteralToJson("{ id: 1, name: 'Ada' }")).toEqual({ id: 1, name: "Ada" });
  });

  it("handles trailing commas and arrays", () => {
    expect(jsLiteralToJson("[1, 2, 3,]")).toEqual([1, 2, 3]);
  });

  it("keeps strings with colons intact", () => {
    expect(jsLiteralToJson("{ url: 'https://a.b/c' }")).toEqual({ url: "https://a.b/c" });
  });

  it("returns null for unresolvable input", () => {
    expect(jsLiteralToJson("{ fn: () => 1 }")).toBeNull();
    expect(jsLiteralToJson("")).toBeNull();
  });
});
