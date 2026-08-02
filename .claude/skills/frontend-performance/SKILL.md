---
name: frontend-performance
description: A unified, end-to-end frontend performance engineering skill that guides the AI agent through performance auditing, diagnosis, Core Web Vitals optimization, bundle analysis, rendering efficiency, network optimization, asset delivery, runtime profiling, memory management, performance budgeting, monitoring instrumentation, and the production of measurable, prioritized performance improvement plans grounded in real-world metrics and modern browser capabilities.
---

# Skills

This skill serves as the AI agent's comprehensive framework for diagnosing, analyzing, and resolving any frontend performance challenge — from initial audit through root cause analysis, optimization implementation, and continuous monitoring. The agent should approach performance work empirically: measure first, hypothesize, implement targeted fixes, and verify with data. Every recommendation must be tied to a measurable metric and prioritized by user impact. The agent must resist premature optimization and instead focus effort where measured data indicates the highest return.

## When to use

Activate this skill when any of the following conditions are detected:

- A user reports a slow website, application, or specific page/interaction and wants help diagnosing or fixing it.
- A user asks about Core Web Vitals (LCP, INP, CLS, TTFB, FCP, TBT) — measurement, interpretation, or optimization.
- A user asks about bundle size reduction, code splitting, tree shaking, or lazy loading strategies.
- A user reports rendering performance issues (jank, dropped frames, slow scrolling, unresponsive interactions, excessive re-renders).
- A user asks about image optimization, font loading, asset delivery, or CDN caching strategies.
- A user asks about JavaScript execution performance, long tasks, main thread blocking, or web worker offloading.
- A user asks about memory leaks, memory bloat, garbage collection pressure, or detached DOM node issues.
- A user asks about performance budgets, performance CI gates, or performance regression detection.
- A user asks about Real User Monitoring (RUM), synthetic monitoring, or performance observability.
- A user asks about server-side rendering performance, hydration cost, streaming SSR, or partial hydration.
- A user asks about caching strategies (HTTP caching, service workers, application-level caching, CDN configuration).
- A user asks about third-party script performance impact (analytics, ads, chat widgets, tag managers).
- A user asks about network performance (request waterfall, connection management, prefetching, preloading, resource hints).
- A user asks about animation performance, CSS vs. JS animations, compositor layers, or paint optimization.
- A user asks about perceived performance, loading UX patterns (skeleton screens, progressive loading, optimistic UI).
- A user asks how to set up performance testing, benchmarking, or load testing for frontend applications.
- A conversation involves terms such as "Lighthouse," "PageSpeed," "WebPageTest," "performance budget," "bundle size," "chunk," "lazy load," "code split," "tree shake," "re-render," "virtualization," "throttle," "debounce," "requestIdleCallback," "requestAnimationFrame," "layout shift," "paint," "composite," "critical rendering path," "resource hint," "preload," "prefetch," "preconnect," "service worker," "cache," "CDN," "compression," "minification," "source map," "profiler," "flame chart," "heap snapshot," "memory leak," "jank," "frame rate," "long task," or similar performance language.

Do NOT activate this skill for backend performance or database optimization questions with no frontend dimension, general frontend architecture decisions without a performance focus (use frontend-core instead), pure UX/design discussions without performance implications, or SEO questions that do not involve performance metrics.

## Instructions

### Phase 1 — Performance Context and Baseline Assessment

1. **Classify the performance engagement type.** Before any analysis, determine what the user needs and state it explicitly:
   - **Reactive diagnosis:** The user has a specific, observed performance problem ("my page loads slowly," "scrolling is janky," "the app freezes when I click submit"). Proceed with targeted root cause analysis.
   - **Proactive audit:** The user wants a general performance assessment of an application or page without a specific complaint. Proceed with a comprehensive audit.
   - **Optimization planning:** The user wants to implement a performance improvement strategy for an application under development or recently launched. Proceed with architectural performance planning.
   - **Performance infrastructure:** The user wants to set up performance monitoring, budgets, or CI integration. Proceed with instrumentation and process design.
   - **Focused technique question:** The user asks about a specific optimization technique (e.g., "how do I implement code splitting?"). Provide targeted guidance with context.

   The classification determines the depth and sequence of subsequent steps.

2. **Gather the performance context.** Extract or establish the following. Ask clarifying questions for critical gaps:
   - **Application type:** Marketing/content site, SaaS dashboard, e-commerce storefront, media-heavy platform, real-time collaborative app, data visualization tool, internal enterprise tool? This determines which metrics matter most.
   - **Tech stack:** Framework (React, Vue, Svelte, Angular, vanilla), meta-framework (Next.js, Nuxt, SvelteKit, Remix, Astro), rendering strategy (CSR, SSR, SSG, ISR, hybrid), state management, styling approach, build tool.
   - **Current performance data (if available):** Lighthouse scores, Core Web Vitals field data (CrUX, RUM), bundle size, specific timing measurements. If unavailable, instruct the user on how to obtain baseline data (Step 3).
   - **Target audience and devices:** Geographic distribution (affects CDN and edge strategy), device distribution (desktop vs. mobile percentage, low-end device prevalence), network conditions (3G, 4G, broadband).
   - **Hosting and delivery infrastructure:** Hosting platform (Vercel, Netlify, AWS, GCP, self-hosted), CDN provider, edge computing capabilities.
   - **Traffic patterns:** Average and peak concurrent users, request volume, traffic spikes (events, launches, promotions).
   - **Performance targets:** Existing SLOs or business-driven targets. If none exist, propose targets based on industry benchmarks in Step 4.
   - **Known constraints:** Budget limitations, team size, legacy code that cannot be modified, third-party dependencies that cannot be removed.

3. **Establish performance baselines with proper measurement methodology.** Performance optimization without baselines is guesswork. Guide the user through obtaining reliable measurements:

   **Lab data (controlled, reproducible, diagnostic):**
   - **Lighthouse:** Run via Chrome DevTools, CLI (`npx lighthouse <url>`), or PageSpeed Insights. Record: Performance score, LCP, TBT (lab proxy for INP), CLS, FCP, Speed Index, TTFB. Use consistent settings: mobile emulation, simulated throttling (Slow 4G, 4x CPU slowdown) for worst-case analysis.
   - **Chrome DevTools Performance Panel:** Record a trace of the specific problematic interaction. Capture: main thread flame chart, long tasks, layout/paint/composite events, scripting vs. rendering vs. painting breakdown.
   - **Chrome DevTools Network Panel:** Capture the full waterfall for initial page load. Record: total requests, total transfer size, total resource size, critical path request chain, time to last critical resource.
   - **WebPageTest:** For advanced waterfall analysis, filmstrip comparison, and multi-location testing. Use the `?lighthouse=1` parameter for combined results. Record: Start Render, Visually Complete, fully loaded time, request waterfall, connection view.
   - **Bundle analysis:** Run the framework/bundler's bundle analyzer (`npx vite-bundle-visualizer`, `@next/bundle-analyzer`, `webpack-bundle-analyzer`, `source-map-explorer`). Record: total JS size (parsed and gzipped), per-chunk sizes, largest dependencies, duplicate modules.

   **Field data (real users, actual conditions, truth):**
   - **Chrome UX Report (CrUX):** Via PageSpeed Insights or BigQuery. Provides real-user Core Web Vitals at origin and URL level. Record: LCP p75, INP p75, CLS p75, TTFB p75, and the pass/fail assessment at each threshold.
   - **Real User Monitoring (RUM):** If instrumented (web-vitals library, Datadog RUM, SpeedCurve, Vercel Analytics), pull the p50, p75, p95 for all Core Web Vitals and custom metrics. Segment by device type, connection speed, geography, and page type.
   - **Business metrics correlation:** If available, correlate performance metrics with business outcomes (conversion rate, bounce rate, session duration, revenue per session). This justifies optimization investment.

   **Baseline documentation format:**

   ```
   Page/Interaction: [name]
   Date measured: [date]

   Lab (Lighthouse mobile, simulated throttling):
   - Performance Score: [X]/100
   - LCP: [X]s (target: <2.5s)
   - TBT: [X]ms (target: <200ms)
   - CLS: [X] (target: <0.1)
   - FCP: [X]s
   - TTFB: [X]s
   - Speed Index: [X]s
   - Total JS: [X]KB (gzipped) / [X]KB (parsed)
   - Total Requests: [X]

   Field (CrUX / RUM, p75):
   - LCP: [X]s
   - INP: [X]ms
   - CLS: [X]

   Bundle:
   - Total JS (gzipped): [X]KB
   - Largest chunk: [name] [X]KB
   - Largest dependency: [name] [X]KB
   ```

   If the user cannot provide this data, guide them step by step to obtain it. Do not proceed with optimization recommendations without at least Lighthouse lab data for the target page.

