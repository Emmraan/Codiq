import type { PlaygroundPreset } from "@/types/playground";

const vanillaHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playground</title>
  </head>
  <body>
    <main class="card">
      <h1>Hello from the CODIQ playground</h1>
      <p id="intro">Start editing the files on the left.</p>
    </main>
  </body>
</html>`;

const cssSeed = `/* Edit this file to restyle the page. */
body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  display: grid;
  place-items: center;
  min-height: 100vh;
  margin: 0;
}

.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 2rem;
  max-width: 420px;
  text-align: center;
}

#intro {
  color: #38bdf8;
}`;

const jsSeed = `// Write JavaScript, then watch the console and preview.
const greeting = "Hello from CODIQ!";
console.log(greeting);

document.querySelector("#intro").textContent = greeting;

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
console.log("doubled:", doubled);`;

const tsSeed = `// TypeScript runs through the bundler. The Output tab shows the
// transpiled JavaScript.
interface Person {
  name: string;
  age: number;
}

const people: Person[] = [
  { name: "Ada", age: 36 },
  { name: "Grace", age: 45 },
];

const summary = people
  .map((person) => person.name + " (" + person.age + ")")
  .join(" and ");

console.log("Engineers:", summary);
document.querySelector("#intro").textContent = summary;`;

const reactSeed = `export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="card">
      <h1>React playground</h1>
      <p id="intro">Click the button — state is live.</p>
      <button onClick={() => setCount((c) => c + 1)}>
        Count: {count}
      </button>
    </div>
  );
}`;

const reactStyles = `body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  display: grid;
  place-items: center;
  min-height: 100vh;
  margin: 0;
}

.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 2rem;
  max-width: 420px;
  text-align: center;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: #38bdf8;
  color: #082f49;
  font-weight: 600;
  cursor: pointer;
}`;

const nodeSeed = `// This runs in a browser-based Node runtime. console.log output
// appears in the Console panel.
import http from "http";

const server = http.createServer((req, res) => {
  console.log("request received:", req.url);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, url: req.url }));
});

server.listen(4000, () => {
  console.log("mock server listening on http://localhost:4000");
});`;

const expressSeed = `// A mock Express API. Define routes below; the request panel on the
// right lets you hit them and inspect the simulated response.
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from the mock API" });
});

app.get("/users/:id", (req, res) => {
  res.json({ id: req.params.id, name: "Ada Lovelace" });
});

app.post("/users", (req, res) => {
  res.status(201).json({ created: true, body: req.body });
});

app.listen(3000, () => console.log("API listening on :3000"));`;

export const playgroundPresets: Record<string, PlaygroundPreset> = {
  css: {
    mode: "sandpack",
    template: "vanilla",
    mainFile: "/styles.css",
    showsPreview: true,
    showsConsole: false,
    showsTranspiled: false,
    files: [
      { path: "/index.html", language: "html", code: vanillaHtml },
      { path: "/styles.css", language: "css", code: cssSeed },
      { path: "/index.js", language: "javascript", code: "" },
    ],
    description: "Edit HTML and CSS and see the result render instantly.",
  },
  tailwind: {
    mode: "sandpack",
    template: "vanilla",
    mainFile: "/index.html",
    showsPreview: true,
    showsConsole: false,
    showsTranspiled: false,
    externalResources: ["https://cdn.tailwindcss.com"],
    files: [
      {
        path: "/index.html",
        language: "html",
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tailwind playground</title>
  </head>
  <body class="bg-slate-900 min-h-screen grid place-items-center text-slate-100">
    <main class="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md text-center shadow-lg">
      <h1 class="text-2xl font-bold text-sky-400">Tailwind playground</h1>
      <p id="intro" class="mt-2 text-slate-300">Edit this file to play with utility classes.</p>
      <button class="mt-4 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-sky-950 font-semibold transition-colors">
        Hover me
      </button>
    </main>
  </body>
</html>`,
      },
      { path: "/index.js", language: "javascript", code: "" },
    ],
    description: "Play with Tailwind utility classes in a live sandbox.",
  },
  javascript: {
    mode: "sandpack",
    template: "vanilla",
    mainFile: "/index.js",
    showsPreview: true,
    showsConsole: true,
    showsTranspiled: false,
    files: [
      { path: "/index.html", language: "html", code: vanillaHtml },
      { path: "/styles.css", language: "css", code: cssSeed },
      { path: "/index.js", language: "javascript", code: jsSeed },
    ],
    description: "Run JavaScript with a live preview and console output.",
  },
  typescript: {
    mode: "sandpack",
    template: "vanilla-ts",
    mainFile: "/index.ts",
    showsPreview: true,
    showsConsole: true,
    showsTranspiled: true,
    files: [
      { path: "/index.html", language: "html", code: vanillaHtml },
      { path: "/styles.css", language: "css", code: cssSeed },
      { path: "/index.ts", language: "typescript", code: tsSeed },
    ],
    description: "Write TypeScript; the Output tab shows the transpiled JavaScript.",
  },
  react: {
    mode: "sandpack",
    template: "react-ts",
    mainFile: "/App.tsx",
    showsPreview: true,
    showsConsole: false,
    showsTranspiled: false,
    files: [
      { path: "/App.tsx", language: "typescript", code: reactSeed },
      { path: "/index.tsx", language: "typescript", code: 'export { default } from "./App";' },
      { path: "/styles.css", language: "css", code: reactStyles },
    ],
    description: "Build React components with instant live preview.",
  },
  next: {
    mode: "sandpack",
    template: "react-ts",
    mainFile: "/App.tsx",
    showsPreview: true,
    showsConsole: false,
    showsTranspiled: false,
    files: [
      { path: "/App.tsx", language: "typescript", code: reactSeed },
      { path: "/index.tsx", language: "typescript", code: 'export { default } from "./App";' },
      { path: "/styles.css", language: "css", code: reactStyles },
    ],
    description:
      "Next.js runs server-side, so this playground uses a React sandbox to prototype page components.",
  },
  node: {
    mode: "sandpack",
    template: "node",
    mainFile: "/index.js",
    showsPreview: false,
    showsConsole: true,
    showsTranspiled: false,
    files: [{ path: "/index.js", language: "javascript", code: nodeSeed }],
    description: "Run Node.js code in a browser-based Node runtime; stdout lands in the console.",
  },
  express: {
    mode: "express-mock",
    template: "node",
    mainFile: "/server.js",
    showsPreview: false,
    showsConsole: true,
    showsTranspiled: false,
    files: [{ path: "/server.js", language: "javascript", code: expressSeed }],
    description:
      "Prototype an Express API. Define routes in the editor, then send mock requests from the panel.",
  },
};
