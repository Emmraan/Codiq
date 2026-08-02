/**
 * Deterministic Express "mock" engine for the playground.
 *
 * Parses `app.<verb>(path, handler)` route declarations out of the user's
 * `server.js` and simulates requests against them — no evaluation of user
 * code on the main thread. Response status/body are approximated from
 * `res.status(N)` / `res.json|send(...)` literals; anything the parser
 * can't understand degrades to a generated echo body.
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface MockRoute {
  method: HttpMethod;
  path: string;
  params: string[];
  status: number;
  /** Parsed body from `res.json(...)` / `res.send(...)`, if any. */
  body: unknown;
}

export interface MockRequest {
  method: HttpMethod;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
}

export interface MockResponse {
  status: number;
  body: unknown;
  matchedPath?: string;
}

const VERB_PATTERN = /app\.(get|post|put|patch|delete)\s*\(/gi;
const STATUS_PATTERN = /res\.status\(\s*(\d{3})\s*\)/;
// Matches chained calls too: `res.status(201).json(...)` has `.json(` but not `res.json(`.
const SEND_PATTERN = /\.(json|jsonp|send)\s*\(/;

/** Extract the text of a balanced parenthesised group starting at `start` (the `(`). */
function findBalanced(source: string, start: number): { end: number; text: string } | null {
  let depth = 0;
  let inString: string | null = null;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (ch === "\\") {
        i += 1;
        continue;
      }
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }
    if (ch === "(") depth += 1;
    else if (ch === ")") {
      depth -= 1;
      if (depth === 0) return { end: i, text: source.slice(start + 1, i) };
    }
  }
  return null;
}

/** Convert a JS object/array literal fragment into parseable JSON (string-aware). */
export function jsLiteralToJson(raw: string): unknown | null {
  const src = raw.trim();
  if (!src) return null;

  let out = "";
  let i = 0;
  const n = src.length;

  while (i < n) {
    const ch = src.charAt(i);

    if (ch === "'" || ch === '"' || ch === "`") {
      const quote = ch;
      out += '"';
      i += 1;
      while (i < n) {
        const c = src[i];
        if (c === "\\") {
          out += c;
          if (i + 1 < n) {
            out += src[i + 1] === quote ? `\\${quote}` : src[i + 1];
            i += 1;
          }
        } else if (c === quote) {
          i += 1;
          break;
        } else {
          out += c;
        }
        i += 1;
      }
      out += '"';
      continue;
    }

    if (ch === ",") {
      let j = i + 1;
      while (j < n && /\s/.test(src.charAt(j))) j += 1;
      if (src.charAt(j) !== "}" && src.charAt(j) !== "]") out += ",";
      i += 1;
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_$]/.test(src.charAt(j))) j += 1;
      const word = src.slice(i, j);
      let k = j;
      while (k < n && /\s/.test(src.charAt(k))) k += 1;
      if (src.charAt(k) === ":") {
        out += JSON.stringify(word) + ":";
        i = k + 1;
      } else if (word === "true" || word === "false" || word === "null") {
        out += word;
        i = j;
      } else {
        // Bare identifier value (e.g. `req.params.id`) — not statically resolvable.
        while (j < n && /[A-Za-z0-9_$.]/.test(src.charAt(j))) j += 1;
        out += "null";
        i = j;
      }
      continue;
    }

    out += ch;
    i += 1;
  }

  try {
    return JSON.parse(out);
  } catch {
    return null;
  }
}

function extractSendBody(handler: string): unknown {
  const send = SEND_PATTERN.exec(handler);
  if (!send) return undefined;
  const open = handler.indexOf("(", send.index);
  if (open < 0) return undefined;
  const group = findBalanced(handler, open);
  if (!group) return undefined;
  const arg = group.text.trim();
  if (!arg) return undefined;

  // Plain quoted string: res.send("hello")
  if (arg.startsWith('"') || arg.startsWith("'")) {
    const quote = arg.charAt(0);
    const end = arg.indexOf(quote, 1);
    if (end > 0) return arg.slice(1, end);
  }
  // res.send({ ... }) — parse the object/array literal
  const start = arg.search(/[[{]/);
  if (start >= 0) {
    const value = jsLiteralToJson(arg.slice(start));
    if (value !== null) return value;
  }
  return arg;
}

/** Parse route declarations out of an Express source file. */
export function parseExpressRoutes(source: string): MockRoute[] {
  const routes: MockRoute[] = [];
  let match: RegExpExecArray | null;

  VERB_PATTERN.lastIndex = 0;
  while ((match = VERB_PATTERN.exec(source)) !== null) {
    const verb = match[1] as HttpMethod;
    const open = source.indexOf("(", match.index + match[0].length - 1);
    if (open < 0) continue;
    const group = findBalanced(source, open);
    if (!group) continue;

    // First argument is the route path string.
    const firstArg = group.text.trim().match(/^(['"`])(.*?)\1/);
    if (!firstArg) continue;
    const routePath = firstArg[2] ?? "";

    // The handler is the last argument — everything after the path arg.
    const firstArgMatch = firstArg[0] ?? "";
    const handlerStart = group.text.indexOf(firstArgMatch, firstArgMatch.length) + 1;
    const handlerText = group.text.slice(handlerStart);

    const statusMatch = STATUS_PATTERN.exec(handlerText);
    const status = statusMatch ? Number(statusMatch[1] ?? 200) : 200;
    const body = extractSendBody(handlerText);

    const params = [...routePath.matchAll(/:([A-Za-z0-9_]+)/g)]
      .map((m) => m[1] ?? "")
      .filter((name) => name.length > 0);

    routes.push({
      method: verb.toUpperCase() as HttpMethod,
      path: routePath,
      params,
      status,
      body,
    });
  }

  return routes;
}

function parseQuery(queryString: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of queryString.split("&")) {
    if (!pair) continue;
    const [rawKey = "", rawValue = ""] = pair.split("=");
    try {
      out[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue);
    } catch {
      out[rawKey] = rawValue;
    }
  }
  return out;
}

/** Simulate a request against the parsed routes. */
export function matchRequest(
  routes: MockRoute[],
  method: HttpMethod,
  rawPath: string,
  rawBody?: string,
): MockResponse {
  const [pathOnly = "", queryString = ""] = rawPath.split("?");
  const query = parseQuery(queryString);
  const segments = pathOnly.split("/").filter(Boolean);

  let parsedBody: unknown;
  if (rawBody && rawBody.trim()) {
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      parsedBody = rawBody;
    }
  }

  for (const route of routes) {
    if (route.method !== method) continue;
    const routeSegments = route.path.split("/").filter(Boolean);
    if (routeSegments.length !== segments.length) continue;

    const params: Record<string, string> = {};
    let ok = true;
    for (let i = 0; i < routeSegments.length; i++) {
      const segment = routeSegments[i] ?? "";
      if (segment.startsWith(":")) {
        params[segment.slice(1)] = segments[i] ?? "";
      } else if (segment !== (segments[i] ?? "")) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    const body =
      route.body !== undefined
        ? route.body
        : {
            message: `Mock response for ${method} ${route.path}`,
            ...(Object.keys(params).length ? { params } : {}),
            ...(Object.keys(query).length ? { query } : {}),
            ...(parsedBody !== undefined ? { received: parsedBody } : {}),
          };

    return { status: route.status, body, matchedPath: route.path };
  }

  return {
    status: 404,
    body: { error: "No route matches", method, path: pathOnly },
  };
}