4. **Define performance targets and budgets.** Establish measurable goals. If the user has not defined targets, propose targets based on these thresholds:

   **Core Web Vitals targets (aligned with Google's "Good" thresholds):**

   | Metric   | Good    | Needs Improvement | Poor     |
   | -------- | ------- | ----------------- | -------- |
   | **LCP**  | ≤ 2.5s  | 2.5s – 4.0s       | > 4.0s   |
   | **INP**  | ≤ 200ms | 200ms – 500ms     | > 500ms  |
   | **CLS**  | ≤ 0.1   | 0.1 – 0.25        | > 0.25   |
   | **TTFB** | ≤ 800ms | 800ms – 1800ms    | > 1800ms |
   | **FCP**  | ≤ 1.8s  | 1.8s – 3.0s       | > 3.0s   |

   **Bundle size budgets (per route, gzipped):**

   | Page Type                 | JS Budget             | CSS Budget           | Total Budget          |
   | ------------------------- | --------------------- | -------------------- | --------------------- |
   | Landing / marketing page  | < 100KB               | < 30KB               | < 200KB               |
   | App shell (authenticated) | < 200KB               | < 50KB               | < 350KB               |
   | Feature page within app   | < 150KB (incremental) | < 30KB (incremental) | < 250KB (incremental) |
   | Data-heavy dashboard      | < 300KB               | < 50KB               | < 500KB               |

   **Interaction responsiveness budget:**

   | Interaction Type              | Target Response Time                   |
   | ----------------------------- | -------------------------------------- |
   | Click / tap feedback          | < 100ms visual response                |
   | Page navigation (client-side) | < 300ms to meaningful content          |
   | Form submission               | < 500ms to completion or optimistic UI |
   | Search / filter               | < 200ms to results update              |
   | Scroll                        | 60fps (16.7ms per frame)               |
   | Animation                     | 60fps, no dropped frames               |

   Present targets to the user for validation. Adjust based on their business context (e.g., an internal enterprise tool may relax LCP targets but tighten interaction responsiveness).

### Phase 2 — Performance Diagnosis and Root Cause Analysis

5. **Analyze the critical rendering path.** Map the sequence of events from navigation to first meaningful paint. Identify bottlenecks at each stage:

   ```
   DNS Lookup → TCP Connect → TLS Handshake → TTFB (server response) →
   HTML Download → HTML Parse → CSS Download → CSS Parse (CSSOM) →
   Render Tree Construction → Layout → Paint → Composite →
   JS Download → JS Parse → JS Execute → Hydration (if SSR) →
   Interactive
   ```

   For each stage, check:
   - **DNS/Connection:** Are there unnecessary origins requiring new connections? Missing `preconnect` hints?
   - **TTFB:** Is server response slow? (> 800ms indicates server-side investigation needed — recommend backend optimization or edge rendering).
   - **HTML:** Is the HTML document excessively large? Inlined too much? Server-rendered too much non-critical content?
   - **Render-blocking resources:** List all CSS and synchronous JS files that block first paint. For each, determine: Can it be deferred? Inlined? Loaded asynchronously? Made non-render-blocking?
   - **Resource discovery:** Are critical resources discoverable early? Or are they hidden behind JS execution chains or CSS `@import` chains? Use `<link rel="preload">` for late-discovered critical resources.

6. **Diagnose the Largest Contentful Paint (LCP) element.** LCP is typically the single highest-impact metric. Systematically identify and optimize:

   **Step 6a — Identify the LCP element:**
   - Use Chrome DevTools Performance panel → Timings track → LCP marker to identify the element.
   - Common LCP elements: hero image, above-the-fold heading with web font, background image, video poster image, large SVG.

   **Step 6b — Decompose LCP into sub-parts and identify the bottleneck:**

   ```
   LCP = TTFB + Resource Load Delay + Resource Load Duration + Element Render Delay
   ```

   | Sub-part                   | What it measures                                               | Common cause of excess time                                                                                            |
   | -------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
   | **TTFB**                   | Server response time                                           | Slow server, no CDN, no edge caching                                                                                   |
   | **Resource Load Delay**    | Time between TTFB and when the LCP resource starts downloading | Resource not discoverable in HTML (loaded via JS or CSS), missing preload hint, render-blocking resources queued ahead |
   | **Resource Load Duration** | Time to download the LCP resource                              | Unoptimized image (wrong format, uncompressed, oversized), slow CDN, no HTTP/2                                         |
   | **Element Render Delay**   | Time between resource loaded and element painted               | Render-blocking JS, hydration delay, CSS hiding content until JS runs, `display: none` toggled by JS                   |

   **Step 6c — Apply targeted LCP optimizations based on the bottleneck:**
   - **TTFB too high:** CDN caching, edge rendering (SSR at the edge), static generation, server optimization.
   - **Resource Load Delay too high:** Add `<link rel="preload" as="image" href="...">` in the `<head>` for the LCP image. Ensure it's in the HTML source, not injected by JS. Remove `loading="lazy"` from LCP image. Use `fetchpriority="high"` on the LCP image element.
   - **Resource Load Duration too high:** Compress and resize image (serve the exact dimensions needed). Use modern formats (AVIF > WebP > JPEG). Use responsive `srcset`. Enable HTTP/2 or HTTP/3. Use a CDN with edge PoPs close to users.
   - **Element Render Delay too high:** Reduce render-blocking CSS. Inline critical CSS. Reduce JS bundle that must execute before render. Avoid CSS `opacity: 0` or `visibility: hidden` patterns that hide content until JS runs. Minimize hydration cost (partial hydration, progressive hydration, streaming SSR).

7. **Diagnose Interaction to Next Paint (INP).** INP measures the responsiveness of all interactions throughout the page lifecycle. Systematically diagnose:

   **Step 7a — Identify the slow interaction:**
   - Use Chrome DevTools Performance panel with "Interactions" track enabled. Record user interactions and identify those exceeding 200ms.
   - Use the `web-vitals` library with `onINP()` and `attribution` build to identify which element and event type caused the worst INP in the field.
   - Common culprits: form submissions, dropdown opens/closes, accordion toggles, search/filter operations, navigation clicks, data table sorting, modal opens.

   **Step 7b — Decompose INP into sub-parts:**

   ```
   INP = Input Delay + Processing Time + Presentation Delay
   ```

   | Sub-part               | What it measures                                      | Common cause of excess time                                                                                                |
   | ---------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
   | **Input Delay**        | Time between user interaction and event handler start | Main thread blocked by long task (other JS executing), timer callback, third-party script                                  |
   | **Processing Time**    | Time spent in the event handler(s)                    | Expensive computation in the handler, synchronous state updates causing large re-render trees, layout thrashing in handler |
   | **Presentation Delay** | Time from handler completion to next paint            | Expensive re-render, large DOM update, forced layout/reflow, slow style recalculation                                      |

   **Step 7c — Apply targeted INP optimizations:**
   - **Input Delay too high:** Break long tasks using `scheduler.yield()` (with polyfill), `setTimeout(fn, 0)`, or `scheduler.postTask()`. Defer non-critical work to `requestIdleCallback`. Reduce third-party script main thread impact. Load non-critical JS after the page is interactive.
   - **Processing Time too high:** Move expensive computation to a Web Worker. Debounce rapid-fire handlers (search input). Avoid synchronous, cascading state updates — batch them. Avoid reading layout properties (`offsetHeight`, `getBoundingClientRect`) inside event handlers followed by DOM writes (layout thrashing).
   - **Presentation Delay too high:** Reduce the number of DOM nodes re-rendered (memoization, state colocation, finer-grained reactivity). Virtualize long lists. Simplify CSS selectors in frequently-updated areas. Avoid forced synchronous layout (reading layout → writing DOM → reading layout). Use `content-visibility: auto` for off-screen content. Use CSS `contain` property to isolate layout/paint scope.

8. **Diagnose Cumulative Layout Shift (CLS).** CLS measures visual stability — how much content shifts unexpectedly during the page lifecycle:

   **Step 8a — Identify layout shift sources:**
   - Use Chrome DevTools Performance panel → Experience track → Layout Shift entries. Each shift shows the shifted elements and the shift score.
   - Use the `web-vitals` library with `onCLS()` and `attribution` build to identify the largest shift source in the field.
   - Use the Layout Shift debugger (`Layout Shift` regions in DevTools, or the `layout-shift-gif-generator` tool).

   **Step 8b — Common CLS sources and fixes:**

   | Source                                         | Fix                                                                                                                                                                                                           |
   | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Images without dimensions                      | Add explicit `width` and `height` attributes or use `aspect-ratio` in CSS                                                                                                                                     |
   | Ads or embeds without reserved space           | Use a container with `min-height` matching the expected ad/embed size                                                                                                                                         |
   | Dynamically injected content above viewport    | Append content below the viewport, or use `position: fixed`/`sticky` for banners                                                                                                                              |
   | Web fonts causing text reflow                  | Use `font-display: swap` with `size-adjust` or `font-display: optional`. Preload critical fonts. Use fallback font metrics matching (`@font-face` `ascent-override`, `descent-override`, `line-gap-override`) |
   | Late-loading CSS causing style recalculation   | Inline critical CSS. Ensure CSS loads before the content it styles                                                                                                                                            |
   | Client-side rendering replacing placeholders   | Use SSR/SSG to send the final layout from the server. Skeleton screens matching the final layout dimensions                                                                                                   |
   | Animations using `top`/`left`/`width`/`height` | Use `transform` for animations — transforms don't cause layout shifts                                                                                                                                         |

9. **Perform a JavaScript bundle diagnosis.** Analyze the JavaScript payload for optimization opportunities:

   **Step 9a — Generate and analyze the bundle visualization:**
   - Run the appropriate bundle analyzer tool and examine the treemap. Identify:
     - **Largest chunks:** Which route or entry point produces the largest JavaScript chunk?
     - **Largest dependencies:** List the top 10 dependencies by parsed size. For each, evaluate:
       - Is it tree-shakeable? (ESM exports vs. CommonJS)
       - Is there a lighter alternative? (e.g., `date-fns` → `dayjs` or `Temporal`, `lodash` → `lodash-es` or native methods, `moment` → `date-fns`, `axios` → native `fetch`)
       - Is the full library loaded when only a subset is used? (e.g., entire icon library vs. individual icon imports)
     - **Duplicate modules:** Are multiple versions of the same library bundled? (common with transitive dependencies)
     - **Dead code:** Are there modules included in the bundle that are never imported? Unused exports that aren't tree-shaken?
     - **Source maps enabled in production:** Source maps should be uploaded to error monitoring services, NOT served to users.

   **Step 9b — Analyze code splitting effectiveness:**
   - Is every route lazily loaded? Check for routes eagerly importing heavy components.
   - Are heavy third-party libraries (chart libraries, rich text editors, PDF renderers, mapping libraries) isolated in their own chunks and loaded on demand?
   - Is there a shared/vendor chunk strategy? Is it too aggressive (one massive vendor chunk) or too granular (too many small chunks causing request overhead)?
   - Check for inadvertent bundle coupling: does importing one small utility from a feature module pull in the entire feature's dependency tree?

   **Step 9c — Analyze JavaScript parse and compile cost:**
   - Check Chrome DevTools Performance panel → "Evaluate Script" events. Long script evaluation (>100ms) on mobile indicates too much JS being parsed/compiled at once.
   - Mobile devices parse JS 2–5x slower than desktop. Always benchmark against a mid-tier mobile device (Moto G Power or similar, 4x CPU throttle in DevTools).

10. **Perform a network and resource loading diagnosis.** Analyze the network waterfall for inefficiencies:

    **Step 10a — Analyze the request waterfall:**
    - **Request count:** Total requests for initial page load. Target: < 50 for initial load. Each request has overhead (DNS, TCP, TLS for new origins).
    - **Request chains (critical path depth):** Identify serial dependency chains where resource B cannot start until resource A completes. Example: HTML → JS → API call → render. Flatten chains with preloading, inlining, or server-side data fetching.
    - **Origin count:** How many distinct origins does the page contact? Each new origin requires DNS + TCP + TLS (300–600ms on slow connections). Use `<link rel="preconnect">` for critical third-party origins (max 2–4, beyond that the benefit diminishes).
    - **Resource prioritization:** Are critical resources loading before non-critical ones? Check the Priority column in DevTools Network panel. High-priority: HTML, critical CSS, LCP image, critical fonts. Low-priority: analytics, ads, below-the-fold images, non-critical JS.

    **Step 10b — Analyze compression and transfer efficiency:**
    - Is Brotli compression enabled? (10–15% smaller than gzip for text resources). Check `Content-Encoding` response header.
    - Are responses properly cached? Check `Cache-Control` headers. Static assets should have immutable, long-lived cache (`Cache-Control: public, max-age=31536000, immutable`) with content-hashed filenames for cache busting.
    - Is HTTP/2 or HTTP/3 enabled? HTTP/2 enables multiplexing (multiple requests over a single connection). HTTP/3 (QUIC) reduces connection overhead further.
    - Are there unnecessarily large responses? (APIs returning full objects when only a subset of fields is needed, HTML documents with excessive inline data).

    **Step 10c — Analyze resource hints and preloading:**
    - Document which resource hints are present and which are missing:
      - `<link rel="preconnect">` — for critical third-party origins (fonts.googleapis.com, CDN, API server).
      - `<link rel="preload">` — for critical resources not discoverable in HTML (LCP image, critical font, above-the-fold data).
      - `<link rel="prefetch">` — for resources needed on the likely next navigation.
      - `<link rel="dns-prefetch">` — lightweight hint for non-critical third-party origins.
      - `<link rel="modulepreload">` — for critical JS modules in the module dependency graph.
    - Check for over-preloading: preloading too many resources wastes bandwidth and can delay critical resources. Only preload resources that are critical for the current page and not already discoverable via HTML/CSS parsing.

11. **Perform a rendering and paint diagnosis.** Analyze the browser's rendering pipeline for inefficiencies:

    **Step 11a — Layout and reflow analysis:**
    - In Chrome DevTools Performance panel, identify Layout events. Long layout events (>10ms) indicate expensive reflows.
    - Check for **layout thrashing** (forced synchronous layout): patterns where JS reads a layout property, then writes to DOM, then reads again in a tight loop. Each read-after-write forces the browser to recalculate layout synchronously.
      ```javascript
      // BAD: Layout thrashing
      elements.forEach((el) => {
        const height = el.offsetHeight; // read (forces layout)
        el.style.height = height * 2 + "px"; // write (invalidates layout)
      });

      // GOOD: Batch reads, then batch writes
      const heights = elements.map((el) => el.offsetHeight); // batch read
      elements.forEach((el, i) => {
        el.style.height = heights[i] * 2 + "px"; // batch write
      });
      ```
    - Check DOM size. Pages with > 1,400 DOM elements start showing layout performance degradation. Pages with > 1,800 elements trigger Lighthouse warnings. Virtualize long lists and lazy-render off-screen content.

    **Step 11b — Paint and composite analysis:**
    - Enable "Paint flashing" in DevTools Rendering panel. Green rectangles show areas being repainted. Excessive repainting (especially on scroll or hover) indicates paint performance issues.
    - Check for elements creating unnecessary compositor layers. Use "Layers" panel in DevTools. Excessive layers consume GPU memory. Common causes: overuse of `will-change`, `transform: translateZ(0)` hack, too many animated elements.
    - Ensure animations only use compositor-friendly properties: `transform` and `opacity`. Animating `width`, `height`, `top`, `left`, `margin`, `padding`, `border`, `font-size` triggers layout and is expensive.

    **Step 11c — CSS performance analysis:**
    - Check for excessively complex CSS selectors in frequently updated areas (deeply nested selectors, universal selectors `*`, attribute selectors with wildcard matching).
    - Check total CSS size. Unused CSS should be identified and removed (Chrome DevTools Coverage panel).
    - Check for `@import` chains in CSS files — each `@import` creates a serial request chain. Use bundled CSS or `<link>` elements in HTML instead.

12. **Perform a memory diagnosis (if memory issues are suspected).** Analyze memory consumption and leak patterns:

    **Step 12a — Baseline memory measurement:**
    - Chrome DevTools Memory panel → Take a heap snapshot at different stages: page load, after interaction, after navigation within SPA, after repeated interaction.
    - Chrome DevTools Performance Monitor → Watch JS Heap Size over time during extended use. A steadily increasing heap that never returns to baseline indicates a memory leak.
    - Record: Initial heap size, heap after typical usage session, heap after stress test (repeated navigation, opening/closing modals, etc.).

    **Step 12b — Common frontend memory leak patterns:**

    | Leak Pattern                                              | How to Detect                                                                           | How to Fix                                                                                |
    | --------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
    | **Uncleared event listeners**                             | Heap snapshot → Retainers show event listeners holding references to detached DOM nodes | Clean up listeners in component unmount (`useEffect` cleanup, `onUnmounted`, `onDestroy`) |
    | **Uncleared timers/intervals**                            | Look for `setInterval`/`setTimeout` in component code without cleanup                   | Clear in unmount lifecycle. Use framework-aware wrappers                                  |
    | **Detached DOM nodes**                                    | Heap snapshot → Filter by "Detached" → See which JS references hold detached nodes      | Ensure component cleanup nullifies references to DOM elements                             |
    | **Closures capturing large scopes**                       | Heap snapshot → Retainers show closures holding references to large objects             | Minimize closure scope. Set captured references to `null` when no longer needed           |
    | **Unbounded caches/stores**                               | Heap snapshot → Large arrays or maps in global store growing over time                  | Implement cache eviction (LRU, max size, TTL). Clear stale query cache entries            |
    | **Subscription leaks (observables, WebSockets)**          | Heap snapshot → Active subscriptions accumulating                                       | Unsubscribe in component unmount. Use `takeUntil` or `AbortController` patterns           |
    | **React-specific: state updates on unmounted components** | Console warning (React 17), subtle leaks (React 18+)                                    | Use `AbortController` for fetch in effects. Check mounted state for async callbacks       |

    **Step 12c — Memory optimization strategies:**
    - Implement object pooling for frequently created/destroyed objects (particle systems, virtualized list items).
    - Use `WeakRef` and `WeakMap` for caches that should not prevent garbage collection.
    - Implement pagination or windowing instead of loading unbounded datasets into memory.
    - Release references to large data structures (image bitmaps, ArrayBuffers, large API responses) when they are no longer displayed.
    - Monitor and cap the size of in-memory caches (TanStack Query `gcTime`, custom LRU caches).

13. **Diagnose third-party script impact.** Third-party scripts (analytics, ads, chat widgets, A/B testing, tag managers, social embeds) are often the largest uncontrolled performance tax:

    **Step 13a — Inventory third-party scripts:**
    - List every third-party origin contacted during page load (DevTools Network panel, filtered by "Third-party" in WebPageTest).
    - For each third-party script, document:
      - **Purpose:** What business function does it serve?
      - **Load method:** Synchronous `<script>`, async `<script async>`, deferred `<script defer>`, dynamically injected, loaded via tag manager?
      - **Size:** Transfer size (gzipped) and parsed size.
      - **Main thread time:** How much CPU time does it consume during page load? (DevTools Performance panel → Bottom-Up → Group by domain).
      - **Cascading loads:** Does it load additional scripts, stylesheets, fonts, or images? How deep is the chain?
      - **Blocking impact:** Does it delay FCP, LCP, or TTI?

    **Step 13b — Third-party optimization strategies:**

    | Strategy                          | When to Apply                                                                                                                              |
    | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Remove entirely**               | Script provides no measurable business value or has a free, lighter alternative                                                            |
    | **Delay loading**                 | Script is not needed for initial page interaction. Load after `load` event, on user interaction, or on visibility (`IntersectionObserver`) |
    | **Self-host**                     | Script is static and updated infrequently. Eliminates third-party connection overhead and gives caching control                            |
    | **Use `async` or `defer`**        | Script is render-blocking but doesn't need to be. `defer` for ordered execution, `async` for independent scripts                           |
    | **Facade pattern**                | Replace heavy embed (chat widget, video player, map) with a lightweight placeholder that loads the full embed only on user interaction     |
    | **Web Worker**                    | Script performs heavy computation (analytics, A/B testing calculations). Run in worker to avoid main thread blocking                       |
    | **Tag Manager audit**             | Audit all tags in the tag manager. Remove stale tags. Set firing triggers to minimize unnecessary execution                                |
    | **`loading="lazy"` for embeds**   | Social media embeds, video players, maps — load only when scrolled into view                                                               |
    | **CSP and Subresource Integrity** | Ensure third-party scripts cannot be tampered with. Use `integrity` attribute and strict CSP                                               |

### Phase 3 — Optimization Implementation

14. **Prioritize optimizations by impact and effort.** After diagnosis, compile all identified issues into a prioritized optimization plan:

    **Optimization priority matrix:**

    | Priority          | Criteria                                                                                                       | Action                                                   |
    | ----------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
    | **P0 — Critical** | Directly impacts Core Web Vitals (failing "Good" threshold), affects >50% of users, measurable business impact | Implement immediately                                    |
    | **P1 — High**     | Significant metric improvement expected (>20% improvement on a key metric), moderate effort                    | Implement in current sprint/cycle                        |
    | **P2 — Medium**   | Measurable improvement expected, moderate effort, or preparation for future scaling                            | Plan for next sprint/cycle                               |
    | **P3 — Low**      | Minor improvement, high effort, or theoretical improvement without measured evidence                           | Backlog, revisit when higher-priority items are resolved |

    **For each optimization, document:**

    ```
    ID: PERF-[number]
    Issue: [Description of the measured problem]
    Metric impacted: [LCP / INP / CLS / Bundle Size / Memory / etc.]
    Current value: [measured baseline]
    Target value: [goal after optimization]
    Root cause: [technical root cause]
    Proposed fix: [specific implementation steps]
    Estimated effort: [hours / story points]
    Expected impact: [quantified improvement estimate]
    Risk: [any risk of regression or side effects]
    Priority: [P0 / P1 / P2 / P3]
    ```

    Present the plan as a ranked table sorted by priority, then by expected impact within each priority level.

15. **Implement resource loading optimizations.** Provide specific, implementable guidance for resource delivery:

    **Critical CSS inlining:**
    - Extract above-the-fold CSS using `critters` (webpack/vite plugin) or `critical` (npm package).
    - Inline critical CSS in the `<head>` within a `<style>` tag.
    - Load the full stylesheet asynchronously: `<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">`.
    - Keep inline CSS under 14KB (fits in the first TCP congestion window).

    **JavaScript loading strategy:**

    ```html
    <!-- Critical, must execute before render (rare — avoid if possible) -->
    <script src="critical.js"></script>

    <!-- Important but not render-blocking (most scripts) -->
    <script src="app.js" defer></script>

    <!-- Independent, order doesn't matter (analytics, non-critical features) -->
    <script src="analytics.js" async></script>

    <!-- Not needed on page load (heavy features) -->
    <!-- Load dynamically via import() on user interaction or visibility -->
    ```

    **Resource hint implementation:**

    ```html
    <head>
      <!-- Preconnect to critical origins (max 2-4) -->
      <link rel="preconnect" href="https://api.example.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

      <!-- Preload critical resources not discoverable in HTML -->
      <link
        rel="preload"
        href="/hero-image.avif"
        as="image"
        type="image/avif"
        imagesrcset="/hero-400.avif 400w, /hero-800.avif 800w"
        imagesizes="100vw"
      />
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />

      <!-- Prefetch likely next navigation -->
      <link rel="prefetch" href="/dashboard" />

      <!-- DNS prefetch for non-critical third-party origins -->
      <link rel="dns-prefetch" href="https://analytics.example.com" />
    </head>
    ```

    **HTTP caching strategy:**

    ```
    # Static assets with content hash in filename (JS, CSS, images, fonts)
    Cache-Control: public, max-age=31536000, immutable

    # HTML documents (must revalidate to get latest asset references)
    Cache-Control: no-cache
    # (no-cache means "revalidate before using cached version", NOT "don't cache")

    # API responses (varies by endpoint)
    Cache-Control: private, max-age=0, must-revalidate  # User-specific, always fresh
    Cache-Control: public, max-age=300, stale-while-revalidate=60  # Shared, 5-min fresh, serve stale while refreshing

    # Fonts (long-lived, cross-origin)
    Cache-Control: public, max-age=31536000, immutable
    Access-Control-Allow-Origin: *
    ```

16. **Implement image optimization.** Images are typically the largest payload on web pages. Define a comprehensive image strategy:

    **Format selection decision tree:**

    ```
    Is it a photograph or complex image?
    ├── Yes → AVIF (best compression) with WebP fallback, JPEG fallback
    └── No → Is it a simple graphic, icon, or illustration?
        ├── Yes → SVG (if possible, vector-based)
        │   └── If raster needed → WebP with PNG fallback
        └── Is it animated?
            ├── Yes → Animated WebP or AVIF. For short clips: <video> with MP4/WebM
            └── Use WebP with appropriate fallback
    ```

    **Responsive image implementation:**

    ```html
    <!-- Art direction (different crops for different screen sizes) -->
    <picture>
      <source
        media="(min-width: 1024px)"
        srcset="/hero-desktop.avif 1x, /hero-desktop-2x.avif 2x"
        type="image/avif"
      />
      <source
        media="(min-width: 1024px)"
        srcset="/hero-desktop.webp 1x, /hero-desktop-2x.webp 2x"
        type="image/webp"
      />
      <source
        media="(max-width: 1023px)"
        srcset="/hero-mobile.avif 1x, /hero-mobile-2x.avif 2x"
        type="image/avif"
      />
      <source
        media="(max-width: 1023px)"
        srcset="/hero-mobile.webp 1x, /hero-mobile-2x.webp 2x"
        type="image/webp"
      />
      <img
        src="/hero-desktop.jpg"
        alt="Descriptive alt text"
        width="1200"
        height="600"
        fetchpriority="high"
        decoding="async"
      />
    </picture>

    <!-- Resolution switching (same crop, different sizes) -->
    <img
      src="/product-400.jpg"
      srcset="/product-400.avif 400w, /product-800.avif 800w, /product-1200.avif 1200w"
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      alt="Product name"
      width="400"
      height="400"
      loading="lazy"
      decoding="async"
    />
    ```

    **Image loading strategy:**
    - LCP image: `fetchpriority="high"`, NO `loading="lazy"`, preload in `<head>`.
    - Above-the-fold images: `decoding="async"`, NO `loading="lazy"`.
    - Below-the-fold images: `loading="lazy"`, `decoding="async"`.
    - Background images: Use `<img>` instead when possible (better browser optimization). If CSS background is necessary, consider `image-set()` for format switching.

    **Image CDN / transformation service:**
    - Recommend an image CDN (Cloudinary, imgix, Cloudflare Images, Vercel Image Optimization, Next.js `<Image>`) for automatic format negotiation, resizing, and optimization.
    - Define the quality settings: 75–85 for JPEG/WebP (visually lossless), 60–75 for AVIF (better compression at lower quality values).

17. **Implement font optimization.** Web fonts are a common source of LCP delays and CLS:

    **Font loading strategy:**

    ```css
    /* Define font-face with fallback metrics to minimize CLS */
    @font-face {
      font-family: "Inter";
      src: url("/fonts/inter-var.woff2") format("woff2");
      font-weight: 100 900;
      font-style: normal;
      font-display: swap; /* Use 'optional' for non-critical fonts */
      unicode-range:
        U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074,
        U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      /* Fallback metrics to match system font and reduce CLS */
      ascent-override: 90%;
      descent-override: 22%;
      line-gap-override: 0%;
    }
    ```

    **Optimization checklist:**
    - [ ] Self-host fonts (eliminates third-party connection overhead).
    - [ ] Use WOFF2 format only (best compression, 95%+ browser support).
    - [ ] Use variable fonts instead of multiple weight/style files.
    - [ ] Subset fonts to include only needed character ranges (`glyphhanger`, `subfont`, Google Fonts `&text=` parameter).
    - [ ] Preload the most critical font file: `<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>`.
    - [ ] Use `font-display: swap` for critical text or `font-display: optional` for non-critical text (prevents invisible text AND layout shift — font is used only if it loads fast enough).
    - [ ] Define fallback font stack that closely matches the web font metrics: `font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;`.
    - [ ] Use `@font-face` `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` to match fallback font metrics to web font, minimizing CLS during font swap.

18. **Implement code splitting and lazy loading patterns.** Provide framework-specific, copy-paste-ready patterns:

    **React (with React.lazy and Suspense):**

    ```typescript
    // Route-level code splitting
    import { lazy, Suspense } from 'react';

    const Dashboard = lazy(() => import('./features/dashboard/DashboardPage'));
    const Settings = lazy(() => import('./features/settings/SettingsPage'));

    // With named exports (requires intermediate module or wrapper)
    const AnalyticsChart = lazy(() =>
      import('./components/AnalyticsChart').then(m => ({ default: m.AnalyticsChart }))
    );

    // Usage with proper loading fallback
    <Suspense fallback={<PageSkeleton />}>
      <Dashboard />
    </Suspense>

    // Interaction-triggered lazy loading
    const HeavyEditor = lazy(() => import('./components/RichTextEditor'));

    function EditorWrapper() {
      const [showEditor, setShowEditor] = useState(false);
      return showEditor ? (
        <Suspense fallback={<EditorSkeleton />}>
          <HeavyEditor />
        </Suspense>
      ) : (
        <button onClick={() => setShowEditor(true)}>Open Editor</button>
      );
    }

    // Prefetch on hover (load chunk before user clicks)
    function NavLink({ to, children }) {
      const prefetch = () => {
        if (to === '/dashboard') import('./features/dashboard/DashboardPage');
        if (to === '/settings') import('./features/settings/SettingsPage');
      };
      return <Link to={to} onMouseEnter={prefetch}>{children}</Link>;
    }
    ```

    **Visibility-triggered lazy loading (any framework):**

    ```typescript
    // Generic IntersectionObserver-based lazy loading
    function useLazyLoad(ref: RefObject<Element>, options?: IntersectionObserverInit) {
      const [isVisible, setIsVisible] = useState(false);

      useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          },
          { rootMargin: "200px", ...options },
        ); // 200px rootMargin = start loading before visible

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
      }, [ref]);

      return isVisible;
    }
    ```

    **Dynamic import for heavy libraries:**

    ```typescript
    // Load chart library only when chart component mounts
    async function renderChart(container: HTMLElement, data: ChartData) {
      const { Chart } = await import("chart.js/auto");
      new Chart(container, { type: "line", data });
    }

    // Load PDF renderer only when user clicks "Export PDF"
    async function exportToPDF(data: ReportData) {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      // ... generate PDF
      doc.save("report.pdf");
    }
    ```

19. **Implement rendering performance optimizations.** Provide specific patterns for preventing unnecessary work:

    **React re-render prevention:**

    ```typescript
    // 1. State colocation: move state down to the component that needs it
    // BAD: State in parent causes all children to re-render
    function Parent() {
      const [searchQuery, setSearchQuery] = useState('');
      return (
        <div>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <ExpensiveUnrelatedComponent /> {/* re-renders on every keystroke! */}
          <SearchResults query={searchQuery} />
        </div>
      );
    }
    // GOOD: Extract stateful subtree
    function Parent() {
      return (
        <div>
          <SearchFeature /> {/* state stays inside */}
          <ExpensiveUnrelatedComponent /> {/* never re-renders from search state */}
        </div>
      );
    }

    // 2. Children as props pattern (composition, not memoization)
    function ScrollTracker({ children }: { children: ReactNode }) {
      const [scrollY, setScrollY] = useState(0);
      useEffect(() => {
        const handler = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
      }, []);
      return (
        <div>
          <ScrollIndicator position={scrollY} />
          {children} {/* children don't re-render when scrollY changes */}
        </div>
      );
    }

    // 3. React.memo — only for measured performance problems
    const DataRow = React.memo(function DataRow({ item }: { item: DataItem }) {
      return <tr>...</tr>;
    });
    // Custom comparator for complex props
    const DataRow = React.memo(DataRowComponent, (prev, next) => prev.item.id === next.item.id && prev.item.updatedAt === next.item.updatedAt);

    // 4. useMemo / useCallback — only when passing to memoized children or expensive computation
    const filteredItems = useMemo(
      () => items.filter(item => item.name.includes(searchQuery)),
      [items, searchQuery]
    );

    // 5. Key management for lists
    // BAD: index as key (breaks when list reorders, causes unnecessary DOM reconciliation)
    {items.map((item, index) => <ItemCard key={index} item={item} />)}
    // GOOD: stable, unique ID as key
    {items.map(item => <ItemCard key={item.id} item={item} />)}
    ```

    **Virtualization for long lists:**

    ```typescript
    import { useVirtualizer } from '@tanstack/react-virtual';

    function VirtualizedList({ items }: { items: Item[] }) {
      const parentRef = useRef<HTMLDivElement>(null);
      const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 64, // estimated row height in px
        overscan: 5, // render 5 extra items above/below viewport
      });

      return (
        <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
            {virtualizer.getVirtualItems().map(virtualRow => (
              <div key={virtualRow.key}
                   style={{ position: 'absolute', top: 0, left: 0, width: '100%',
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)` }}>
                <ItemRow item={items[virtualRow.index]} />
              </div>
            ))}
          </div>
        </div>
      );
    }
    ```

    **Web Worker offloading for CPU-intensive tasks:**

    ```typescript
    // worker.ts
    self.addEventListener("message", (event) => {
      const { type, payload } = event.data;
      if (type === "FILTER_AND_SORT") {
        const result = heavyFilterAndSort(payload.items, payload.criteria);
        self.postMessage({ type: "RESULT", payload: result });
      }
    });

    // component.ts — using comlink for ergonomic worker API
    import { wrap } from "comlink";
    const worker = wrap<WorkerAPI>(
      new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }),
    );
    const filteredItems = await worker.filterAndSort(items, criteria);
    ```

20. **Implement perceived performance optimizations.** Even when actual performance is optimized, perceived performance determines user satisfaction:

    **Skeleton screens:**
    - Display content-shaped placeholders matching the final layout dimensions during loading.
    - Skeletons should pulse/animate subtly to indicate loading (not static gray boxes).
    - Transition from skeleton to content without layout shift (same dimensions).
    - Use CSS-only skeletons where possible (no JS overhead):
      ```css
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      @keyframes skeleton-pulse {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      ```

    **Optimistic UI updates:**
    - For mutations with predictable outcomes (like, bookmark, toggle, simple edits), update the UI immediately before the API responds.
    - Define the rollback strategy: revert the UI change and show an error toast if the API request fails.
    - TanStack Query `useMutation` with `onMutate` (optimistic update) and `onError` (rollback) is the recommended pattern.

    **Instant navigation:**
    - Prefetch data for likely next pages on link hover or viewport intersection.
    - Use `startTransition` (React 18+) for non-urgent navigation updates to keep the current page interactive.
    - Show a progress indicator only if navigation takes > 300ms (avoid flashing indicators for fast navigations).

    **Progressive loading:**
    - Load and render content in priority order: critical above-the-fold content first, then secondary content, then enhancements.
    - Use `Suspense` boundaries at strategic points to progressively reveal content as data arrives.
    - For SSR: use streaming SSR to send HTML progressively as data becomes available on the server.

### Phase 4 — Performance Monitoring and Regression Prevention

21. **Design the Real User Monitoring (RUM) instrumentation.** Define how performance is measured continuously in production:

    **Core metrics to collect:**

    ```typescript
    import { onLCP, onINP, onCLS, onFCP, onTTFB, Metric } from "web-vitals";

    function sendToAnalytics(metric: Metric) {
      const payload = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        // Attribution (requires /attribution build)
        ...(metric.attribution && { attribution: metric.attribution }),
        // Custom dimensions
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        connectionType: (navigator as any).connection?.effectiveType,
        deviceMemory: (navigator as any).deviceMemory,
        appVersion: __APP_VERSION__,
      };

      // Use sendBeacon to ensure data is sent even on page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/vitals", JSON.stringify(payload));
      } else {
        fetch("/api/vitals", { body: JSON.stringify(payload), method: "POST", keepalive: true });
      }
    }

    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    ```

    **Custom performance metrics to instrument:**

    | Metric                           | What to Measure                                      | How                                                                                                          |
    | -------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
    | **Time to Interactive (custom)** | When the primary feature of the page is usable       | `performance.mark()` at the point the main feature renders and is interactive                                |
    | **Data fetch duration**          | API response times as experienced by the user        | Instrument the API client to log request start/end times per endpoint                                        |
    | **Component render time**        | Time spent rendering expensive components            | React Profiler API, Vue devtools performance tracing, or manual `performance.mark()`/`performance.measure()` |
    | **Client-side navigation time**  | Time from route change initiation to new page render | `performance.mark()` at navigation start and first meaningful paint of new page                              |
    | **Long tasks**                   | JS tasks blocking the main thread for >50ms          | `PerformanceObserver` with `entryTypes: ['longtask']`                                                        |
    | **Resource timing**              | Load time of critical resources                      | `PerformanceObserver` with `entryTypes: ['resource']`, filtered to critical assets                           |
    | **Memory usage**                 | JS heap size over time                               | `performance.memory` (Chrome only), sampled at intervals                                                     |

    **Segmentation dimensions:**
    - Page type (landing, dashboard, product detail, checkout).
    - Device category (mobile, tablet, desktop).
    - Connection speed (4G, 3G, slow-2G via `navigator.connection.effectiveType`).
    - Geographic region.
    - Browser and browser version.
    - New vs. returning user (cold cache vs. warm cache).
    - App version / deployment (correlate performance with releases).

    **Alerting and SLO monitoring:**
    - Define SLOs for each Core Web Vital at p75:
      - LCP p75 < 2.5s
      - INP p75 < 200ms
      - CLS p75 < 0.1
    - Alert when p75 degrades by more than 20% compared to the previous 7-day window.
    - Alert when the percentage of "poor" ratings exceeds 10% for any Core Web Vital.
    - Alert when a new deployment causes a statistically significant regression (A/B comparison of pre/post deployment metrics).

22. **Design the synthetic monitoring strategy.** Complement RUM with controlled, reproducible lab tests:

    **Lighthouse CI integration:**

    ```yaml
    # lighthouserc.json
    {
      "ci":
        {
          "collect":
            {
              "url":
                [
                  "https://example.com/",
                  "https://example.com/dashboard",
                  "https://example.com/product/example-product",
                  "https://example.com/checkout",
                ],
              "numberOfRuns": 3,
              "settings": { "preset": "desktop", ? // or "mobile" — run both
                    "throttling"
                  : { "cpuSlowdownMultiplier": 4  // Simulate mobile CPU } },
            },
          "assert":
            {
              "assertions":
                {
                  "categories:performance": ["error", { "minScore": 0.9 }],
                  "categories:accessibility": ["error", { "minScore": 0.95 }],
                  "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
                  "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
                  "total-blocking-time": ["error", { "maxNumericValue": 200 }],
                  "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
                  "interactive": ["error", { "maxNumericValue": 3800 }],
                },
            },
          "upload": { "target": "lhci", ? // or "temporary-public-storage" for quick setup
                "serverBaseUrl"
              : "https://lhci.example.com" },
        },
    }
    ```

    **Scheduled synthetic tests:**
    - Run Lighthouse against production pages every hour from multiple geographic locations.
    - Track scores over time. Visualize trends on a dashboard.
    - Run WebPageTest for detailed waterfall analysis on a weekly cadence for critical pages.
    - Set up SpeedCurve or Calibre for automated competitive benchmarking against key competitors.

23. **Design the performance budget enforcement system.** Prevent regressions by making performance a build-time constraint:

    **Bundle size budgets in CI:**

    ```javascript
    // bundlesize configuration (package.json or .bundlesizerc)
    {
      "bundlesize": [
        { "path": "dist/assets/index-*.js", "maxSize": "150 kB", "compression": "gzip" },
        { "path": "dist/assets/vendor-*.js", "maxSize": "100 kB", "compression": "gzip" },
        { "path": "dist/assets/index-*.css", "maxSize": "30 kB", "compression": "gzip" },
        { "path": "dist/assets/*.js", "maxSize": "300 kB", "compression": "gzip" } // total JS
      ]
    }
    ```

    **Alternative: `size-limit` (more flexible):**

    ```json
    // package.json
    {
      "size-limit": [
        { "path": "dist/assets/index-*.js", "limit": "150 kB", "gzip": true },
        {
          "path": "dist/assets/index-*.js",
          "limit": "45 kB",
          "import": "{ render }",
          "brotli": true
        },
        { "path": "dist/**/*.js", "limit": "300 kB", "gzip": true }
      ]
    }
    ```

    **Import cost awareness:**
    - Install and configure the `Import Cost` VS Code extension to show inline bundle size impact of imports.
    - Consider `eslint-plugin-import` with custom rules to warn or error on imports from known heavy packages.
    - Use `knip` to detect unused exports and dependencies.

    **Performance regression CI gate (complete pipeline step):**

    ```yaml
    # GitHub Actions example
    performance-check:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
        - run: npm ci
        - run: npm run build

        # Bundle size check
        - run: npx size-limit

        # Lighthouse CI
        - run: npx @lhci/cli@latest autorun

        # Bundle analysis diff (compare against main branch)
        - uses: preactjs/compressed-size-action@v2
          with:
            repo-token: "${{ secrets.GITHUB_TOKEN }}"
            pattern: "dist/**/*.{js,css}"
            # Posts a comment on the PR showing size delta per file
    ```

24. **Design the performance review and continuous improvement process.** Performance is not a one-time fix — it requires ongoing discipline:

    **Weekly performance review (automated):**
    - Generate a weekly performance report from RUM data:
      - Core Web Vitals trends (p50, p75, p95) for each page type.
      - Percentage of page loads meeting "Good" thresholds.
      - Slowest pages ranked by p75 LCP.
      - Worst interactions ranked by p75 INP.
      - Top layout shift sources ranked by frequency and shift score.
    - Compare against the previous week and flag regressions.

    **Per-release performance validation:**
    - Before every production deployment, compare Lighthouse CI scores against the previous release.
    - If any assertion fails, block the deployment and investigate.
    - Track bundle size delta per release. Flag any release that adds >5KB gzipped JS.

    **Quarterly performance audit:**
    - Conduct a full audit using Steps 3–13 of this skill.
    - Re-evaluate third-party scripts (Step 13) — new scripts added? Existing ones still needed?
    - Re-evaluate dependencies — lighter alternatives available? Unused dependencies removable?
    - Re-evaluate performance budgets — should they be tightened based on achieved improvements?
    - Benchmark against competitors and industry standards.
    - Update performance targets based on changing user demographics and device capabilities.

    **Performance culture practices:**
    - Require performance impact assessment for PRs that add new dependencies.
    - Include performance data in feature launch criteria.
    - Make performance dashboards visible to the team (wall display, Slack bot, weekly standup metric).
    - Celebrate performance wins with before/after metrics.

### Phase 5 — Advanced Performance Patterns

25. **Implement advanced caching strategies.** Define multi-layer caching for maximum performance:

    **Layer 1 — Browser HTTP cache:**
    - Configured via `Cache-Control` headers (covered in Step 15).
    - Content-hashed filenames for cache busting on deployments.
    - `stale-while-revalidate` directive for API responses that can tolerate brief staleness.

    **Layer 2 — Service Worker cache (for offline and instant repeat visits):**

    ```typescript
    // Service worker caching strategies
    // 1. Cache First (static assets — fonts, images, app shell)
    //    Check cache → if found, return cached → if not, fetch, cache, return

    // 2. Stale While Revalidate (frequently updated but not critical freshness)
    //    Return cached immediately → fetch updated version → update cache for next request

    // 3. Network First (API calls, user data — freshness critical)
    //    Fetch from network → if fails, fall back to cache → update cache on success

    // 4. Network Only (analytics, real-time data)
    //    Always fetch from network. No caching.

    // 5. Cache Only (versioned, immutable assets)
    //    Only serve from cache. Assets populated during install.
    ```
    - Use Workbox for service worker caching (abstracts strategies, handles precaching, provides routing).
    - Define the precache manifest: app shell HTML, critical CSS, critical JS, critical fonts.
    - Define runtime caching routes: image CDN → Cache First with 30-day expiration and max 200 entries; API → Stale While Revalidate or Network First depending on endpoint.
    - Define cache storage limits and eviction policies to prevent unbounded storage growth.

    **Layer 3 — Application-level cache (in-memory):**
    - TanStack Query / SWR cache for API responses (covered in frontend-core Step 12).
    - Computed value memoization (`useMemo`, `computed`).
    - Component output memoization (`React.memo`).
    - Module-level singleton caches for expensive computations (with size bounds).

    **Layer 4 — CDN / Edge cache:**
    - Static assets served from CDN edge nodes.
    - SSR responses cached at the edge (Vercel ISR, Cloudflare Cache, CDN cache with `Surrogate-Control` headers).
    - Define cache invalidation strategy: path-based purge, tag-based purge, or deploy-time full purge.

26. **Implement SSR and hydration performance optimizations.** For server-rendered applications, hydration is often the largest performance bottleneck:

    **Hydration cost diagnosis:**
    - Measure time from HTML received to fully interactive (TTI). The gap is primarily hydration cost.
    - In React DevTools Profiler, identify the hydration render and its duration.
    - Check for hydration mismatches (console warnings) — these cause React to discard server-rendered HTML and re-render entirely, negating SSR benefits.

    **Hydration optimization strategies:**

    | Strategy                        | Framework Support                  | Description                                                                                                             |
    | ------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
    | **Streaming SSR**               | React 18+, Vue 3, SvelteKit, Remix | Send HTML progressively as data resolves. User sees content before all data is ready                                    |
    | **Selective hydration**         | React 18+ (Suspense)               | Hydrate components independently. Interactive components hydrate first                                                  |
    | **Progressive hydration**       | React (custom), Vue (custom)       | Defer hydration of below-the-fold or non-interactive components until visible or idle                                   |
    | **Partial hydration (Islands)** | Astro, Fresh (Deno)                | Only hydrate interactive "islands." Static content ships zero JS                                                        |
    | **Resumability**                | Qwik                               | Serialize component state and event handlers into HTML. No replay of component tree on client. Near-zero hydration cost |
    | **React Server Components**     | Next.js App Router, React 19+      | Components that run only on the server. Zero client JS for server components. Client components hydrate normally        |

    **Practical SSR optimizations:**
    - Move data fetching to the server (server components, `getServerSideProps`, loader functions) to eliminate client-side fetch waterfalls.
    - Stream the response with `renderToPipeableStream` (React) to send the shell immediately while data-dependent sections stream in.
    - Use `<Suspense>` boundaries to define streaming chunks and progressive hydration units.
    - Avoid importing heavy client-side libraries in server components.
    - Cache server-rendered responses at the CDN/edge level when content is shared across users.

27. **Implement animation and visual performance optimizations.** Define the strategy for smooth, performant animations:

    **Animation performance rules:**

    ```
    SAFE (compositor-only, GPU-accelerated, no layout/paint):
    ✅ transform (translate, scale, rotate, skew)
    ✅ opacity
    ✅ filter (blur, brightness, contrast — GPU in most browsers)
    ✅ clip-path (GPU in most browsers)

    EXPENSIVE (trigger layout and/or paint):
    ❌ width, height, top, left, right, bottom
    ❌ margin, padding, border
    ❌ font-size, line-height
    ❌ display, position
    ❌ box-shadow (triggers paint)
    ❌ background-color (triggers paint — but cheap)
    ```

    **CSS animation (preferred for simple transitions):**

    ```css
    /* Use CSS transitions for state changes */
    .panel {
      transform: translateX(-100%);
      opacity: 0;
      transition:
        transform 300ms ease-out,
        opacity 300ms ease-out;
    }
    .panel.open {
      transform: translateX(0);
      opacity: 1;
    }

    /* Respect user preferences */
    @media (prefers-reduced-motion: reduce) {
      .panel {
        transition: none;
      }
    }
    ```

    **JavaScript animation (for complex, orchestrated animations):**
    - Use the Web Animations API (WAAPI) for programmatic control with compositor-accelerated performance.
    - Use `requestAnimationFrame` for custom animation loops (never `setInterval` or `setTimeout`).
    - For complex animation libraries: Framer Motion (React), Motion One (framework-agnostic, lightweight), GSAP (most powerful, larger bundle).
    - Avoid Lottie for performance-critical paths (heavy JSON parsing, canvas rendering).

    **Scroll-driven animations (modern CSS):**

    ```css
    /* CSS Scroll-Driven Animations (Chrome 115+) */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-on-scroll {
      animation: fadeIn linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 100%;
    }
    ```

    **`will-change` usage rules:**
    - Apply `will-change` only to elements that are about to animate (e.g., add on hover, remove after animation completes).
    - Never apply `will-change` to many elements simultaneously (each creates a compositor layer consuming GPU memory).
    - Never use `will-change: transform` as a permanent style. It's a hint, not an optimization.

28. **Implement advanced network optimization patterns.** Beyond basic resource loading:

    **Speculative loading with the Speculation Rules API (Chrome 109+):**

    ```html
    <script type="speculationrules">
      {
        "prerender": [
          {
            "where": {
              "and": [
                { "href_matches": "/*" },
                { "not": { "href_matches": "/logout" } },
                { "not": { "selector_matches": ".no-prerender" } }
              ]
            },
            "eagerness": "moderate" // prerender on hover
          }
        ],
        "prefetch": [
          {
            "where": { "href_matches": "/*" },
            "eagerness": "conservative" // prefetch on mouse down
          }
        ]
      }
    </script>
    ```

    **API request optimization:**
    - **Request batching:** Combine multiple related API calls into a single request (GraphQL natural batching, custom batch endpoints, DataLoader pattern).
    - **Request deduplication:** Ensure the same API call made by multiple components simultaneously results in only one network request (TanStack Query handles this automatically).
    - **Partial responses:** Request only needed fields (GraphQL field selection, REST `?fields=` parameter, JSON:API sparse fieldsets).
    - **Conditional requests:** Use `ETag` / `If-None-Match` or `Last-Modified` / `If-Modified-Since` to avoid re-downloading unchanged data (304 Not Modified).
    - **Request prioritization:** Use `fetch()` with `priority: 'high'` for critical data, `priority: 'low'` for non-essential data. Abort low-priority requests when the user navigates away (`AbortController`).
    - **Connection management:** Use `<link rel="preconnect">` for critical API origins. Use HTTP/2 multiplexing (avoid domain sharding, which is an HTTP/1.1 optimization that hurts HTTP/2).

    **Compression:**
    - Enable Brotli compression on the server/CDN for all text resources (HTML, CSS, JS, JSON, SVG). Brotli achieves 10–15% better compression than gzip.
    - For JSON API responses, consider structured data compression (MessagePack, Protocol Buffers) for high-volume endpoints.
    - For static assets, pre-compress at build time (`.br` and `.gz` files) and configure the server to serve the appropriate version based on `Accept-Encoding`.

### Phase 6 — Performance Deliverable Assembly

29. **Compose the performance analysis and optimization report.** Organize all outputs into a structured deliverable:
    1. **Executive Summary** — One-paragraph overview: current performance state, key findings, and expected impact of recommended optimizations.
    2. **Performance Context** — Application type, tech stack, target audience, existing constraints (from Steps 1–2).
    3. **Baseline Measurements** — Full baseline data with lab and field metrics for each critical page (from Step 3).
    4. **Performance Targets** — Defined targets and budgets with justification (from Step 4).
    5. **Diagnosis Findings** — Root cause analysis for each identified performance issue, organized by metric category:
       - LCP findings (from Step 6)
       - INP findings (from Step 7)
       - CLS findings (from Step 8)
       - Bundle analysis findings (from Step 9)
       - Network findings (from Step 10)
       - Rendering findings (from Step 11)
       - Memory findings (from Step 12, if applicable)
       - Third-party script findings (from Step 13)
    6. **Prioritized Optimization Plan** — Ranked table of all recommended optimizations with effort estimates, expected impact, and priority (from Step 14).
    7. **Implementation Guidance** — Specific, code-level implementation instructions for each optimization (from Steps 15–20, 25–28, as applicable).
    8. **Monitoring and Prevention Plan** — RUM instrumentation, synthetic monitoring, performance budgets, CI integration (from Steps 21–24).
    9. **Expected Results** — Projected post-optimization metrics based on the implemented changes. Define a re-measurement plan: re-baseline 1 week after optimizations are deployed and compare.
    10. **Open Questions** — Unresolved items, measurements that need more data, optimizations requiring further investigation.

30. **Adapt the depth and format to the user's need.** Apply these guidelines:
    - **Quick question** (user asks a focused question, e.g., "how do I fix my LCP?"): Jump directly to Step 6, diagnose LCP, and provide targeted optimization guidance. Ask for the LCP element and current TTFB.
    - **Specific metric optimization** (user wants to improve one Core Web Vital): Execute Steps 2–4 for context, then the relevant diagnostic step (6 for LCP, 7 for INP, 8 for CLS), then the relevant optimization steps, then monitoring recommendations.
    - **Bundle optimization** (user wants to reduce bundle size): Execute Steps 2, 9, 14, 18, and 23. Provide a concrete action plan with expected size reductions.
    - **Full performance audit** (user wants a comprehensive assessment): Execute all steps sequentially, producing the full deliverable from Step 29.
    - **Performance infrastructure setup** (user wants monitoring and budgets): Execute Steps 3–4, 21–24. Provide copy-paste configurations.
    - **Code review for performance** (user presents code with performance concerns): Map the code against the relevant optimization patterns (Steps 15–20, 25–28) and provide specific refactoring recommendations with before/after code.

    Always state which depth level you are operating at and why.

31. **Maintain an empirical, iterative approach.** Performance optimization is a cycle: measure → hypothesize → optimize → verify. After delivering the initial analysis:
    - Never recommend optimizations without measured evidence of a problem. Premature optimization adds complexity without proven benefit.
    - After each optimization is implemented, re-measure the affected metrics to verify improvement and detect regressions in other metrics.
    - Invite the user to share updated measurements so recommendations can be refined.
    - When multiple optimizations are planned, implement and measure them one at a time (or in small, related batches) to attribute impact accurately.
    - Performance characteristics change as the application evolves — recommend periodic re-auditing (quarterly for active products).
    - Stay current with browser capabilities: new APIs (`Speculation Rules`, `scheduler.yield()`, `Popover`, `View Transitions`, CSS `content-visibility`, `@scope`, `@layer`) can obsolete older optimization techniques. Recommend modern approaches when browser support meets the user's support matrix.
